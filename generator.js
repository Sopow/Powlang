function evaluate(ast) {
    const context = {};

    function evaluateNode(node) {
        switch (node.type) {
            case 'Program':
                node.body.forEach(evaluateNode);
                break;
            case 'Define':
                context[node.id] = evaluateNode(node.value);
                break;
            case 'Show':
                console.log(evaluateNode(node.value));
                break;
            case 'NumberLiteral':
                return Number(node.value);
            case 'StringLiteral':
                return String(node.value);
            case 'Identifier':
                if (node.name in context) {
                    return context[node.name];
                } else {
                    throw new ReferenceError(`Undefined variable: ${node.name}`);
                }
            case 'BinaryExpression':
                const left = evaluateNode(node.left);
                const right = evaluateNode(node.right);
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
            default:
                throw new TypeError(`Unknown node type: ${node.type}`);
        }
    }

    evaluateNode(ast);
}

module.exports = evaluate;
