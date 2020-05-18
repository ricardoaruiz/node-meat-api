import restify from 'restify';
import mongoose from 'mongoose';

import Route from '../common/route';
import environment from '../common/environment';
import { mergePatchBodyParser } from './merge-patch.parser';

export default class Server {

    application: restify.Server | undefined;

    constructor(private routers: Route[] = []) { }

    bootstrap(): Promise<Server> {
        return this.initializeDb()
                .then(() => this.initServer()
                                .then(() => this));
            
    }

    private initializeDb(): Promise<typeof mongoose> {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment.db.url, {
            // useMongoClient: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    private initServer(): Promise<restify.Server> {
        return new Promise((resolve, reject) => {
            try {
                this.application = this.createServer();
                this.setPlugins(this.application);                
                this.createRoutes(this.application);
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

    private setPlugins(server: restify.Server): void {
        server.use(restify.plugins.queryParser());
        server.use(restify.plugins.bodyParser());
        server.use(mergePatchBodyParser);
        
    }

    private createRoutes(server: restify.Server): void {
        if (this.routers) {
            this.routers.forEach(route => route.applyRoutes(server));
        }
    }
}