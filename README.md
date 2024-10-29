
# Add SourceURL

## Overview

**Add SourceURL** is a Node.js utility designed to assist developers in debugging dynamically loaded scripts via Chrome Dev Tools. By automatically adding the `//# sourceURL` comment to JavaScript, CSS, and HTML files, this tool makes it possible for Chrome Dev Tools to recognize and display dynamically loaded scripts in the **Sources / Page** tab, enabling efficient debugging.

This project simplifies the process of adding `sourceURL` comments to files, supporting developers working with dynamically loaded content and giving better insight into their code execution.

## How It Works

The project recursively scans the specified root directory for files of the selected types (JavaScript, CSS, HTML), excluding any files in the specified directories. It automatically adds a `//# sourceURL=path` comment to the top of the file if the comment is not already present. This comment contains the relative path to the file, helping Chrome Dev Tools identify and display it properly in the **Sources / Page** tab.

The comment follows this format:
```js
//# sourceURL=/relative/path/to/file.js
```

For example, if the file is located at `E:\yourpath\directory\app.js`, the tool will add the following comment at the top of the file:
```js
//# sourceURL=/yourpath/directory/app.js
```

## Requirements

To use this tool, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (version 12 or higher)
- [Inquirer.js](https://www.npmjs.com/package/inquirer) (for interactive prompts)

You can install Inquirer.js by running:
```bash
npm install inquirer
```

## How to Use

### Option 1: Interactive Mode

1. **Clone the repository** or download the script to your local environment.

2. **Install dependencies**:
   Run the following command in the project directory to install the required packages:
   ```bash
   npm install
   ```

3. **Run the tool**:
   Execute the script using Node.js:
   ```bash
   node addSourceURL.js
   ```

4. **Provide the required inputs**:
   The tool will prompt you to:
   - **Enter the root directory path**: Provide the full path to the directory where your project files are stored. The default value is `E:\yourpath\directory`.
   - **Select the file types to process**: You can choose one or more file types from `.js`, `.css`, and `.html`.
   - **Enter the directories to ignore**: Provide a comma-separated list of directories to be ignored (default is `assets,node_modules,play`).

### Option 2: Non-interactive Mode (for CI/CD)

To use the tool in a continuous integration/continuous deployment (CI/CD) pipeline or to avoid user prompts, you can pass the parameters directly via the command line:

```bash
node addSourceURL.js --rootDir=<directory_path> --fileTypes=<file_types> --ignoredDirs=<dirs_to_ignore>
```

#### Parameters:
- `--rootDir`: Specifies the root directory where the files are located.
- `--fileTypes`: A comma-separated list of file types to process (e.g., `js,css,html`).
- `--ignoredDirs`: A comma-separated list of directories to ignore (e.g., `assets,node_modules,play`).

#### Example:
```bash
node addSourceURL.js --rootDir="E:\yourpath\directory" --fileTypes=js,css --ignoredDirs=assets,node_modules,play
```

This will automatically process the `.js` and `.css` files in the specified directory and subdirectories, ignoring the specified directories, without prompting for input.

## Example

- If you run the tool with the root directory `E:\yourpath\directory` and select `.js` files, it will add the `sourceURL` comment to all `.js` files in that directory and its subdirectories, excluding `.min.js` files and the directories specified for ignoring (default is `assets,node_modules,play`).

## Purpose

This project was created to help developers who face challenges when debugging dynamically loaded scripts using **Chrome Dev Tools**. By adding the `sourceURL` comment, developers can make their dynamically loaded scripts visible and debuggable in the **Sources / Page** tab of Chrome Dev Tools, improving the overall debugging experience. This is particularly useful for large applications with many dynamically loaded modules, as it provides better clarity and traceability of the script execution.

## License

This project is open source and available under the [MIT License](LICENSE).
