"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.authServices = void 0;
const jwtHelpers_1 = require("./../../../helpers/jwtHelpers");
const prisma_1 = require("../../../shared/prisma");
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_2 = require("../../../generated/prisma");
const config_1 = __importDefault(require("../../../config"));
const sendEmail_1 = __importDefault(require("./sendEmail"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: prisma_2.UserStatus.ACTIVE,
        },
    });
    const isPasswordMatch = yield bcrypt.compare(payload.password, userData.password);
    if (!isPasswordMatch) {
        throw new Error("Password did not match ");
    }
    const accessToken = jsonwebtoken_1.default.sign({ email: userData.email, role: userData.role }, config_1.default.jwt.jwt_secret, {
        algorithm: "HS256",
        expiresIn: "30d",
    });
    const refreshToken = jsonwebtoken_1.default.sign({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.refresh_token_secret, {
        algorithm: "HS256",
        expiresIn: "30d",
    });
    return {
        accessToken,
        refreshToken,
        needsPasswordChange: userData.needsPasswordChange,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_token_secret);
    }
    catch (error) {
        throw new Error("You are not authorized");
    }
    const isUserExist = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: prisma_2.UserStatus.ACTIVE,
        },
    });
    const accessToken = jsonwebtoken_1.default.sign({ email: isUserExist.email, role: isUserExist.role }, config_1.default.jwt.jwt_secret, {
        algorithm: "HS256",
        expiresIn: "30d",
    });
    return {
        accessToken,
        needsPasswordChange: isUserExist.needsPasswordChange,
    };
});
const changePassword = (userData, postData) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: userData.email,
            status: prisma_2.UserStatus.ACTIVE,
        },
    });
    const isPasswordMatch = yield bcrypt.compare(postData.oldPassword, isUser.password);
    if (!isPasswordMatch) {
        throw new Error("Password did not match");
    }
    const hashedPassword = yield bcrypt.hash(postData.newPassword, 10);
    const updateUser = yield prisma_1.prisma.user.update({
        where: {
            email: isUser.email,
        },
        data: {
            password: hashedPassword,
            needsPasswordChange: false,
        },
    });
    return {
        message: "Password Changed Successfully",
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: prisma_2.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not a user");
    }
    const resetToken = jsonwebtoken_1.default.sign({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.reset_pass_secret, {
        algorithm: "HS256",
        expiresIn: "15m",
    });
    const resetLink = config_1.default.reset_link + `?email=${userData.email}&token=${resetToken}`;
    (0, sendEmail_1.default)(userData.email, resetLink);
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: prisma_2.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
    }
    const isValidToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.reset_pass_secret);
    if (!isValidToken) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden");
    }
    const hashedPassword = yield bcrypt.hash(payload.password, 10);
    const updatePassword = yield prisma_1.prisma.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return updatePassword;
});
exports.authServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
