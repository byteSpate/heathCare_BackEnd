"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const ApiError_1 = __importDefault(require("./app/errors/ApiError"));
const PORT = config_1.default.port || 3000;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const server = app_1.default.listen(PORT, () => {
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
        }
        catch (error) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Error In Server");
        }
    });
}
main();
