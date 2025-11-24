module.exports = {
  testEnvironment: "jsdom",

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
  },

  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },

  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"]
};
