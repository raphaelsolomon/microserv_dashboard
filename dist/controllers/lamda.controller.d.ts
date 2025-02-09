import { Request, Response } from "express";
export default class LamdaController {
    constructor();
    deleteLamdaFunction(req: Request, res: Response): Promise<void>;
    getLamdasFunctions(req: Request, res: Response): Promise<void>;
    getLamdaFunction(req: Request, res: Response): Promise<void>;
    createLamda(req: Request, res: Response): Promise<void>;
    getDependencies(req: Request, res: Response): void;
    executeLamdaFunction(req: Request, res: Response): Promise<void>;
}
