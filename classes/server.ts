import  express  from "express";
import { SERVER_PORT } from '../global/environments';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/socket';

export default class Server {

    private static _intance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;// encargado de los eventos
    private httpServer: http.Server;
    constructor(){
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server( this.app);
		this.io = new socketIO.Server(this.httpServer, {
			cors: {
				origin: true,
				credentials: true
			}
		});
        this.escucharSockets();
    }

    public static get instance(){
        return this._intance || ( this._intance = new this());
    }

    private escucharSockets(){
        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {
            console.log('Cliente conectado');

            // RECIBIR MENSAJE
            socket.mensaje(cliente,this.io)
            // DESCONECTAR
            socket.desconectar(cliente);
        })
    }

    start( callback: VoidFunction) {
        this.httpServer.listen(this.port, callback);
    }
}