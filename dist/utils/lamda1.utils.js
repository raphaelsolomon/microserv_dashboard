"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vm_1 = __importDefault(require("vm"));
const dependency_utils_1 = __importDefault(require("./dependency.utils"));
class LambdaExecutor {
    constructor() {
        this.MAX_EXECUTION_TIME = 30000;
    }
    async execute(lambda, params = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                const dependencyManager = new dependency_utils_1.default();
                const dependencies = await dependencyManager.loadDependencies(lambda.functionCode, lambda.graphqlEndpoint);
                const sandbox = dependencyManager.createSandbox(dependencies);
                const context = vm_1.default.createContext(sandbox);
                const availableDeps = Object.keys(dependencies);
                const wrappedCode = `
                    (async () => {
                        const { ${availableDeps.join(', ')} } = sandbox;
                        const func = ${lambda.functionCode};
                        return await func(params);
                    })()
                `;
                const script = new vm_1.default.Script(wrappedCode);
                const timeoutId = setTimeout(() => {
                    reject(new Error('Function execution timed out'));
                }, this.MAX_EXECUTION_TIME);
                const result = await script.runInContext(context, { timeout: this.MAX_EXECUTION_TIME });
                clearTimeout(timeoutId);
                lambda.lastExecuted = new Date();
                lambda.executionCount += 1;
                await lambda.save();
                resolve(result);
            }
            catch (error) {
                reject(error);
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
//# sourceMappingURL=lamda1.utils.js.map