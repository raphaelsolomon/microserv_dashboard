import express, { Request, Response } from 'express'
import ProjectController from '../controllers/project.controller';
const projectRoutes = express.Router()
// Routes

// Create a new project
projectRoutes.post('projects', new ProjectController().createProject);
// Get project's enabled services with their API keys
projectRoutes.get('projects/:projectId/services', new ProjectController().getServices);
// Enable a service for a project
projectRoutes.post('projects/:projectId/services', new ProjectController().enableServices);
// Disable a service
projectRoutes.get('projects/:projectId/services', new ProjectController().deleteServices);

export default projectRoutes;