function tokenize(input) {
    const tokens = [];
    let current = 0;

    while (current < input.length) {
        let char = input[current];

        if (/\s/.test(char)) {
            current++;
            continue;
        }

        if (char === '(' || char === ')') {
            tokens.push({ type: 'paren', value: char, position: current });
            current++;
            continue;
        }

        if (char === '/' && input[current + 1] === '/') {
            while (char !== '\n') {
                char = input[++current];
            }
            current++; // Skip the newline character
            continue;
        }

        if (char === '+') {
            tokens.push({ type: 'plus', value: char, position: current });
            current++;
            continue;
        }

        if (char === '-') {
            tokens.push({ type: 'minus', value: char, position: current });
            current++;
            continue;
        }

        if (char === '*') {
            tokens.push({ type: 'star', value: char, position: current });
            current++;
            continue;
        }

        if (char === '/') {
            tokens.push({ type: 'slash', value: char, position: current });
            current++;
            continue;
        }

        if (char === '=' && input[current + 1] === 'e') {
            tokens.push({ type: 'eqe', value: '=e', position: current });
            current += 2;
            continue;
        }

        if (char === '=' && input[current + 1] === 's') {
            tokens.push({ type: 'eqs', value: '=s', position: current });
            current += 2;
            continue;
        }

        if (char === '=' && input[current + 1] === 'i') {
            tokens.push({ type: 'eqi', value: '=i', position: current });
            current += 2;
            continue;
        }

        if (char === '=') {
            tokens.push({ type: 'eq', value: char, position: current });
            current++;
            continue;
        }

        if (char === '>') {
            tokens.push({ type: 'gt', value: char, position: current });
            current++;
            continue;
        }

        if (char === '<') {
            tokens.push({ type: 'lt', value: char, position: current });
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
            current++; // Skip the closing quote
            continue;
        }

        if (/[a-zA-Z]/.test(char)) {
            let value = '';
            while (/[a-zA-Z]/.test(char)) {
                value += char;
                char = input[++current];
            }
            if (value === 'define' || value === 'number' || value === 'string' || value === 'show') {
                tokens.push({ type: 'keyword', value, position: current - value.length });
            } else {
                tokens.push({ type: 'identifier', value, position: current - value.length });
            }
            continue;
        }

        throw new TypeError('Unknown character: ' + char);
    }

    return tokens;
}

module.exports = tokenize;
