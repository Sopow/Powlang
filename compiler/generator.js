function evaluate(ast, enableLogs = false) {
    const context = {};

    function evaluateNode(node) {
        switch (node.type) {
            case 'Program':
                if (enableLogs) console.log('Evaluating Program');
                node.body.forEach(evaluateNode);
                break;
            case 'Define':
                context[node.id] = evaluateNode(node.value);
                if (enableLogs) console.log(`Evaluating Define: ${node.id} = ${context[node.id]}`);
                break;
            case 'Show':
                const showValues = node.values.map(evaluateNode);
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
                const left = evaluateNode(node.left);
                const right = evaluateNode(node.right);
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
                    case 'mod':
                        return left % right;
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
                while (evaluateNode(node.condition)) {
                    node.body.forEach(evaluateNode);
                    evaluateNode(node.increment);
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

    evaluateNode(ast);
}

module.exports = evaluate;
