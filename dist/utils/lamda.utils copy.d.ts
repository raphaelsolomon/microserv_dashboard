import { ValidatorParams } from '../interface/lamda.interface';
import { NextFunction, Request, Response } from 'express';
export default class Lamdvalidator {
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
    validateStructure(functionCode: string): void;
    testExecution(functionCode: string): Promise<unknown>;
    validateParameters({ functionCode, requiredParams }: ValidatorParams): {
        isValid: boolean;
        parameters: string[];
        message?: undefined;
        error?: undefined;
    } | {
        isValid: boolean;
        message: any;
        error: any;
        parameters?: undefined;
    };
    createLambdaValidationMiddleware(requiredParams?: string[]): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
}
