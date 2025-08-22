import httpStatus  from 'http-status';
import { Server } from "http";
import app from "./app";
import config from "./config";
import ApiError from "./app/errors/ApiError";

const PORT = config.port || 3000;

async function main() {
  try {
    const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server Closed!");
      });
    }
    process.exit(1);
  };

  process.on("uncaughtException", (error) => {
    console.log(error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    exitHandler();
  });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,"Error In Server")
  }
}

main();
