export default {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    "^.+\\.(css|scss|sass)$": "jest-transform-stub",
    "^.+\\.(svg|png|jpg|jpeg|gif|ico|webp|avif|bmp|tiff)$": "jest-transform-stub"
  },
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "^/vite.svg$": "<rootDir>/src/assets/vite.svg"
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Add this line
};
