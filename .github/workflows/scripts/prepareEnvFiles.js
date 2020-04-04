// Ran fro
const fs = require("fs-extra");
const path = require("path");
const { green } = require("chalk");
const crypto = require("crypto");
const loadJson = require("load-json-file");
const writeJson = require("write-json-file");
const uuid = require("uuid/v4");

async function prepareEnvFiles() {
    console.log("Preparing environment files...");

    if (!process.env.MONGODB_SERVER) {
        console.log("MONGODB_SERVER environment variable missing.");
        process.exit(1);
    }

    console.log(`✍️  Writing environment config files...`);

    // Create root .env.json and fill in the MONGODB_NAME and MONGODB_SERVER parameters.
    const rootEnvJsonPath = path.resolve("examples", ".env.json");
    const rootExampleEnvJsonPath = path.resolve(
        "packages",
        "cli",
        "create",
        "template",
        "example.env.json"
    );

    fs.copyFileSync(rootExampleEnvJsonPath, rootEnvJsonPath);
    const rootEnvJson = await loadJson.sync(rootEnvJsonPath);
    rootEnvJson.default.MONGODB_NAME = `webiny-test-` + (new Date().getTime());
    rootEnvJson.default.MONGODB_SERVER = process.env.MONGODB_SERVER;

    await writeJson(rootEnvJsonPath, rootEnvJson);

    console.log(`✅️ ${green("examples/.env.json")} was created successfully!`);

    // Create API .env.json file.
    const envJsonPath = path.resolve("examples", "api", ".env.json");
    const exampleEnvJsonPath = path.resolve("examples", "api", "example.env.json");

    fs.copyFileSync(exampleEnvJsonPath, envJsonPath);

    const jwtSecret = crypto
        .randomBytes(128)
        .toString("base64")
        .slice(0, 60);

    const envJson = await loadJson.sync(envJsonPath);
    envJson.default.S3_BUCKET = `webiny-js-dev-${uuid()
        .split("-")
        .shift()}`;
    envJson.default.JWT_SECRET = jwtSecret;
    await writeJson(envJsonPath, envJson);
    console.log(`✅️ ${green("examples/api/.env.json")} was created successfully!`);

    // Create `admin` .env.json file.
    const adminEnvJsonPath = path.resolve("examples", "apps", "admin", ".env.json");
    const exampleAdminEnvJsonPath = path.resolve("examples", "apps", "admin", "example.env.json");
    fs.copyFileSync(exampleAdminEnvJsonPath, adminEnvJsonPath);
    console.log(`✅️ ${green("examples/apps/admin/.env.json")} was created successfully!`);

    // Create `site` .env.json
    const siteEnvJsonPath = path.resolve("examples", "apps", "site", ".env.json");
    const exampleSiteEnvJsonPath = path.resolve("examples", "apps", "site", "example.env.json");
    fs.copyFileSync(exampleSiteEnvJsonPath, siteEnvJsonPath);
    console.log(`✅️ ${green("examples/apps/site/.env.json")} was created successfully!`);


    console.log("✅️ Preparing environment files complete!");
}

prepareEnvFiles();
