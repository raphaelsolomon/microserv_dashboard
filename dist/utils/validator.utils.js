"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vm_1 = __importDefault(require("vm"));
const acorn_1 = __importDefault(require("acorn"));
class LambdaValidator {
    constructor() {
        this.MAX_EXECUTION_TIME = 30000;
    }
    async validateFunction(functionCode) {
        try {
            this.checkSyntax(functionCode);
            this.validateStructure(functionCode);
            this.validateImportsAndExports(functionCode);
            await this.testExecution(functionCode);
            return { status: true, message: 'Function is valid' };
        }
        catch (error) {
            return { status: false, message: error.message, error: error };
        }
    }
    checkSyntax(functionCode) {
        try {
            acorn_1.default.parse(functionCode, {
                ecmaVersion: 'latest',
                sourceType: 'module'
            });
        }
        catch (error) {
            throw new Error(`Syntax Error: ${error.message}`);
        }
    }
    validateImportsAndExports(functionCode) {
        if (functionCode.includes('require(') ||
            functionCode.includes('import ') ||
            functionCode.includes('module.exports')) {
            throw new Error('Custom imports are not allowed. Use provided dependencies only.');
        }
    }
    validateStructure(functionCode) {
        const cleanCode = functionCode.replace(/\s+/g, ' ').trim();
        const isArrowFunction = /^\(?.*\)?\s*=>/.test(cleanCode);
        const isRegularFunction = /^function\s*\(.*\)/.test(cleanCode);
        if (!isArrowFunction && !isRegularFunction) {
            throw new Error('Invalid function structure: Must be either an arrow function or regular function');
        }
        const forbiddenPatterns = [
            'eval\\(',
            'Function\\(',
            'require\\(',
            'process\\.',
            'global\\.',
            '__dirname',
            '__filename',
            'Buffer\\.',
            'setTimeout\\(',
            'setInterval\\('
        ];
        const forbiddenRegex = new RegExp(forbiddenPatterns.join('|'), 'g');
        if (forbiddenRegex.test(functionCode)) {
            throw new Error('Function contains forbidden patterns or unsafe operations');
        }
    }
    async testExecution(functionCode) {
        return new Promise((resolve, reject) => {
            try {
                const sandbox = {
                    console: {
                        log: () => { },
                        error: () => { },
                        warn: () => { }
                    }
                };
                const context = vm_1.default.createContext(sandbox);
                const wrappedCode = `(${functionCode})`;
                const script = new vm_1.default.Script(wrappedCode);
                const timeout = setTimeout(() => {
                    reject(new Error('Function execution timed out'));
                }, this.MAX_EXECUTION_TIME);
                script.runInContext(context, {
                    timeout: this.MAX_EXECUTION_TIME
                });
                clearTimeout(timeout);
                resolve("success");
            }
            catch (error) {
                reject(new Error(`Execution Error: ${error.message}`));
            }
        });
    }
}
exports.default = LambdaValidator;
//# sourceMappingURL=validator.utils.js.map