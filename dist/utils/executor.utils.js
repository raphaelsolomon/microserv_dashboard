"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vm_1 = __importDefault(require("vm"));
const dependency_utils_1 = __importDefault(require("./dependency.utils"));
class LambdaExecutor {
    constructor() {
        this.timeout = 30000;
    }
    extractParamNames(functionCode) {
        try {
            const arrowMatch = functionCode.match(/async\s*\((.*?)\)\s*=>/);
            const functionMatch = functionCode.match(/async\s*function\s*\w*\s*\((.*?)\)/);
            const params = (arrowMatch || functionMatch)[1];
            return params
                .split(',')
                .map(param => param.trim())
                .filter(param => param.length > 0);
        }
        catch (error) {
            throw new Error('Could not parse function parameters');
        }
    }
    async execute(lambda, params = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                const dependencyManager = new dependency_utils_1.default();
                const dependencies = await dependencyManager.loadDependencies(lambda.functionCode, lambda.graphqlEndpoint);
                const sandbox = dependencyManager.createSandbox(dependencies);
                const paramNames = this.extractParamNames(lambda.functionCode);
                const paramValues = paramNames.map(name => params[name]);
                const context = vm_1.default.createContext(Object.assign(Object.assign({}, sandbox), { paramValues }));
                const wrappedCode = `
                    (async () => {
                        const func = ${lambda.functionCode};
                        return await func(...paramValues);
                    })()
                `;
                const script = new vm_1.default.Script(wrappedCode);
                const timeoutId = setTimeout(() => {
                    reject(new Error('Function execution timed out'));
                }, this.timeout);
                const result = await script.runInContext(context, { timeout: this.timeout });
                clearTimeout(timeoutId);
                lambda.lastExecuted = new Date();
                lambda.executionCount += 1;
                await lambda.save();
                resolve(result);
            }
            catch (error) {
                reject(new Error(`Error executing Lambda function: ${error.message}`));
            }
        });
    }
    validateFunction(functionCode) {
        try {
            new Function(functionCode);
            if (functionCode.includes('require(') ||
                functionCode.includes('import ') ||
                functionCode.includes('module.exports')) {
                throw new Error('Custom imports are not allowed. Use provided dependencies only.');
            }
            return { isValid: true };
        }
        catch (error) {
            return {
                isValid: false,
                error: error.message
            };
        }
    }
}
exports.default = LambdaExecutor;
//# sourceMappingURL=executor.utils.js.map