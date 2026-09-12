import { strict as assert } from "node:assert";
import { test } from "node:test";
import { tenantBranchLabel, tenantHoursOrStatus } from "../app/utils/tenantStatus";

test("REST and GraphQL temporary-closure values have the same label", () => {
  for (const status of ["temporarily-closed", "temporarily_closed"] as const) {
    assert.equal(tenantBranchLabel({ name: "Blue Bistro", status }), "Blue Bistro (Temporarily closed)");
  }
});
test("closed branches are labeled; open and legacy branches are unmarked", () => {
  assert.equal(tenantBranchLabel({ name: "Red Space", status: "closed" }), "Red Space (Closed)");
  assert.equal(tenantBranchLabel({ name: "Red Space", status: "open" }), "Red Space");
  assert.equal(tenantBranchLabel({ name: "Red Space" }), "Red Space");
});


test("open branches show hours; closure status takes precedence over hours", () => {
  assert.equal(tenantHoursOrStatus({ status: "open", openingHours: "11:00–22:00" }), "11:00–22:00");
  assert.equal(tenantHoursOrStatus({ status: "closed", openingHours: "11:00–22:00" }), "Closed");
  assert.equal(tenantHoursOrStatus({ status: "temporarily_closed", openingHours: "11:00–22:00" }), "Temporarily closed");
  assert.equal(tenantHoursOrStatus({ status: "open" }), "");
});
