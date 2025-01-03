"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const base_1 = __importDefault(require("../routes/base"));
const contact_1 = __importDefault(require("../routes/contact"));
const register_1 = __importDefault(require("../routes/register"));
class Server {
    constructor() {
        //express server
        this.app = (0, express_1.default)();
        this.port = parseInt(`${process.env.PORT}`);
        //http server
        this.server = require('http').createServer(this.app);
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)({
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        this.app.use('/', base_1.default);
        this.app.use('/api/contact', contact_1.default);
        this.app.use('/api/register', register_1.default);
    }
    execute() {
        this.middlewares();
        this.server.listen(this.port, () => {
            console.log(`Server Running on port ${this.port}...`);
        });
    }
}
exports.default = Server;
