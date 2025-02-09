export default class DependencyManager {
    private baseDependencies;
    constructor();
    analyzeDependencies(functionCode: string): unknown[];
    loadDependencies(functionCode: string, graphqlEndpoint: string): Promise<{
        [x: string]: any;
    }>;
    createSandbox(dependencies: {
        [key: string]: any;
    }): {
        console: {
            log: {
                (...data: any[]): void;
                (message?: any, ...optionalParams: any[]): void;
            };
            error: {
                (...data: any[]): void;
                (message?: any, ...optionalParams: any[]): void;
            };
            warn: {
                (...data: any[]): void;
                (message?: any, ...optionalParams: any[]): void;
            };
        };
        setTimeout: typeof setTimeout;
        clearTimeout: typeof clearTimeout;
        Buffer: BufferConstructor;
    };
}
