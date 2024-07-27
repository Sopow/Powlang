function tokenize(input, enableLogs = false) {
    const tokens = [];
    let current = 0;

    while (current < input.length) {
        let char = input[current];

        if (/\s/.test(char)) {
            current++;
            continue;
        }

        if (char === '(' || char === ')' || char === '{' || char === '}') {
            tokens.push({ type: 'paren', value: char, position: current });
            if (enableLogs) console.log(`Token: ${char} (paren)`);
            current++;
            continue;
        }

        if (char === '#') {
            while (char !== '\n') {
                char = input[++current];
            }
            current++; // Skip the newline character
            continue;
        }

        if (char === '+' && input[current + 1] === '+') {
            tokens.push({ type: 'increment', value: '++', position: current });
            if (enableLogs) console.log(`Token: ++ (increment)`);
            current += 2;
            continue;
        }

        if (char === '-' && input[current + 1] === '-') {
            tokens.push({ type: 'decrement', value: '--', position: current });
            if (enableLogs) console.log(`Token: -- (decrement)`);
            current += 2;
            continue;
        }

        if (char === '+') {
            tokens.push({ type: 'plus', value: char, position: current });
            if (enableLogs) console.log(`Token: ${char} (plus)`);
            current++;
            continue;
        }

        if (char === '-') {
            tokens.push({ type: 'minus', value: char, position: current });
            if (enableLogs) console.log(`Token: ${char} (minus)`);
            current++;
            continue;
        }

        if (char === '*') {
            tokens.push({ type: 'star', value: char, position: current });
            if (enableLogs) console.log(`Token: ${char} (star)`);
            current++;
            continue;
        }

        if (char === '/') {
            tokens.push({ type: 'slash', value: char, position: current });
            if (enableLogs) console.log(`Token: ${char} (slash)`);
            current++;
            continue;
        }

        if (char === '%') {
            tokens.push({ type: 'mod', value: char, position: current });
            if (enableLogs) console.log(`Token: ${char} (mod)`);
            current++;
            continue;
        }

        if (char === '=' && input[current + 1] === 'e') {
            tokens.push({ type: 'eqe', value: '=e', position: current });
            if (enableLogs) console.log(`Token: =e (eqe)`);
            current += 2;
            continue;
        }

        if (char === '=' && input[current + 1] === 's') {
            tokens.push({ type: 'eqs', value: '=s', position: current });
            if (enableLogs) console.log(`Token: =s (eqs)`);
            current += 2;
            continue;
        }

        if (char === '=' && input[current + 1] === 'i') {
            tokens.push({ type: 'eqi', value: '=i', position: current });
            if (enableLogs) console.log(`Token: =i (eqi)`);
            current += 2;
            continue;
        }

        if (char === '=') {
            if (input[current + 1] === '>') {
                tokens.push({ type: 'arrow', value: '=>', position: current });
                if (enableLogs) console.log(`Token: => (arrow)`);
                current += 2;
                continue;
            }
            tokens.push({ type: 'eq', value: char, position: current });
            if (enableLogs) console.log(`Token: ${char} (eq)`);
            current++;
            continue;
        }

        if (char === ':' && input[current + 1] === ':') {
            tokens.push({ type: 'double_colon', value: '::', position: current });
            if (enableLogs) console.log(`Token: :: (double_colon)`);
            current += 2;
            continue;
        }

        if (char === ',') {
            tokens.push({ type: 'comma', value: char, position: current });
            if (enableLogs) console.log(`Token: ${char} (comma)`);
            current++;
            continue;
        }

        if (char === '>') {
            tokens.push({ type: 'gt', value: char, position: current });
            if (enableLogs) console.log(`Token: ${char} (gt)`);
            current++;
            continue;
        }

        if (char === '<') {
            tokens.push({ type: 'lt', value: char, position: current });
            if (enableLogs) console.log(`Token: ${char} (lt)`);
            current++;
            continue;
        }

        if (/[0-9]/.test(char)) {
            let value = '';
            while (/[0-9]/.test(char)) {
                value += char;
                char = input[++current];
            }
            tokens.push({ type: 'number', value, position: current - value.length });
            if (enableLogs) console.log(`Token: ${value} (number)`);
            continue;
        }

        if (char === '"') {
            let value = '';
            char = input[++current]; // Skip the opening quote
            while (char !== '"') {
                value += char;
                char = input[++current];
            }
            tokens.push({ type: 'string', value, position: current - value.length });
            if (enableLogs) console.log(`Token: ${value} (string)`);
            current++; // Skip the closing quote
            continue;
        }

        if (/[a-zA-Z]/.test(char)) {
            let value = '';
            while (/[a-zA-Z]/.test(char)) {
                value += char;
                char = input[++current];
            }
            if (value === 'define' || value === 'number' || value === 'string' || value === 'show' || value === 'when' || value === 'as') {
                tokens.push({ type: 'keyword', value, position: current - value.length });
                if (enableLogs) console.log(`Token: ${value} (keyword)`);
            } else {
                tokens.push({ type: 'identifier', value, position: current - value.length });
                if (enableLogs) console.log(`Token: ${value} (identifier)`);
            }
            continue;
        }

        throw new TypeError('Unknown character: ' + char);
    }

    if (enableLogs) console.log('Tokens:', tokens);
    return tokens;
}

module.exports = tokenize;
