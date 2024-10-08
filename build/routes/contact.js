"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_1 = require("../controllers/contact");
const router = (0, express_1.Router)();
router.post('/mail', contact_1.sendContactMail);
exports.default = router;