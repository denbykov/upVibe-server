import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./",
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1",
  },
  testMatch: ["**/tests/unit/**/*.test.ts"],
  collectCoverage: true,
};

export default config;
