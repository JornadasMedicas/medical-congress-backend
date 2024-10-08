"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_1 = require("../controllers/register");
const router = (0, express_1.Router)();
router.post('/mail', register_1.sendRegistMail);
exports.default = router;
register_1.sendRegistMail;
