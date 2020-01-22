const execa = require("execa");

module.exports = async () => {
    await execa("yarn", ["rescripts", "start"], { cwd: __dirname, stdio: "inherit" });
};
