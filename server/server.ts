import restify from 'restify';
import mongoose, { mongo } from 'mongoose';

import Route from '../common/route';
import environment from '../common/environment';

export default class Server {

    application: restify.Server | undefined;

    constructor(private routers: Route[] = []) { }

    bootstrap(): Promise<Server> {
        return this.initializeDb()
                .then(() => this.initServer()
                                .then(() => this));
            
    }

    private initializeDb(): mongoose.MongooseThenable {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment.db.url, {
            useMongoClient: true
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
        
    }

    private createRoutes(server: restify.Server): void {
        if (this.routers) {
            this.routers.forEach(route => route.applyRoutes(server));
        }
    }
}