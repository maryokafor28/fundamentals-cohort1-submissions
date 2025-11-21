const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  setupFiles: ["<rootDir>/tests/setup.ts"], // Loads BEFORE test framework
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Loads AFTER test framework
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};
