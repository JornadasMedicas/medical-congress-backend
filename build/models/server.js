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
const assistants_1 = __importDefault(require("../routes/assistants"));
const admin_1 = __importDefault(require("../routes/admin"));
const sockets_1 = __importDefault(require("./sockets"));
class Server {
    constructor() {
        //express server
        this.app = (0, express_1.default)();
        this.port = parseInt(`${process.env.PORT}`);
        this.server = require('http').createServer(this.app);
        //initialize sockets
        this.io = require('socket.io')(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        this.sockets = new sockets_1.default(this.io);
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)({
            origin: '*', // all domains allowed use *
            methods: ['GET', 'POST', 'PUT'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        this.app.use('/', base_1.default);
        this.app.use('/api/contact', contact_1.default);
        this.app.use('/api/register', register_1.default);
        this.app.use('/api/assistants', assistants_1.default);
        this.app.use('/api/admin', admin_1.default);
    }
    execute() {
        this.middlewares();
        this.server.listen(this.port, () => {
            console.log(`Server running on port: ${this.port}...`);
        });
    }
}
exports.default = Server;
