import express, { Request, Response } from 'express'
import ProjectController from 'src/controllers/project.controller';
const routes = express.Router()
// Routes

// Create a new project
routes.post('projects', new ProjectController().createProject);
// Get project's enabled services with their API keys
routes.get('projects/:projectId/services', new ProjectController().getServices);
// Enable a service for a project
routes.post('projects/:projectId/services', new ProjectController().enableServices);
// Disable a service
routes.get('projects/:projectId/services', new ProjectController().deleteServices);

export default routes;