function propertiesToCamelCase(obj: Record<string, any>): Record<string, any> {
    if (!obj || typeof obj !== 'object')
        return obj;

    if (Array.isArray(obj))
        return obj.map(propertiesToCamelCase);

    const camel = {};
    for (const key of Object.keys(obj)) {
        const camelKey = key.replace(/([_][a-z0-9])/g, function (match) {
            return match[1].toUpperCase();
        });
        camel[camelKey] = propertiesToCamelCase(obj[key]);
    }
    return camel;
}

export function propertiesToSnakeCase(obj: Record<string, any>): Record<string, any> {
    if (!obj || typeof obj !== 'object')
        return obj;

    if (Array.isArray(obj))
        return obj.map(propertiesToSnakeCase);

    const snake = {};
    for (const key of Object.keys(obj)) {
        const snakeKey = key.replace(/([_]?[A-Z0-9]+)/g, function (match) {
            if (match.startsWith('_'))
                return match.toLowerCase();
            else
                return '_' + match.toLowerCase();
        });
        snake[snakeKey] = propertiesToSnakeCase(obj[key]);
    }
    return snake;
}
