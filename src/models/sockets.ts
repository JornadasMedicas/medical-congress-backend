import { Socket } from "socket.io";
import { getModulesQuery, getWorkshopsQuery } from "../helpers/adminQueries";

class Sockets {
    io: Socket;

    constructor(io: Socket) {
        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', (socket: Socket) => {
            console.log('Client connected: ', socket.id, socket.handshake.address);

            socket.on('isValidRegistry', async (_) => {
                const workshops = await getWorkshopsQuery();
                const modules = await getModulesQuery();

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