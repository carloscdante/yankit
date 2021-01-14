//This script scans a directory and returns an array "data" with
//all the names of the directories, storing it in a JSON file
//located in /home/.config (which you should have).

//Dependencies
const fs = require('fs');
const os = require('os');
const chalk = require('chalk');

//Standard declarations
let home = os.homedir();
let configPath = home + '/' + '.config/yankit/';
let yanks = {};
let licensed = false;
let sys = os.platform();

//Windows support!!! Although I don't have a machine to test it on...
let winConfigPath = 'C:\\Program Files\\yankit\\';
if(sys == 'linux' || sys == 'darwin'){} else{configPath = winConfigPath;}

//Generates the .JSON file onto the configuration folder.
function config(){
    if(sys == 'linux' || sys == 'darwin'){
        if(fs.existsSync(configPath)){
            let exists;
            exists = true
            return exists
        } else{
            exists = false
            fs.mkdirSync(configPath)
            fs.writeFile(configPath + 'data.json', '{"yanks": []}', (err) =>{
                if (err) throw err;
                console.log(chalk.greenBright.bold('Yankfile generated!'))
            })
        }
    } else{
        configPath = winConfigPath;
        config()
    }
}

//Adds a yanked structure to the config file.
function addToConfig(yank, name){
    if(config() == true){
        let conf = require(configPath + 'data.json')
        if(getYank(name) == undefined){
            conf.yanks.push(yank)
            fs.writeFileSync(configPath + 'data.json', JSON.stringify(conf, null, 4));
            console.log(chalk.greenBright('Successfully yanked file structure! Recreate it with "yankit paste -f "folder" -n "' + name + '".'))
        } else{
            console.log(chalk.red('Yank name "') + chalk.blue.bold(name) +
            chalk.red('" already exists! Remove the original or choose another name...'))
        }
        } else{
        console.log(chalk.red.bold('Yankfile not found. Generating yankfile...'))
        config();
    }
}

//Scans a directory for folders, loops through file names/folder names and uses a regex to filter out files.
function scan(dir){
        let scanned = [];
        let filenames = fs.readdirSync(dir); 
        let regex = /(?:\.([^.]+))?$/;
        let hasLicense = false;
   
        filenames.forEach((file) => { 
        if(regex.exec(file)[1] == undefined && file !== 'LICENSE'){
            //It then pushes the folder names into an array called "scanned".
            scanned.push(file); 
        }else if(file === 'LICENSE'){
            hasLicense = true;
            licensed = hasLicense;
        }
        }); 
        return scanned
}

// Scans a directory, assigns a name to an object and
// pushes it to the JSON config file through the addToConfig() function.
function yank(dir, name){
    scannedDirectories = scan(dir);
    yanks[name] = scannedDirectories;
    addToConfig(yanks, name)
    return yanks;
}

//Exposing yank function
exports.yank = yank;

//Returns the name of a copied structure.
function getYank(name){
    if(config() == true){
        let conf = require(configPath + 'data.json')
        let returned;
        //Loop through the JSON file to check for an existing copy, if it exists, it is returned.
        for (let i = 0; i < conf.yanks.length; i++) {
            if(conf.yanks[i][name] !== undefined){
                returned = conf.yanks[i][name]
                return returned;
            }
        }
        //If it doesn't exist, run config and throw a warning.
    } else{
        console.log(chalk.red("Can't get yank " + name + '. Did you type it right?'))
        config();
    }
}

//Exposing getYank function
exports.get = getYank

//Deletes a copy from the JSON file.
//TODO:
//  - Make it so the deletion does not result in an empty object, but deletes it entirely from the "yanks" array.
function unyank(name){
    if(config() == true){
        let conf = require(configPath + 'data.json')
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

//Exposing unyank function
exports.unyank = unyank;


//Yanks a folder structure from a git repository.
//It clones into a repository, copies the folder structure from the repo and cleans the folder right after.
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

// Exposing yankGitRepo function
exports.yankGitRepo = yankGitRepo;

//Lists copies.
function list(){
    if(config() == true){
        let conf = require(configPath + 'data.json')
            for (let i = 0; i < conf.yanks.length; i++) {
                if(conf.yanks[i] !== undefined){
                    let returned = conf.yanks[i];
                    console.log(chalk.blue.bold('--------------------\n')
                    + chalk.blueBright.bold('Your yanks (from config): \n\n'),
                    returned, chalk.blue.bold('\n--------------------'))
                }
        }
    }
}

//Exposing list function
exports.list = list;


//Cleans a folder (this could cause a lot of problems and it's probably a wise decision to remove it).
function clean(folder){
    let shell = require('shelljs');
    shell.exec('rm -rf ' + folder)
}