export default class LambdaExecutor {
    private MAX_EXECUTION_TIME;
    constructor();
    execute(lambda: any, params?: {}): Promise<unknown>;
    validateFunction(functionCode: string): {
        isValid: boolean;
        error?: undefined;
    } | {
        isValid: boolean;
        error: any;
    };
}
