import test from "node:test";
import assert from "node:assert/strict";
import { app } from "../server.js";

test("GET /health returns the expected service state", async () => {
  const server = app.listen(0);

  try {
    const address = server.address();
    const response = await fetch(
      `http://127.0.0.1:${address.port}/health`
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, "ok");
    assert.equal(body.service, "zerojury");
    assert.equal(body.sponsor, "0G Compute");
  } finally {
    server.close();
  }
});
