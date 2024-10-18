import express, { Express } from 'express';
import { Server as HttpServer } from 'http';
import { createServer } from 'https';
import cors from 'cors';
import routerBase from '../routes/base';
import routeContact from '../routes/contact';
import routeRegist from '../routes/register';
import routeAssistants from '../routes/assistants';
import fs from 'fs';

class Server {
    private app: Express;
    private port: number;
    private server: HttpServer;

    constructor() {

        //express server
        this.app = express();
        this.port = parseInt(`${process.env.PORT}`);

        //http / https server
        this.server = process.env.ENVIRONMENT == 'productivo'
            ? createServer(
                {
                    cert: fs.readFileSync('/cert/ssaver.gob.mx.crt'),
                    key: fs.readFileSync('/cert/ssaver.gob.mx.key')
                }, this.app
            )
            : require('http').createServer(this.app);
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(cors({ //only enable cors if clients will connect from remote domains or ports besides 'origin'
            origin: '*', // all domains allowed use *
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        this.app.use('/', routerBase);
        this.app.use('/api/contact', routeContact);
        this.app.use('/api/register', routeRegist);
        this.app.use('/api/assistants', routeAssistants)
    }

    execute() {

        this.middlewares();

        this.server.listen(this.port, () => {
            process.env.ENVIRONMENT == 'productivo'
                ? console.log(`Server Socket Productivo ready in port: ${this.port}...`)
                : console.log(`Server Socket Pruebas ready in http://localhost: ${this.port}...`);
        })
    }

}

export default Server;