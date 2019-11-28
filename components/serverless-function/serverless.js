const { join } = require("path");
const fs = require("fs-extra");
const prettier = require("prettier");
const execa = require("execa");
const camelCase = require("lodash.camelcase");
const webpack = require("webpack");
const { transform } = require("@babel/core");
const { Component } = require("@serverless/core");

const normalizePlugins = plugins => {
    const normalized = [];
    plugins.forEach(pl => {
        let factory,
            options = {};
        if (typeof pl === "string") {
            factory = pl;
        } else {
            factory = pl.factory;
            options = pl.options || {};
        }

        normalized.push({ factory, options });
    });

    return normalized;
};

class ServerlessFunction extends Component {
    async default(inputs = {}) {
        let { name, webpackConfig, root } = inputs;

        let plugins = normalizePlugins(inputs.plugins || []);

        const hasPlugins = Boolean(plugins.length);

        if (inputs.hook) {
            if (!root) {
                throw Error(`"hook" input requires "root" to be set.`);
            }
            const functionRoot = join(this.context.instance.root, root);
            this.context.log("Building function");
            const hooks = Array.isArray(inputs.hook) ? inputs.hook : [inputs.hook];
            for (let i = 0; i < hooks.length; i++) {
                const [cmd, ...args] = hooks[i].split(" ");
                await execa(cmd, args, {
                    cwd: functionRoot,
                    env: { NODE_ENV: "production" },
                    stdio: "inherit"
                });
            }
        }

        if (hasPlugins) {
            const boilerplateRoot = join(this.context.instance.root, ".webiny");
            const componentRoot = join(boilerplateRoot, camelCase(name));
            fs.ensureDirSync(componentRoot);

            // Generate boilerplate code
            const injectPlugins = [];
            plugins.forEach((pl, index) => {
                injectPlugins.push({
                    name: `injectedPlugins${index + 1}`,
                    path: pl.factory,
                    options: pl.options
                });
            });

            const source = fs.readFileSync(__dirname + "/boilerplate/handler.js", "utf8");
            const { code } = await transform(source, {
                plugins: [[__dirname + "/transform/plugins", { plugins: injectPlugins }]]
            });

            fs.writeFileSync(
                join(componentRoot, "handler.js"),
                prettier.format(code, { parser: "babel" })
            );

            fs.copyFileSync(
                join(__dirname, "boilerplate", "webpack.config.js"),
                join(componentRoot, "/webpack.config.js")
            );

            // Bundle code (switch CWD before running webpack)
            const cwd = process.cwd();
            process.chdir(componentRoot);

            this.context.instance.debug("Start bundling with webpack");
            await new Promise((res, reject) => {
                this.context.status("Building");
                let config = require(componentRoot + "/webpack.config.js");

                if (webpackConfig) {
                    try {
                        // Resolve customizer path relative to serverless.yml file
                        const customizerPath = require.resolve(webpackConfig, { paths: [cwd] });
                        if (!fs.existsSync(customizerPath)) {
                            this.context.instance.debug(
                                `Webpack customizer does not exist at %o!`,
                                customizerPath
                            );
                        } else {
                            this.context.instance.debug(
                                `Loading webpack customizer from %o`,
                                customizerPath
                            );
                            const customizer = require(customizerPath);
                            config = customizer({ config, instance: this, root: componentRoot });
                        }
                    } catch (err) {
                        this.context.instance.debug(
                            `Error loading webpack customizer %o: %o`,
                            webpackConfig,
                            err.message
                        );
                    }
                }

                webpack(config).run((err, stats) => {
                    if (err) {
                        return reject(err);
                    }

                    if (stats.hasErrors()) {
                        const info = stats.toJson();

                        if (stats.hasErrors()) {
                            console.error(info.errors);
                        }

                        return reject("Build failed!");
                    }

                    this.context.instance.debug("Finished bundling");
                    res();
                });
            });

            // Restore initial CWD
            process.chdir(cwd);

            fs.copyFileSync(
                join(componentRoot, "build", "handler.js"),
                join(inputs.code, "/wrapper.js")
            );
        }

        const lambda = await this.load("@serverless/function");
        const output = await lambda({
            ...inputs,
            handler: hasPlugins ? "wrapper.wrapper" : inputs.handler
        });

        this.state.output = output;
        await this.save();

        return output;
    }

    async remove(inputs = {}) {
        const lambda = await this.load("@serverless/function");
        await lambda.remove(inputs);

        this.state = {};
        await this.save();
    }
}

module.exports = ServerlessFunction;
