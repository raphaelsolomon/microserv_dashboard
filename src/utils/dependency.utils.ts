import lodash from 'lodash';
import moment from 'moment';
import axios from 'axios';
import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';

export default class DependencyManager {
    private baseDependencies: { [key: string]: any };

    constructor() {
        // Base dependencies that are always available
        this.baseDependencies = {
            lodash,
            moment
        };
    }

    // Analyze function code to determine needed dependencies
    analyzeDependencies(functionCode: string) {
        const neededDeps = new Set();

        // Check for axios usage
        if (functionCode.includes('axios.')) {
            neededDeps.add('axios');
        }

        // Check for GraphQL usage
        if (functionCode.includes('apolloClient.') || functionCode.includes('gql`')) {
            neededDeps.add('apolloClient');
            neededDeps.add('gql');
        }

        return Array.from(neededDeps);
    }

    // Load dependencies dynamically based on function needs
    async loadDependencies(functionCode: string, graphqlEndpoint: string) {
        const neededDeps = this.analyzeDependencies(functionCode);
        const dependencies = { ...this.baseDependencies };

        for (const dep of neededDeps) {
            switch (dep) {
                case 'axios':
                    dependencies.axios = axios;
                    break;

                case 'apolloClient':
                    dependencies.apolloClient = new ApolloClient({
                        link: new HttpLink({
                            uri: graphqlEndpoint || 'http://localhost:4000/graphql',
                            fetch
                        }),
                        cache: new InMemoryCache(),
                        defaultOptions: {
                            watchQuery: { fetchPolicy: 'no-cache' },
                            query: { fetchPolicy: 'no-cache' }
                        }
                    });
                    break;

                case 'gql':
                    dependencies.gql = gql;
                    break;
            }
        }

        return dependencies;
    }

    createSandbox(dependencies: { [key: string]: any }) {
        return {
            console: {
                log: console.log,
                error: console.error,
                warn: console.warn
            },
            setTimeout,
            clearTimeout,
            Buffer,
            ...dependencies
        };
    }
}