"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const https_1 = require("https");
const cors_1 = __importDefault(require("cors"));
const base_1 = __importDefault(require("../routes/base"));
const contact_1 = __importDefault(require("../routes/contact"));
const register_1 = __importDefault(require("../routes/register"));
const assistants_1 = __importDefault(require("../routes/assistants"));
const admin_1 = __importDefault(require("../routes/admin"));
const fs_1 = __importDefault(require("fs"));
class Server {
    constructor() {
        //express server
        this.app = (0, express_1.default)();
        this.port = parseInt(`${process.env.PORT}`);
        //http / https server
        this.server = process.env.ENVIRONMENT == 'productivo'
            ? (0, https_1.createServer)({
                cert: fs_1.default.readFileSync('/cert/ssaver.gob.mx.crt'),
                key: fs_1.default.readFileSync('/cert/ssaver.gob.mx.key')
            }, this.app)
            : require('http').createServer(this.app);
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
            process.env.ENVIRONMENT == 'productivo'
                ? console.log(`Server Socket Productivo ready in port: ${this.port}...`)
                : console.log(`Server Socket Pruebas ready in http://localhost: ${this.port}...`);
        });
    }
}
exports.default = Server;
