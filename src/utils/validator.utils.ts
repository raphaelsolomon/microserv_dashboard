import vm from 'vm';
import acorn from 'acorn';
import { ValidatorParams } from '../interface/lamda.interface';
import { NextFunction, Request, Response } from 'express';

export default class LambdaValidator {
    private MAX_EXECUTION_TIME: number;

    constructor() {
        this.MAX_EXECUTION_TIME = 30000;
    }

    async validateFunction(functionCode: string) {
        try {
            // Step 1: Basic syntax check
            this.checkSyntax(functionCode);
            // Step 2: Structure validation
            this.validateStructure(functionCode);
            // Step 3: Check for imports and requires
            this.validateImportsAndExports(functionCode);
            // Step 4: Execution test
            await this.testExecution(functionCode);

            return { status: true, message: 'Function is valid' };
        } catch (error) {
            return { status: false, message: error.message, error: error };
        }
    }

    // Check basic JavaScript syntax
    checkSyntax(functionCode: string) {
        try {
            // Use acorn for detailed syntax analysis
            acorn.parse(functionCode, {
                ecmaVersion: 'latest',
                sourceType: 'module'
            });
        } catch (error) {
            throw new Error(`Syntax Error: ${error.message}`);
        }
    }

    // Validate imports and exports
    validateImportsAndExports(functionCode: string) {
        if (functionCode.includes('require(') ||
            functionCode.includes('import ') ||
            functionCode.includes('module.exports')) {
            throw new Error('Custom imports are not allowed. Use provided dependencies only.');
        }
    }

    // Validate the structure of the Lambda function
    validateStructure(functionCode: string) {
        // Remove whitespace and comments
        const cleanCode = functionCode.replace(/\s+/g, ' ').trim();

        // Check if it's an arrow function or regular function
        const isArrowFunction = /^\(?.*\)?\s*=>/.test(cleanCode);
        const isRegularFunction = /^function\s*\(.*\)/.test(cleanCode);

        if (!isArrowFunction && !isRegularFunction) {
            throw new Error('Invalid function structure: Must be either an arrow function or regular function');
        }

        // Check for forbidden keywords and patterns
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

    // Test actual execution in a sandbox
    async testExecution(functionCode: string) {
        return new Promise((resolve, reject) => {
            try {
                // Create a secure context
                const sandbox = {
                    console: {
                        log: () => { },
                        error: () => { },
                        warn: () => { }
                    }
                };

                const context = vm.createContext(sandbox);

                // Wrap function in a self-executing format
                const wrappedCode = `(${functionCode})`;

                // Create script with timeout
                const script = new vm.Script(wrappedCode);

                // Execute with timeout
                const timeout = setTimeout(() => {
                    reject(new Error('Function execution timed out'));
                }, this.MAX_EXECUTION_TIME);

                script.runInContext(context, {
                    timeout: this.MAX_EXECUTION_TIME
                });

                clearTimeout(timeout);
                resolve("success");
            } catch (error) {
                reject(new Error(`Execution Error: ${error.message}`));
            }
        });
    }
}