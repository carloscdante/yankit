const fs = require('fs');
const os = require('os');
const chalk = require('chalk');
const yankit = require('./yank.js')
const shell = require('shelljs');

let home = os.homedir()
let configPath = home + '/' + '.config/yankit'
let yanks = {}

function populateDirectories(yank, destination){
    dirs = yankit.get(yank)
    shell.exec('cd ', destination)
    dirs.forEach((dir) => {
        shell.exec('mkdir ' + dir)
        console.log(chalk.blueBright('Creating directory ', destination + dir + '...'))
    })
    console.log(chalk.greenBright('Done!'))
}

exports.populate = populateDirectories;