import vm from 'vm';
import DependencyManager from './dependency.utils';

export default class LambdaExecutor {
    private timeout: number;
    constructor() {
        this.timeout = 30000;
    }

    // Extract parameter names from function definition
    extractParamNames(functionCode: string) {
        try {
            // Match parameters between parentheses before =>
            const arrowMatch = functionCode.match(/async\s*\((.*?)\)\s*=>/);
            // Or match parameters between parentheses after function keyword
            const functionMatch = functionCode.match(/async\s*function\s*\w*\s*\((.*?)\)/);

            const params = (arrowMatch || functionMatch)[1];
            return params
                .split(',')
                .map(param => param.trim())
                .filter(param => param.length > 0);
        } catch (error) {
            throw new Error('Could not parse function parameters');
        }
    }

    async execute(lambda: any, params: { [key: string]: any } = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                const dependencyManager = new DependencyManager();
                const dependencies = await dependencyManager.loadDependencies(
                    lambda.functionCode,
                    lambda.graphqlEndpoint
                );

                const sandbox = dependencyManager.createSandbox(dependencies);

                // Extract parameter names from function
                const paramNames = this.extractParamNames(lambda.functionCode);

                // Create array of parameter values in the correct order
                const paramValues = paramNames.map(name => params[name]);


                // Create context with dependencies directly available
                const context = vm.createContext({ ...sandbox, paramValues });

                // Execute the function directly with available dependencies
                const wrappedCode = `
                    (async () => {
                        const func = ${lambda.functionCode};
                        return await func(...paramValues);
                    })()
                `;

                const script = new vm.Script(wrappedCode);
                const timeoutId = setTimeout(() => {
                    reject(new Error('Function execution timed out'));
                }, this.timeout);

                const result = await script.runInContext(context, { timeout: this.timeout });
                clearTimeout(timeoutId);

                // Update execution statistics
                lambda.lastExecuted = new Date();
                lambda.executionCount += 1;
                await lambda.save();

                resolve(result);
            } catch (error) {
                reject(new Error(`Error executing Lambda function: ${error.message}`));
            }
        });
    }

    validateFunction(functionCode: string) {
        try {
            new Function(functionCode);

            if (functionCode.includes('require(') ||
                functionCode.includes('import ') ||
                functionCode.includes('module.exports')) {
                throw new Error('Custom imports are not allowed. Use provided dependencies only.');
            }

            return { isValid: true };
        } catch (error) {
            return {
                isValid: false,
                error: error.message
            };
        }
    }
}