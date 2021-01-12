#!/usr/bin/env node
const yargs = require('yargs');
let yankit = require('./lib/yank.js')
let package = require('./package.json')

const argv = yargs
    .command('yank', 'Yanks a folder structure from a given folder.', {
        folder: {
            description: 'The master folder of the structure to be yanked.',
            alias: 'f',
            type: 'string',
        },
        name: {
            description: 'Name of the yank to be registered in the Yankfile.',
            alias: 'n',
            type: 'string',
        }
    })
    .command('unyank', 'Deletes a yank from the Yankfile.', {
        name: {
            description: 'Name of the yank to be deleted from the Yankfile.',
            alias: 'n',
            type: 'string',
        }
    })
    .command('gityank', 'Yanks a folder structure from a Git repository.', {
        url: {
            description: 'The repository URL.',
            alias: 'u',
            type: 'string',
        },
        name: {
            description: 'Name of the yank to be registered in the Yankfile.',
            alias: 'n',
            type: 'string',
        }
    })
    .option('version', {
        alias: 'v',
        description: 'Show the version'
    })
    .help()
    .alias('help', 'h')
    .argv;

    if(argv.version){
        let version = package.version
        //console.log('Yankit v' + version)
    }

    if (argv._.includes('yank')) {
        const folder = argv.folder;
        const name = argv.name;

        yankit.yank(folder, name)
    }

    if (argv._.includes('unyank')) {
        const name = argv.name;

        yankit.unyank(name)
    }

    if (argv._.includes('gityank')) {
        const url = argv.url;
        const name = argv.name;

        yankit.yankGitRepo(url, name)
    }