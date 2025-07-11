import { Server } from "http";
import app from "./app";
import config from "./config";

const PORT = config.port || 3000;

async function main() {
  const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}

main();
