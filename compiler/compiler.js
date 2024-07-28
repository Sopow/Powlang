// compiler.js
const fs = require('fs');
const tokenize = require('./lexer');
const parse = require('./parser');
const evaluate = require('./generator');

const inputFilePath = process.argv[2];
const enableLogs = process.argv.includes('--enable-logs');

if (!inputFilePath) {
    console.error('Please provide an input file path.');
    process.exit(1);
}

fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err.message}`);
        process.exit(1);
    }

    try {
        const tokens = tokenize(data, enableLogs);
        // if (enableLogs) console.log('Tokens:', tokens);
        const ast = parse(tokens, enableLogs);
        if (enableLogs) console.log('AST:', JSON.stringify(ast, null, 2));
        evaluate(ast, enableLogs);
    } catch (error) {
        console.error(`Error during compilation: ${error.message}`);
        process.exit(1);
    }
});
