import { acceptance } from "helpers/qunit-helpers";

acceptance("DiscourseCustomTimer", { loggedIn: true });

test("DiscourseCustomTimer works", async assert => {
  await visit("/admin/plugins/discourse-custom-timer");

  assert.ok(false, "it shows the DiscourseCustomTimer button");
});
