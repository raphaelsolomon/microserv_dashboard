import mongoose from "mongoose";
export declare const Lambda: mongoose.Model<{
    createdAt: NativeDate;
    name: string;
    functionCode: string;
    executionCount: number;
    description?: string;
    graphqlEndpoint?: string;
    lastExecuted?: NativeDate;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    name: string;
    functionCode: string;
    executionCount: number;
    description?: string;
    graphqlEndpoint?: string;
    lastExecuted?: NativeDate;
}> & {
    createdAt: NativeDate;
    name: string;
    functionCode: string;
    executionCount: number;
    description?: string;
    graphqlEndpoint?: string;
    lastExecuted?: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: NativeDate;
    name: string;
    functionCode: string;
    executionCount: number;
    description?: string;
    graphqlEndpoint?: string;
    lastExecuted?: NativeDate;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    name: string;
    functionCode: string;
    executionCount: number;
    description?: string;
    graphqlEndpoint?: string;
    lastExecuted?: NativeDate;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    name: string;
    functionCode: string;
    executionCount: number;
    description?: string;
    graphqlEndpoint?: string;
    lastExecuted?: NativeDate;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
