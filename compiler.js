const fs = require('fs');
const tokenize = require('./lexer');
const parse = require('./parser');
const evaluate = require('./generator');

const inputFilePath = process.argv[2];

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
        const startTime = Date.now();
        const tokens = tokenize(data);
        // console.log('Tokens:', tokens);
        const ast = parse(tokens);
        // console.log('AST:', JSON.stringify(ast, null, 2));
        evaluate(ast);
        const endTime = Date.now();
        console.log(`Compilation time: ${endTime - startTime} ms`);
    } catch (error) {
        console.error(`Error during compilation: ${error.message}`);
    }
});
