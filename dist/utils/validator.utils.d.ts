export default class LambdaValidator {
    private MAX_EXECUTION_TIME;
    constructor();
    validateFunction(functionCode: string): Promise<{
        status: boolean;
        message: string;
        error?: undefined;
    } | {
        status: boolean;
        message: any;
        error: any;
    }>;
    checkSyntax(functionCode: string): void;
    validateImportsAndExports(functionCode: string): void;
    validateStructure(functionCode: string): void;
    testExecution(functionCode: string): Promise<unknown>;
}
