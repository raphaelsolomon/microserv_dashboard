import { Request, Response } from "express";
import { Lambda } from "../models/lamda.model";
import LambdaExecutor from "../utils/executor.utils";
import LambdaValidator from "../utils/validator.utils";

export default class LamdaController {

  constructor() { }

  async deleteLamdaFunction(req: Request, res: Response) {
    throw new Error("Method not implemented.");
  }

  async getLamdasFunctions(req: Request, res: Response) {
    throw new Error("Method not implemented.");
  }

  async getLamdaFunction(req: Request, res: Response) {
    throw new Error("Method not implemented.");
  }
  async createLamda(req: Request, res: Response) {
    try {
      const { name, description, functionCode, graphqlEndpoint } = req.body;

      const executor = new LambdaValidator();
      const validation = await executor.validateFunction(functionCode);

      if (!validation.status) {
        res.status(400).json({ status: false, error: 'Invalid function code', details: validation.error });
      }
      // Create new Lambda function document
      const lambda = new Lambda({ name, description, functionCode, graphqlEndpoint });
      await lambda.save();

      res.status(201).json({ message: 'Lambda function stored successfully', lambda, status: true });
    } catch (error) {
      res.status(500).json({ status: false, error: 'Error storing Lambda function', details: error.message });
    }
  }

  getDependencies(req: Request, res: Response) {
    res.json({
      baseDependencies: ['lodash', 'moment'],
      optionalDependencies: {
        'axios': 'For HTTP requests',
        'apolloClient': 'For GraphQL queries (requires graphqlEndpoint)',
        'gql': 'For GraphQL query templates'
      },
      message: 'Optional dependencies are loaded only when needed by your function'
    });
  }

  async executeLamdaFunction(req: Request, res: Response) {
    try {
      // Execute a Lambda function
      const lambda = await Lambda.findOne({ name: req.params.name });
      if (!lambda) {
        res.status(404).json({ error: 'Lambda function not found' });
      }
      // const fn = new Function('return ' + lambda.functionCode)();
      // const result = await fn(req.body);

      // Create and execute the function
      const executor = new LambdaExecutor();
      const result = await executor.execute(lambda, req.body);

      res.status(200).json({
        result,
        executionStats: { lastExecuted: lambda.lastExecuted, executionCount: lambda.executionCount }
      });
    } catch (e) {
      res.status(500).json({ error: 'Error executing Lambda function', details: e.message });
    }
  }
}


