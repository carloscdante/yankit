//This script scans a directory and returns an array "data" with all the names of the directories, storing it in a JSON file located in /home/.config (which you should have).
const fs = require('fs');
const os = require('os');
const chalk = require('chalk');

let home = os.homedir()
let configPath = home + '/' + '.config/yankit'
let yanks = {}
let licensed = false;

function config(){
    if(fs.existsSync(configPath)){
        let exists;
        exists = true
        return exists
    } else{
        exists = false
        fs.mkdirSync(configPath)
        fs.writeFile(configPath + '/data.json', '{"yanks": []}', (err) =>{
            if (err) throw err;
            console.log(chalk.greenBright.bold('Yankfile generated!'))
        })
    }
}

function addToConfig(yank, name){
    if(config() == true){
        let conf = require(configPath + '/data.json')
        if(getYank(name) == undefined){
            conf.yanks.push(yank)
            fs.writeFileSync(configPath + '/data.json', JSON.stringify(conf, null, 4));
            console.log(chalk.greenBright('Successfully yanked file structure! Recreate it with "yankit paste -n ' + name + '".'))
        } else{
            console.log(chalk.red('Yank name "') + chalk.blue.bold(name) +
            chalk.red('" already exists! Remove the original or choose another name...'))
        }
        } else{
        console.log(chalk.red.bold('Yankfile not found. Generating yankfile...'))
        config();
    }
}

function scan(dir){
        let scanned = [];
        let filenames = fs.readdirSync(dir); 
        let regex = /(?:\.([^.]+))?$/;
        let hasLicense = false;
   
        filenames.forEach((file) => { 
        if(regex.exec(file)[1] == undefined && file !== 'LICENSE'){
            scanned.push(file); 
        }else if(file === 'LICENSE'){
            hasLicense = true;
            licensed = hasLicense;
        }
        }); 
        return scanned
}

function yank(dir, name){
    scannedDirectories = scan(dir);
    yanks[name] = scannedDirectories;
    addToConfig(yanks, name)
    return yanks;
}

exports.yank = yank;

function getYank(name){
    if(config() == true){
        let conf = require(configPath + '/data.json')
        let returned;

        for (let i = 0; i < conf.yanks.length; i++) {
            if(conf.yanks[i][name] !== undefined){
                returned = conf.yanks[i][name]
                return returned;
            }
        }
    } else{
        console.log(chalk.red("Can't get yank " + name + '. Did you type it right?'))
        config();
    }
}

exports.get = getYank

function unyank(name){
    if(config() == true){
        let conf = require(configPath + '/data.json')
        if(getYank(name) == undefined){
            console.log(chalk.greenBright('Couldn\'t find any yank named "' + name + '". Aborting.'))
        } else{
            for (let i = 0; i < conf.yanks.length; i++) {
                if(conf.yanks[i] !== undefined){
                    returned = conf.yanks[i];
                    delete conf.yanks[i][name];
                    try {
                        fs.writeFileSync(configPath + '/data.json', JSON.stringify(conf, null, 4));
                        console.log(chalk.red('Yank "' + name + '" deleted succesfully!'))
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        }
    }
}

exports.unyank = unyank;

function yankGitRepo(url, name){
    let splitUrl = url.split('/');
    let folder = splitUrl[splitUrl.length - 1];
    let shell = require('shelljs');
    if(fs.existsSync('./' + folder)){
        console.log(chalk.red('Directory with repository name "' + chalk.blueBright.bold(folder) +
        '" already exists. Remove the directory or yank the existing folder.'));
        return 0;
    } else{
        if (fs.existsSync(configPath)){
            shell.exec('git clone ' + url + ' --depth 1');
            yank('./' + folder, name);
            clean(folder);
        } else{
            config();
        }            
    }
}

exports.yankGitRepo = yankGitRepo;

function list(){
    if(config() == true){
        let conf = require(configPath + '/data.json')
            for (let i = 0; i < conf.yanks.length; i++) {
                if(conf.yanks[i] !== undefined){
                    returned = conf.yanks[i];
                    console.log(chalk.blue.bold('--------------------\n')
                    + chalk.blueBright.bold('Your yanks (from config): \n\n'),
                    returned, chalk.blue.bold('\n--------------------'))
                }
        }
    }
}

exports.list = list;

function clean(folder){
    let shell = require('shelljs');
    shell.exec('rm -rf ' + folder)
}

console.log(getYank('yanked'))

//deleteYank('yanked')

//yankGitRepo('https://github.com/atomicptr/dauntless-builder', 'gityank');

//yank('./', 'yanked');

// console.log(yank('./', 'yanked'))