import * as logger from "../src";

describe("#logger", () => {
  it("info", () => {
    logger.info("...");
  });
  it("success", () => {
    logger.success("...");
  });
  it("warn", () => {
    logger.warn("...");
  });
  it("error", () => {
    logger.error("...");
  });
});
