function evaluate(ast, enableLogs = false) {
    const context = {};
    const MAX_ITERATIONS = 1000000000;

    function evaluateNode(node, context) {
        switch (node.type) {
            case 'Program':
                if (enableLogs) console.log('Evaluating Program');
                node.body.forEach(n => evaluateNode(n, context));
                break;
            case 'Define':
                context[node.id] = evaluateNode(node.value, context);
                if (enableLogs) console.log(`Evaluating Define: ${node.id} = ${context[node.id]}`);
                break;
            case 'Show':
                const showValues = node.values.map(n => evaluateNode(n, context));
                console.log(...showValues);  // Always show the values
                if (enableLogs) console.log(`Evaluating Show: ${showValues}`);
                break;
            case 'NumberLiteral':
                if (enableLogs) console.log(`Evaluating NumberLiteral: ${node.value}`);
                return Number(node.value);
            case 'StringLiteral':
                if (enableLogs) console.log(`Evaluating StringLiteral: ${node.value}`);
                return String(node.value);
            case 'Identifier':
                if (node.name in context) {
                    if (enableLogs) console.log(`Evaluating Identifier: ${node.name} = ${context[node.name]}`);
                    return context[node.name];
                } else {
                    throw new ReferenceError(`Undefined variable: ${node.name}`);
                }
            case 'BinaryExpression':
                const left = evaluateNode(node.left, context);
                const right = evaluateNode(node.right, context);
                if (enableLogs) console.log(`Evaluating BinaryExpression: ${left} ${node.operator} ${right}`);
                switch (node.operator) {
                    case 'plus':
                        return left + right;
                    case 'minus':
                        return left - right;
                    case 'star':
                        return left * right;
                    case 'slash':
                        return left / right;
                    case 'gt':
                        return left > right;
                    case 'lt':
                        return left < right;
                    case 'eq':
                        return left == right;
                    case 'eqe':
                        return left === right;
                    case 'eqs':
                        return left >= right;
                    case 'eqi':
                        return left <= right;
                    default:
                        throw new TypeError(`Unknown operator: ${node.operator}`);
                }
            case 'When':
                if (enableLogs) console.log('Evaluating When');
                let iterations = 0;
                while (evaluateNode(node.condition, context) && iterations < MAX_ITERATIONS) {
                    node.body.forEach(n => evaluateNode(n, context));
                    evaluateNode(node.increment, context);
                    iterations++;
                }
                if (iterations === MAX_ITERATIONS) {
                    console.warn('Maximum iterations reached. Loop terminated to prevent infinite loop.');
                }
                break;
            case 'Increment':
                if (node.argument.type === 'Identifier') {
                    context[node.argument.name]++;
                    if (enableLogs) console.log(`Incrementing ${node.argument.name} to ${context[node.argument.name]}`);
                }
                break;
            case 'Decrement':
                if (node.argument.type === 'Identifier') {
                    context[node.argument.name]--;
                    if (enableLogs) console.log(`Decrementing ${node.argument.name} to ${context[node.argument.name]}`);
                }
                break;
            default:
                throw new TypeError(`Unknown node type: ${node.type}`);
        }
    }

    evaluateNode(ast, context);
}

module.exports = evaluate;
