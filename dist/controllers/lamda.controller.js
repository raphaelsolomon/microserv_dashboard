"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lamda_model_1 = require("../models/lamda.model");
const executor_utils_1 = __importDefault(require("../utils/executor.utils"));
const validator_utils_1 = __importDefault(require("../utils/validator.utils"));
class LamdaController {
    constructor() { }
    async deleteLamdaFunction(req, res) {
        throw new Error("Method not implemented.");
    }
    async getLamdasFunctions(req, res) {
        throw new Error("Method not implemented.");
    }
    async getLamdaFunction(req, res) {
        throw new Error("Method not implemented.");
    }
    async createLamda(req, res) {
        try {
            const { name, description, functionCode, graphqlEndpoint } = req.body;
            const executor = new validator_utils_1.default();
            const validation = await executor.validateFunction(functionCode);
            if (!validation.status) {
                res.status(400).json({ status: false, error: 'Invalid function code', details: validation.error });
            }
            const lambda = new lamda_model_1.Lambda({ name, description, functionCode, graphqlEndpoint });
            await lambda.save();
            res.status(201).json({ message: 'Lambda function stored successfully', lambda, status: true });
        }
        catch (error) {
            res.status(500).json({ status: false, error: 'Error storing Lambda function', details: error.message });
        }
    }
    getDependencies(req, res) {
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
    async executeLamdaFunction(req, res) {
        try {
            const lambda = await lamda_model_1.Lambda.findOne({ name: req.params.name });
            if (!lambda) {
                res.status(404).json({ error: 'Lambda function not found' });
            }
            const executor = new executor_utils_1.default();
            const result = await executor.execute(lambda, req.body);
            res.status(200).json({
                result,
                executionStats: { lastExecuted: lambda.lastExecuted, executionCount: lambda.executionCount }
            });
        }
        catch (e) {
            res.status(500).json({ error: 'Error executing Lambda function', details: e.message });
        }
    }
}
exports.default = LamdaController;
//# sourceMappingURL=lamda.controller.js.map