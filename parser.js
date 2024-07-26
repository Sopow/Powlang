function parse(tokens) {
    let current = 0;

    function parsePrimary() {
        let token = tokens[current];

        if (token.type === 'number') {
            current++;
            return {
                type: 'NumberLiteral',
                value: token.value,
            };
        }

        if (token.type === 'string') {
            current++;
            return {
                type: 'StringLiteral',
                value: token.value,
            };
        }

        if (token.type === 'identifier') {
            current++;
            return {
                type: 'Identifier',
                name: token.value,
            };
        }

        if (token.type === 'paren' && token.value === '(') {
            current++;
            const expr = parseExpression();
            if (tokens[current].type !== 'paren' || tokens[current].value !== ')') {
                throw new TypeError('Expected closing parenthesis');
            }
            current++; // skip closing parenthesis
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

        const eq = tokens[current];
        if (eq.type !== 'eq') {
            throw new TypeError('Expected =');
        }
        current++; // skip =

        const value = parsePrimary();

        return {
            type: 'Define',
            varType: type.value,
            id: identifier.value, // Use 'value' to correctly store the variable name
            value: value,
        };
    }

    function parseShow() {
        current++; // skip 'show'
        if (tokens[current].type !== 'paren' || tokens[current].value !== '(') {
            throw new TypeError('Expected opening parenthesis');
        }
        current++; // skip opening parenthesis
        const value = parseExpression();
        if (tokens[current].type !== 'paren' || tokens[current].value !== ')') {
            throw new TypeError('Expected closing parenthesis');
        }
        current++; // skip closing parenthesis

        return {
            type: 'Show',
            value: value,
        };
    }

    function parseExpression() {
        let left = parsePrimary();
        let token = tokens[current];

        while (token && ['plus', 'gt', 'lt', 'eqe', 'eqs', 'eqi', 'eq', 'star', 'slash', 'minus'].includes(token.type)) {
            current++;
            const right = parsePrimary();
            left = {
                type: 'BinaryExpression',
                operator: token.type,
                left: left,
                right: right,
            };
            token = tokens[current];
        }

        return left;
    }

    function parseStatements() {
        const statements = [];

        while (current < tokens.length) {
            const token = tokens[current];
            if (token.type === 'keyword') {
                if (token.value === 'define') {
                    statements.push(parseDefine());
                } else if (token.value === 'show') {
                    statements.push(parseShow());
                }
            } else {
                throw new TypeError('Unexpected token: ' + token.type);
            }
        }

        return statements;
    }

    const ast = {
        type: 'Program',
        body: parseStatements(),
    };

    return ast;
}

module.exports = parse;
