import { PluginsContainer } from "@webiny/plugins";

let apolloHandler;
let plugins;

export const wrapper = async (event, context) => {
    if (!apolloHandler) {
        plugins = new PluginsContainer([]);

        const userHandler = require("./handler");
        apolloHandler = userHandler["handler"]; // TODO: make this dynamic

        const wrappers = plugins.byType("handler-wrapper");
        for (let i = 0; i < wrappers.length; i++) {
            apolloHandler = await wrappers[i].wrap({ handler: apolloHandler, plugins });
        }
    }

    context.plugins = plugins;

    return apolloHandler(event, context);
};
