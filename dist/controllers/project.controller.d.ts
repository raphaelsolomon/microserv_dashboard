import { Request, Response } from "express";
export default class ProjectController {
    constructor();
    enableServices(req: Request, res: Response): Promise<void>;
    getServices(req: Request, res: Response): Promise<void>;
    deleteServices(req: Request, res: Response): Promise<void>;
    createProject(req: Request, res: Response): Promise<void>;
}
