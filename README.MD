# Yankit
### Folder Structure Macro Utility

Yankit is a utility for creating macros that generate folder structures. Basically, it copies the entire folder structure (without the files) and stores it in a .json file, allowing you to create any saved structure everytime you want to make a new project.

## Why?
Copying directories without their files using the terminal is a pain, besides, you are not even able to store the folders to create a new project later, so I always find myself making directories everytime I want to start a new project. Yankit gets rid of this hassle.

# Installation
### Install via npm
You can install yankit globally through npm (make sure you have the latest version of Node.js installed).

`npm install yankit -g`

# Usage
### Yanking folder structures

#### Locally:
Yank a folder structure like this:

`yankit yank -f path -n macro_name`

Where "path" is the path of the folder containing the structure and "macro_name" is the name of the macro to be stored.

#### From a Git repository:
Yank a folder structure from a Git repository:

`yankit yank -u url -n macro_name`

Where "url" is the url of the repository and "macro_name" is the name of the macro to be stored.

### Pasting a folder structure
Paste a folder structure like this:

`yankit paste -f path -n macro_name`

Where "path" is the destined path and "macro_name" is the name of the macro to activate (e. g. yankit paste -f ./ -n cpp)

### Deleting a macro
Delete a macro from the config file this way:

`yankit unyank -n macro_name`

Where "macro_name" is the name of the macro to delete.

### List all saved macros
List all saved file structure macros:

`yankit list`

This command returns a json object with all of the stored macros you have on your config file.

# Configuration
All macros are saved to a file called "data.json" on a subdirectory located in your .config (home/.config/yankit on Linux).

#### Authored by
Carlos Dante (carloscdante)

#### Dependencies
[shellJS](https://github.com/shelljs/shelljs)

[chalk](https://github.com/chalk/chalk)

[yargs](https://github.com/yargs/yargs)

#### Code (Licensed under the GPLv2)

[Github](https://github.com/carloscdante/yankit)