import restify from 'restify';
import mongoose from 'mongoose';

import Route from '../common/route';
import environment from '../common/environment';
import { mergePatchBodyParser } from './merge-patch.parser';
import { handleError } from './error.handler';

export default class Server {

    application: restify.Server;

    constructor(private routers: Route[] = []) {
        this.application = this.createServer();
    }

    bootstrap(): Promise<Server> {
        return this.initializeDb()
                .then(() => this.initServer()
                                .then(() => this));
            
    }

    private initializeDb(): Promise<typeof mongoose> {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    private initServer(): Promise<restify.Server> {
        return new Promise((resolve, reject) => {
            try {
                this.setPlugins();
                this.createRoutes();
                this.listenRestifyErrors()
                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });
            } catch(error) {
                reject(error);
            }
        });
    }

    private createServer(): restify.Server {
        return restify.createServer({
            name: "meat-api",
            version: "1.0.0"
        });
    }

    private setPlugins(): void {
        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);
        
    }

    private createRoutes(): void {
        if (this.routers) {
            this.routers.forEach(route => route.applyRoutes(this.application));
        }
    }

    private listenRestifyErrors(): void {
        this.application.on('restifyError', handleError);
    }
}