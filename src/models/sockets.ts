import { Socket } from "socket.io";
import { getModulesQuery, getWorkshopsQuery } from "../helpers/adminQueries";
import { PropsSendRegistMailInterface } from "../interfaces/IRegister";
import { updateModuleCounter, updateWorkshopsCounter } from "../helpers/registerQueries";

class Sockets {
    io: Socket;

    constructor(io: Socket) {
        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', (socket: Socket) => {
            console.log('Client connected: ', socket.id, socket.handshake.address);

            socket.on('isValidRegistry', async (data: PropsSendRegistMailInterface) => {
                let modules: any[] = [];
                let workshops: any[] = [];

                if (data.modulo !== null && data.modulo !== 0) {
                    modules = await updateModuleCounter(data.modulo) as any[];
                }

                if (data.talleres.length > 0) {
                    workshops = await updateWorkshopsCounter(data.talleres) as any[];
                }

                this.io.emit('updateCounters', { modules, workshops });
            });

            //on disconnected client
            socket.on("disconnect", () => {
                console.log('Client disconnected: ', socket.id, socket.handshake.address, '\n');
            });
        });
    }
}

export default Sockets;