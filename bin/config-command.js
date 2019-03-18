/*! Copyright (c) 2018 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs');
const path = require('path');

const PoppyRequestHandler = require('../lib/utils/PoppyRequestHandler');

const Status = require('../tools/status'),
    createStatus = Status.createStatus,
    StatusEnum = Status.StatusEnum
;
const toTree = require('../tools/tree').toTree;

//////////////////////////////////
//////////////////////////////////
// Public API
//////////////////////////////////
//////////////////////////////////

module.exports = (yargs, helper) => yargs.command(
    'config',
    'Display/Check/Discover the Poppy motor configuration.',
    (yargs) => {
        let optionHelper = helper.optionHelper;

        optionHelper.addOptions(
            yargs,
            'Query Options:',
            ['motor_conf', 'validate', 'discover', 'save_descriptor', 'all']
        );
        optionHelper.addPoppyConfigurationOptions(yargs);
        helper.optionHelper.addOptions( // add save option
            yargs,
            'Poppy Setting Options:',
            ['save_config']
        );

        yargs
            .strict()
            .implies(
                optionHelper.get('save_descriptor').key,
                optionHelper.get('discover').key)
            .example(
                `$0 config`,
                'Check connection settings.'
            )
            .example(
                `$0 config -M`,
                'Check connection settings and display the robot descriptor (i.e. the motor configuration).'
            )
            .example(
                `$0 config -v`,
                'Check if the descriptor file matches with the target robot'
            )
            .example(
                `$0 config -D -S myPoppy.json`,
                'Discover the Poppy motor configuration and save it to a descriptor file'
            )
            .example(
                `$0 config -D -S myPoppy.json -s`,
                'Discover the Poppy motor configuration, save it to a descriptor file and set the .poppyrc file'
            )
        ;
    },
    (argv) => main(argv, helper.poppy) // Main job
);

//////////////////////////////////
//////////////////////////////////
// Private
//////////////////////////////////
//////////////////////////////////

//////////////////////////////////
// The command itself
//////////////////////////////////

const main = async (argv, poppy) => {

    // Poppy object handles the configuration settings provided by users.
    let configObject = poppy.getConfig();
   
    // Let's instantiate a new request handler object 
    // with user's connexion settings.
    let requestHandler = new PoppyRequestHandler(configObject.connect);
    let cnxSettings = requestHandler.getSettings(); // full cnx settings

    //
    // First of all, let check connexion settings
    //

    console.log(`>> Connection to Poppy (hostname/ip: ${cnxSettings.ip})`);

    let cnxStatus = await _basicConnectionTest(requestHandler);

    console.log(`  Http server (port ${cnxSettings.httpPort}):\t ${cnxStatus['http'].display()}`);
    console.log(`  Snap server (port ${cnxSettings.snapPort}):\t ${cnxStatus['snap'].display()}`);

    //
    // On a second hand, let's discover/display/validate configuration, if asked
    //

    let discover = argv.D;
    let validate = argv.v;
    let displayMotor = argv.M;

    let displayMotorConfiguration = discover || validate || displayMotor;

    if ( displayMotorConfiguration ) {

        if ( // Early exit
            discover && !cnxStatus['http'].isOk()
        ) {
            console.log(
                '>> Unable to discover the motor configuration of the Robot.'
                + '  Please check connection settings.'
            );
            process.exit();
        }

        let descriptor;
        let source;
        let mStatusObject = {};

        if ( discover ) {

            source = 'live discovering';
            descriptor = await _discoverDescriptor(requestHandler);
            // We just connect to all available motors then all is ok
            descriptor.motors.forEach(
                motor => mStatusObject[motor.name] = createStatus(StatusEnum.ok)
            );

            if ( argv.S ) {
                fs.writeFileSync(
                    path.resolve(process.cwd(), argv.S),
                    JSON.stringify(descriptor)
                );
                configObject.descriptor = `file://${argv.S}`;
            }

        } else { // Get info from the descriptor file

            source = configObject.descriptor
                || `default configuration`
            ;
            descriptor = poppy.getDescriptor();
            
            // Should the descriptor be validated?
            mStatusObject = validate ?
                await validateDescriptor(requestHandler, descriptor, cnxStatus['http'].isOk()):
                {}
            ;
        }

        console.log(`>> Poppy motors: from ${source}`);

        let poppyStatus = validate ? `${cnxStatus['http'].display()}`: '';

        console.log(`Poppy ${poppyStatus}`);
        console.log(
            treeify(descriptor, mStatusObject, argv.a)
        );

    }

    //
    // At last, the save setting options
    //

    if ( argv.s ) {
        console.log('>> Save settings in local .poppyrc file');

        let desc = configObject.descriptor ?
            configObject.descriptor : 
            'default descriptor'
        ;
        console.log(`  descriptor: ${desc}`)

        let cnx = configObject.connect;
        if ( cnx && 0 !== Object.keys(cnx).length ) {
            console.log('  connection settings:');
            for (let p in cnx ) {
                console.log(`    ${p}= ${cnx[p]}`);
            }
        } else {
            console.log('  connection settings: default');
        }
        
        fs.writeFileSync(
            path.resolve(process.cwd(), '.poppyrc'),
            JSON.stringify(configObject)
        );
    }

    // It seems to be an axios issue: when a request raises a connection error,
    // a Promise still exists somewhere and we await until the timeout will be reached.
    process.exit();
}

//////////////////////////////////
// Check connection settings.
//////////////////////////////////

const _basicConnectionTest = async (requestHandler) => {

    let result = Object.create(null);

    // Next to switch on, the first request always failed.
    // Then, Let perform a dummy one at every call of this command...
    await _dummyHttpRequest(requestHandler);

    //
    // Test the http server
    //
    result['http'] = await _dummyHttpRequest(requestHandler);

    //
    // Test snap settings, if http test succeeds
    //
    if ( result['http'].isOk() ) {
        // Let's get a motor Id to test the snap connexion settings
        let alias = (await requestHandler.getAliases())['alias']
            .shift() // Let get first alias
        ;
       let motorId = (await requestHandler.getAliasMotors(alias))['alias']
           .shift() // ... and is first motor
        ;

        result['snap'] = await _ledSnapRequest(requestHandler, motorId);
    } else {
        result['snap'] = createStatus(StatusEnum.error, 'Unable to connect');
    }

    return result;
}


const _dummyHttpRequest = async (requestHandler) => {
    let status;
    try {
        await requestHandler.getAliases();
        status = createStatus(StatusEnum.ok);
    } catch(e) { status = createStatus(StatusEnum.error, 'Unable to connect');}
    
    return status;
}

const _ledSnapRequest = async (requestHandler, motorId) => {
    let status;
    // We need a motor to test it
    try {
        await requestHandler.led(motorId, 'off');
        status = createStatus(StatusEnum.ok);
    } catch(e) { status = createStatus(StatusEnum.error, 'Unable to connect');}
    return status;
}

//////////////////////////////////
// Discover robot configuration.
//////////////////////////////////

const _discoverDescriptor = async (requestHandler) => {

    // Aliases
    let aliases = await _discoverAliases(requestHandler);

    // Motors
    let motors = [];
    for ( let alias of aliases) {
        motors.push( ...await Promise.all(
            alias.motors.map( async motorId => _getMotorDetails(requestHandler, motorId) )
        ));
    }

    return Object.assign({}, {aliases, motors});
}

const _discoverAliases = async (requestHandler) => {

    let result = [];

    // Aliases
    let aliases = (await requestHandler.getAliases())['alias'];

    for (let alias of aliases) {
    //await Promise.all( aliases.map( async alias => {
    
        let motors = (await requestHandler.getAliasMotors(alias))['alias'];

        result.push({
            name: alias,
            motors: motors
        });
    }//));

    return result;

}

const _getMotorDetails = async (requestHandler, motorId) => {
    let registers = ['lower_limit', 'upper_limit'];
    let values = (await Promise.all(
        registers.map( async register =>
            (await requestHandler.getMotorRegister(motorId, register))[register]
        )))
        .map( value => Math.round(value) )
    ;

    return registers.reduce(
        (acc, register, i) => { acc[register] = values[i]; return acc;},
        {name: motorId}
    );
}

//////////////////////////////////
// Validate descriptor
//////////////////////////////////

const validateDescriptor = async (requestHandler, descriptor, isConnected) => {
    let result = Object.create(null);

    if ( isConnected ) {
        for (let motor of descriptor.motors) {
            try {
                let m = await _getMotorDetails(requestHandler, motor.name);
                // add a default status object.
                result[motor.name] = createStatus(StatusEnum.ok);
                // and check angle limit
                ['lower_limit', 'upper_limit'].forEach( register => {
                    if ( m[register] !== motor[register]) {
                        let status = createStatus(
                            StatusEnum.error,
                            `\'${register}\' value does not match (${motor[register]}/${m[register]})`
                        );
                        Object.assign(status, {id: register});
                        result[motor.name].addChild(status);
                    }
                });
            } catch (e) {
                result[motor.name] = createStatus(
                    StatusEnum.error,
                    `Unable to connect to motor ${motor.name}`
                );
            }
        }
    } else {
        descriptor.motors.forEach( motor => {
            result[motor.name] = createStatus(
                StatusEnum.error,
                `Unable to connect to motor ${motor.name}`
            );
        });
    }

    return result;
}

//////////////////////////////////
// Display misc.
//////////////////////////////////

const treeify = (descriptor, mStatusObject, showDetails ) => toTree(
    tr(descriptor),
    (property, parent) => {

        let status;
        try {
            if ( ['lower_limit','upper_limit'].includes(property) ) {
                status = mStatusObject[parent.name]
                    .getChildren() // Get the sub-statuses for this property
                    .find( status => property === status.id)
                ;
            } else {
                status = mStatusObject[property]; // for motor    
            }
        } catch (e) { /* Do nothing */}
        return status ? status.display(true):'';
    },
    {
        onlyObject: !showDetails,
        filter: (property) => property !== 'name'
    }
);

const tr = (descriptor) => {
    let result = {};

    descriptor.aliases.forEach( alias => {
        let aliasObject = {}; 

        alias.motors.forEach( motor => {
            aliasObject[motor] = Object.assign(
                {},
                descriptor.motors.find( elt => motor === elt.name)
            );
        });
        result[alias.name] = aliasObject;
    });

    return result;
}