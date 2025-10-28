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
const adminQueries_1 = require("../helpers/adminQueries");
const registerQueries_1 = require("../helpers/registerQueries");
class Sockets {
    constructor(io) {
        this.io = io;
        this.socketEvents();
    }
    socketEvents() {
        this.io.on('connection', (socket) => {
            console.log('Client connected: ', socket.id, socket.handshake.address);
            socket.on('isValidRegistry', (data) => __awaiter(this, void 0, void 0, function* () {
                let modules = [];
                let workshops = [];
                if (data.modulo !== null && data.modulo !== 0) {
                    const resModules = yield (0, registerQueries_1.updateModuleCounter)(data.modulo);
                    if (resModules) {
                        modules = yield (0, adminQueries_1.getModulesQuery)();
                    }
                }
                if (data.talleres.length > 0) {
                    const resWorkshops = yield (0, registerQueries_1.updateWorkshopsCounter)(data.talleres);
                    if (resWorkshops) {
                        workshops = yield (0, adminQueries_1.getWorkshopsQuery)();
                    }
                }
                this.io.emit('updateCounters', { modules, workshops });
            }));
            //on disconnected client
            socket.on("disconnect", () => {
                console.log('Client disconnected: ', socket.id, socket.handshake.address, '\n');
            });
        });
    }
}
exports.default = Sockets;
