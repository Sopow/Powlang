function parse(tokens, enableLogs = false) {
    let current = 0;

    function parsePrimary() {
        let token = tokens[current];

        if (token.type === 'number') {
            current++;
            if (enableLogs) console.log(`Parse NumberLiteral: ${token.value}`);
            return {
                type: 'NumberLiteral',
                value: token.value,
            };
        }

        if (token.type === 'string') {
            current++;
            if (enableLogs) console.log(`Parse StringLiteral: ${token.value}`);
            return {
                type: 'StringLiteral',
                value: token.value,
            };
        }

        if (token.type === 'identifier') {
            current++;
            if (enableLogs) console.log(`Parse Identifier: ${token.value}`);
            return {
                type: 'Identifier',
                name: token.value,
            };
        }

        if (token.type === 'increment') {
            current++;
            if (enableLogs) console.log(`Parse Increment: ++`);
            return {
                type: 'Increment',
                argument: { type: 'Identifier', name: tokens[current - 1].value }
            };
        }

        if (token.type === 'decrement') {
            current++;
            if (enableLogs) console.log(`Parse Decrement: --`);
            return {
                type: 'Decrement',
                argument: { type: 'Identifier', name: tokens[current - 1].value }
            };
        }

        if (token.type === 'paren' && (token.value === '(' || token.value === '{')) {
            current++;
            const expr = parseExpression();
            if (tokens[current].type !== 'paren' || (tokens[current].value !== ')' && tokens[current].value !== '}')) {
                throw new TypeError('Expected closing parenthesis or brace');
            }
            current++; // skip closing parenthesis or brace
            return expr;
        }

        throw new TypeError('Unexpected token: ' + token.type);
    }

    function parseDefine() {
        const keyword = tokens[current];
        current++; // skip 'define'

        const type = tokens[current];
        if (type.type !== 'keyword') {
            throw new TypeError('Expected type keyword');
        }
        current++; // skip type

        const identifier = tokens[current];
        if (identifier.type !== 'identifier') {
            throw new TypeError('Expected identifier');
        }
        current++; // skip identifier

        const as = tokens[current];
        if (as.type !== 'keyword' || as.value !== 'as') {
            throw new TypeError('Expected "as"');
        }
        current++; // skip 'as'

        const value = parseExpression();

        if (enableLogs) console.log(`Parse Define: ${identifier.value} as ${JSON.stringify(value)}`);
        return {
            type: 'Define',
            varType: type.value,
            id: identifier.value,
            value: value,
        };
    }

    function parseShow() {
        current++; // skip 'show'
        if (tokens[current].type !== 'paren' || tokens[current].value !== '(') {
            throw new TypeError('Expected opening parenthesis');
        }
        current++; // skip opening parenthesis

        const values = [];
        while (tokens[current].type !== 'paren' || tokens[current].value !== ')') {
            values.push(parseExpression());
            if (tokens[current].type === 'comma') {
                current++; // skip comma
            }
        }
        current++; // skip closing parenthesis

        if (enableLogs) console.log(`Parse Show: ${JSON.stringify(values)}`);
        return {
            type: 'Show',
            values: values,
        };
    }

    function parseWhen() {
        current++; // skip 'when'
        const condition = parseExpression();
        if (tokens[current].type !== 'double_colon') {
            throw new TypeError('Expected "::" after condition');
        }
        current++; // skip '::'
    
        const incrementIdentifier = parsePrimary();
        const incrementType = tokens[current].type;
        if (incrementType !== 'increment' && incrementType !== 'decrement') {
            throw new TypeError(`Expected "++" or "--" after identifier, found ${tokens[current].type}`);
        }
        current++; // skip '++' or '--'
    
        const increment = {
            type: incrementType === 'increment' ? 'Increment' : 'Decrement',
            argument: incrementIdentifier
        };
    
        if (tokens[current].type !== 'arrow') {
            throw new TypeError(`Expected "=>" after increment, found ${tokens[current].type}`);
        }
        current++; // skip '=>'
        if (tokens[current].type !== 'paren' || tokens[current].value !== '{') {
            throw new TypeError(`Expected "{" to start loop body, found ${tokens[current].type}`);
        }
        current++; // skip '{'
        const body = [];
        while (tokens[current].type !== 'paren' || tokens[current].value !== '}') {
            body.push(parseStatement());
        }
        current++; // skip '}'
    
        if (enableLogs) console.log(`Parse When: ${JSON.stringify(condition)}, ${JSON.stringify(increment)}, ${JSON.stringify(body)}`);
        return {
            type: 'When',
            condition: condition,
            increment: increment,
            body: body,
        };
    }
    

    function parseExpression() {
        let left = parsePrimary();
        let token = tokens[current];

        while (token && ['plus', 'gt', 'lt', 'eqe', 'eqs', 'eqi', 'eq', 'star', 'slash', 'minus', 'mod'].includes(token.type)) {
            current++;
            const right = parsePrimary();
            left = {
                type: 'BinaryExpression',
                operator: token.type,
                left: left,
                right: right,
            };
            if (enableLogs) console.log(`Parse BinaryExpression: ${JSON.stringify(left)}`);
            token = tokens[current];
        }

        return left;
    }

    function parseStatement() {
        const token = tokens[current];
        if (token.type === 'keyword') {
            if (token.value === 'define') {
                return parseDefine();
            } else if (token.value === 'show') {
                return parseShow();
            } else if (token.value === 'when') {
                return parseWhen();
            }
        }
        throw new TypeError('Unexpected token: ' + token.type);
    }

    function parseStatements() {
        const statements = [];
        while (current < tokens.length) {
            statements.push(parseStatement());
        }
        return statements;
    }

    const ast = {
        type: 'Program',
        body: parseStatements(),
    };

    if (enableLogs) console.log('AST:', JSON.stringify(ast, null, 2));
    return ast;
}

module.exports = parse;
