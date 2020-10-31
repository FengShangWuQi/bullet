import { appkit } from "../src";

describe("action #appkit", () => {
  it("appkit dev", async () => {
    await appkit("dev");
  });
  it("appkit build", async () => {
    await appkit("build");
  });
  it("appkit release", async () => {
    await appkit("release");
  });
});
