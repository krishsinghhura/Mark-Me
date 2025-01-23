const app = require("./app");
const http = require("http");

const port = 4000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
