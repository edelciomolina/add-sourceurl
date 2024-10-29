const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

// Helper function to check if sourceURL comment already exists
const hasSourceURL = (fileContent, fileType) => {
    const commentStart = getSourceURLPrefix(fileType);
    return fileContent.startsWith(commentStart);
};

// Function to add sourceURL comment to the file
const addSourceURL = (filePath, rootDir, fileType) => {
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const sourceURLComment = `${getSourceURLPrefix(fileType)}${relativePath}${getSourceURLSuffix(fileType)}\n`;

    const fileContent = fs.readFileSync(filePath, 'utf8');

    if (!hasSourceURL(fileContent, fileType)) {
        const updatedContent = sourceURLComment + fileContent;
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Added sourceURL to file: ${filePath}`);
    } else {
        console.log(`File already has a sourceURL: ${filePath}`);
    }
};

// Function to get appropriate comment prefix based on file type
const getSourceURLPrefix = (fileType) => {
    switch (fileType) {
        case 'js':
            return '//# sourceURL=/';
        case 'css':
            return '/*# sourceURL=/';
        case 'html':
            return '<!--# sourceURL=/';
        default:
            return '';
    }
};

// Function to get appropriate comment suffix based on file type
const getSourceURLSuffix = (fileType) => {
    switch (fileType) {
        case 'js':
            return '';
        case 'css':
            return ' */';
        case 'html':
            return ' -->';
        default:
            return '';
    }
};

// Recursive function to process directories, ignoring specified directories
const processDirectory = (dir, fileTypes, rootDir, ignoredDirs) => {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);

        // Ignore the directories provided
        if (fs.statSync(filePath).isDirectory()) {
            if (!ignoredDirs.includes(file)) {
                processDirectory(filePath, fileTypes, rootDir, ignoredDirs);
            }
        } else {
            // Check if the file matches the selected file types
            const extension = path.extname(file).slice(1); // Get file extension without the dot (.)
            if (fileTypes.includes(extension) && !file.endsWith('.min.js')) {
                addSourceURL(filePath, rootDir, extension);
            }
        }
    });
};

// Parse command line arguments
const args = process.argv.slice(2);
const rootDirArg = args.find(arg => arg.startsWith('--rootDir='));
const fileTypesArg = args.find(arg => arg.startsWith('--fileTypes='));
const ignoredDirsArg = args.find(arg => arg.startsWith('--ignoredDirs='));

const rootDirFromArgs = rootDirArg ? rootDirArg.split('=')[1] : null;
const fileTypesFromArgs = fileTypesArg ? fileTypesArg.split('=')[1].split(',') : null;
const ignoredDirsFromArgs = ignoredDirsArg ? ignoredDirsArg.split('=')[1].split(',') : null;

// Function to execute based on whether parameters are provided or not
const run = async () => {
    let rootDir, fileTypes, ignoredDirs;

    if (rootDirFromArgs && fileTypesFromArgs && ignoredDirsFromArgs) {
        // If arguments are passed via CLI, use them
        rootDir = rootDirFromArgs;
        fileTypes = fileTypesFromArgs;
        ignoredDirs = ignoredDirsFromArgs;
    } else {
        // If no arguments are passed, fall back to inquirer prompts
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'rootDir',
                message: 'Enter the root directory path (e.g., E:\\SimplificaCI\\projects\\secure\\web):',
                default: 'E:\\SimplificaCI\\projects\\secure\\web'
            },
            {
                type: 'checkbox',
                name: 'fileTypes',
                message: 'Select the file types you want to process:',
                choices: [
                    { name: 'JavaScript (.js)', value: 'js' },
                    { name: 'CSS (.css)', value: 'css' },
                    { name: 'HTML (.html)', value: 'html' }
                ]
            },
            {
                type: 'input',
                name: 'ignoredDirs',
                message: 'Enter the directories to ignore (comma-separated, e.g., assets,node_modules,play):',
                default: 'assets,node_modules,play'
            }
        ]);

        rootDir = answers.rootDir;
        fileTypes = answers.fileTypes;
        ignoredDirs = answers.ignoredDirs.split(',');
    }

    if (!fileTypes || fileTypes.length === 0) {
        console.log('No file types selected. The application will exit.');
        return;
    }

    // Process directory based on provided or prompted inputs
    processDirectory(rootDir, fileTypes, rootDir, ignoredDirs);
};

// Execute the main function
run();
