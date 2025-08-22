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
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtiesServices = void 0;
const fileUploader_1 = require("../../../helpers/fileUploader");
const prisma_1 = require("../../../shared/prisma");
const insertIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    req.body.title = req.body.title;
    const result = yield prisma_1.prisma.specialties.create({
        data: {
            title: req.body.title,
            icon: req.body.icon,
        },
    });
    if (!result) {
        throw new Error("Failed to create specialty");
    }
    return result;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.specialties.findMany({});
    return result;
});
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.specialties.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    const result = yield prisma_1.prisma.specialties.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.specialtiesServices = {
    insertIntoDB,
    getAllFromDB,
    deleteById,
};
