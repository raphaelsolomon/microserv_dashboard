import { Request, Response } from "express";

export default class ProjectController {
  //     res.status(500).json({ error: 'Failed to create project' });
  // }

  constructor() {}

  async enableServices(req: Request, res: Response) {
    throw new Error("Method not implemented.");
  }
  
  async getServices(req: Request, res: Response) {
    throw new Error("Method not implemented.");
  }

  async deleteServices(req: Request, res: Response) {
    throw new Error("Method not implemented.");
  }
  async createProject(req: Request, res: Response) {
    throw new Error("Method not implemented.");
    // try {
    //     const { name } = req.body;
    //     const project = new Project({ name });
    //     await project.save();
    //     res.status(201).json(project);
    // } catch (error) {
    //     res.status(500).json({ error: 'Failed to create project' });
    // }
  }
}
