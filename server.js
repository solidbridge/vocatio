// Passenger/Hostinger entry. Boots Next.js in production against the
// port Passenger provides (or 3000 locally).
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`> Vocatio ready on http://${hostname}:${port}`);
  });
});
