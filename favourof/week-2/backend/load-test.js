const autocannon = require("autocannon");

const url = "http://localhost:3000/api/process-data";

const instance = autocannon({
  url,
  method: "POST", // 👈 specify POST instead of default GET
  connections: 100, // 100 concurrent users
  duration: 10, // test runs for 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ input: "test" }), // 👈 send some body data
});

autocannon.track(instance, { renderProgressBar: true });
