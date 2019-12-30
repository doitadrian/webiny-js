import { ApolloGateway } from "@apollo/gateway";
import { LambdaGraphQLDataSource } from "apollo-gateway-aws-lambda";
import { ApolloServer } from "apollo-server-lambda";
import buildHeaders from "./buildHeaders";

function toBool(value) {
    if (typeof value === "string") {
        return value === "true";
    }

    return Boolean(value);
}

export default ({ server = {}, handler = {}, services = [] } = {}) => ({
    name: "create-apollo-gateway",
    type: "create-apollo-gateway",
    async createGateway({ plugins }) {
        const gateway = new ApolloGateway({
            serviceList: services.map(s => {
                s.url = "https://www.webiny.com";
                return s;
            }),

            buildService({ name }) {
                return new LambdaGraphQLDataSource({
                    functionName: services.find(s => s.name === name).function,

                    willSendRequest({ request, context }) {
                        if (context.headers) {
                            Object.keys(context.headers).forEach(key => {
                                if (context.headers[key]) {
                                    request.http.headers.set(key, context.headers[key]);
                                }
                            });
                        }
                    }
                });
            }
        });

        const { schema, executor } = await gateway.load();

        let apollo = new ApolloServer({
            schema,
            executor,
            introspection: toBool(server.introspection),
            playground: toBool(server.playground),
            context: async ({ event }) => {
                const headers = buildHeaders(event);

                const headerPlugins = plugins.byType("apollo-gateway-headers");
                headerPlugins.forEach(pl => pl.buildHeaders({ headers, plugins }));

                return { headers };
            }
        });

        return apollo.createHandler({
            cors: {
                origin: "*",
                methods: "GET,HEAD,POST,OPTIONS",
                ...handler.cors
            }
        });
    }
});
