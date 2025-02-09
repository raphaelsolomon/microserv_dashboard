import mongoose from "mongoose";

// Define Lambda function schema
const LambdaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    functionCode: { type: String, required: true },
    graphqlEndpoint: { type: String },
    createdAt: { type: Date, default: Date.now },
    lastExecuted: { type: Date },
    executionCount: { type: Number, default: 0 }
});

export const Lambda = mongoose.model('Lambda', LambdaSchema);