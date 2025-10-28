import express, { Express } from 'express';
import { Server as HttpServer } from 'http';
import { createServer } from 'https';
import http from 'http';
import cors from 'cors';
import routerBase from '../routes/base';
import routeContact from '../routes/contact';
import routeRegist from '../routes/register';
import routeAssistants from '../routes/assistants';
import routeAdmin from '../routes/admin';
import fs from 'fs';
import { Socket } from 'socket.io';
import Sockets from './sockets';

class Server {
    private app: Express;
    private port: number;
    private server: HttpServer;
    private io: Socket;
    private sockets: Sockets;

    constructor() {

        //express server
        this.app = express();
        this.port = parseInt( `${ process.env.PORT }` );
        this.server = require('http').createServer(this.app);
        
        //initialize sockets
        this.io = require('socket.io')(this.server, {
            cors: { //only enable cors if clients will connect from remote domains or ports besides 'origin'
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        
        this.sockets = new Sockets(this.io);
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(cors({ //only enable cors if clients will connect from remote domains or ports besides 'origin'
            origin: '*', // all domains allowed use *
            methods: ['GET', 'POST', 'PUT'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        this.app.use('/', routerBase);
        this.app.use('/api/contact', routeContact);
        this.app.use('/api/register', routeRegist);
        this.app.use('/api/assistants', routeAssistants);
        this.app.use('/api/admin', routeAdmin);
    }

    execute() {

        this.middlewares();

        this.server.listen(this.port, () => {
            console.log(`Server running on port: ${this.port}...`);
        });
    }

}

export default Server;