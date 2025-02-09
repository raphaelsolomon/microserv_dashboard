export default class LambdaExecutor {
    private timeout;
    constructor();
    extractParamNames(functionCode: string): string[];
    execute(lambda: any, params?: {
        [key: string]: any;
    }): Promise<unknown>;
    validateFunction(functionCode: string): {
        isValid: boolean;
        error?: undefined;
    } | {
        isValid: boolean;
        error: any;
    };
}
