"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vm_1 = __importDefault(require("vm"));
const acorn_1 = __importDefault(require("acorn"));
class Lamdvalidator {
    constructor() {
        this.MAX_EXECUTION_TIME = 30000;
    }
    async validateFunction(functionCode) {
        try {
            this.checkSyntax(functionCode);
            this.validateStructure(functionCode);
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
    validateParameters({ functionCode, requiredParams }) {
        try {
            const paramMatch = functionCode.match(/^(?:function\s*\(([^)]*)\)|([^=]*?)=>)/);
            if (!paramMatch) {
                throw new Error('Could not parse function parameters');
            }
            const params = (paramMatch[1] || paramMatch[2])
                .split(',')
                .map(p => p.trim())
                .filter(p => p !== '');
            for (const required of requiredParams) {
                if (!params.includes(required)) {
                    throw new Error(`Missing required parameter: ${required}`);
                }
            }
            return { isValid: true, parameters: params };
        }
        catch (error) {
            return { isValid: false, message: error.message, error: error };
        }
    }
    createLambdaValidationMiddleware(requiredParams = []) {
        return async (req, res, next) => {
            try {
                const { functionCode } = req.body;
                const validationResult = await this.validateFunction(functionCode);
                if (!validationResult.status) {
                    return res.status(400).json({ error: 'Invalid Lambda function', details: validationResult.message });
                }
                if (requiredParams.length > 0) {
                    const paramValidation = this.validateParameters({ functionCode, requiredParams });
                    if (!paramValidation.isValid) {
                        return res.status(400).json({ error: 'Invalid parameters', details: paramValidation.message });
                    }
                }
                next();
            }
            catch (error) {
                res.status(400).json({ status: false, error: 'Validation error', details: error.message });
            }
        };
    }
}
exports.default = Lamdvalidator;
//# sourceMappingURL=lamda.utils%20copy.js.map