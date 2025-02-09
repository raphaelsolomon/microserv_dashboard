import express, { Request, Response } from 'express'
import LamdaController from '../controllers/lamda.controller';
const lamdaRoutes = express.Router()
// Routes

// Create a new project lamda
lamdaRoutes.post('/lamda', new LamdaController().createLamda);
// Get project's lamda functions
lamdaRoutes.get('/lambda', new LamdaController().getLamdasFunctions);
// Get a project's lamda function
lamdaRoutes.get('/lambda/:name', new LamdaController().getLamdaFunction);
// Delete a project's lamda function
lamdaRoutes.delete('/lambda/:name', new LamdaController().deleteLamdaFunction);

lamdaRoutes.post('/lambda/:name/execute', new LamdaController().executeLamdaFunction);

lamdaRoutes.get('/dependencies', new LamdaController().getDependencies);

export default lamdaRoutes;