#!/usr/bin/env node
"use strict";

const chalk = require("chalk");
yargs.command(
    "deploy-api",
    `Deploy API from ${green("api")} folder.\n${dim("(NOTE: run from project root)")}`,
    yargs => {
        yargs.option("env", {
            describe: "Environment to deploy. Must match your environments in .env.json.",
            default: "local"
        });
        yargs.option("alias", {
            describe: "Alias to deploy."
        });
        yargs.option("force", {
            describe: "Deploy even if component inputs were not changed."
        });
        yargs.option("debug", {
            describe: "Show debug messages.",
            default: false,
            type: "boolean"
        });
    },
    async argv => {
        await require("./sls/deploy")({ ...argv, what: "api" });
        process.exit(0);
    }
);
const { verifyConfig } = require("./config");
const currentNodeVersion = process.versions.node;
const majorVersion = parseInt(currentNodeVersion.split(".")[0]);
const minorVersion = parseInt(currentNodeVersion.split(".")[1]);

(async () => {
    if (majorVersion < 8 || (majorVersion === 8 && minorVersion < 10)) {
        console.error(
            chalk.red(
                "You are running Node " +
                currentNodeVersion +
                ".\n" +
                "Webiny requires Node 8.10 or higher. \n" +
                "Please update your version of Node."
            )
        );
        process.exit(1);
    }

    try {
        await execa("yarn", ["--version"]);
    } catch (err) {
        console.error(
            chalk.red(`"@webiny/cli" depends on "yarn" and its built-in support for workspaces.`)
        );
        console.log(`Please visit https://yarnpkg.com to install "yarn".`);
        process.exit(1);
    }

    verifyConfig();
    require("./cli");
})();
