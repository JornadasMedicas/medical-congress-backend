import express, { Express } from 'express';
import { Server as HttpServer } from 'http';
import cors from 'cors';
import routerBase from '../routes/base';
import routeContact from '../routes/contact'

class Server {
    private app: Express;
    private port: number;
    private server: HttpServer;

    constructor() {

        //express server
        this.app = express();
        this.port = parseInt(`${process.env.PORT}`);

        //http server
        this.server = require('http').createServer(this.app);
    }

    middlewares() {
        this.app.use( express.json() );
        this.app.use(cors({ //only enable cors if clients will connect from remote domains or ports besides 'origin'
            origin: '*', // all domains allowed use *
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        this.app.use( '/', routerBase );
        this.app.use('/api/contact', routeContact);
    }

    execute() {

        this.middlewares();

        this.server.listen(this.port, () => {
            console.log(`Server Running on port ${this.port}...`);
        })
    }

}

export default Server;