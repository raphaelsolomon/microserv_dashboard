"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const axios_1 = __importDefault(require("axios"));
const core_1 = require("@apollo/client/core");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
class DependencyManager {
    constructor() {
        this.baseDependencies = {
            lodash: lodash_1.default,
            moment: moment_1.default
        };
    }
    analyzeDependencies(functionCode) {
        const neededDeps = new Set();
        if (functionCode.includes('axios.')) {
            neededDeps.add('axios');
        }
        if (functionCode.includes('apolloClient.') || functionCode.includes('gql`')) {
            neededDeps.add('apolloClient');
            neededDeps.add('gql');
        }
        return Array.from(neededDeps);
    }
    async loadDependencies(functionCode, graphqlEndpoint) {
        const neededDeps = this.analyzeDependencies(functionCode);
        const dependencies = Object.assign({}, this.baseDependencies);
        for (const dep of neededDeps) {
            switch (dep) {
                case 'axios':
                    dependencies.axios = axios_1.default;
                    break;
                case 'apolloClient':
                    dependencies.apolloClient = new core_1.ApolloClient({
                        link: new core_1.HttpLink({
                            uri: graphqlEndpoint || 'http://localhost:4000/graphql',
                            fetch: cross_fetch_1.default
                        }),
                        cache: new core_1.InMemoryCache(),
                        defaultOptions: {
                            watchQuery: { fetchPolicy: 'no-cache' },
                            query: { fetchPolicy: 'no-cache' }
                        }
                    });
                    break;
                case 'gql':
                    dependencies.gql = core_1.gql;
                    break;
            }
        }
        return dependencies;
    }
    createSandbox(dependencies) {
        return Object.assign({ console: {
                log: console.log,
                error: console.error,
                warn: console.warn
            }, setTimeout,
            clearTimeout,
            Buffer }, dependencies);
    }
}
exports.default = DependencyManager;
//# sourceMappingURL=dependency.utils.js.map