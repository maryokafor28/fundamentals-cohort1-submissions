"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = void 0;
const authorizeAdmin = async (req, res, next) => {
    const { role } = req.user;
    if (role != "admin")
        return res.status(401).send({ message: "Unauthorized request" });
    next();
};
exports.authorizeAdmin = authorizeAdmin;
