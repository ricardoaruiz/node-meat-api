import { environment } from './../common/environments';
import restify from 'restify';

export class Server {

    application: restify.Server | undefined;

    bootstrap(): Promise<Server> {
        return this.initServer()
            .then(() => this);
    }

    private initServer(): Promise<restify.Server> {
        return new Promise((resolve, reject) => {
            try {
                this.application = this.createServer();
                this.setPlugins(this.application);
                this.createInfoRoute(this.application);

                // Server listen port
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

    private createInfoRoute(server: restify.Server): void {
        server.get('/info', (req, res, next) => {
            res.json({
                browser: req.userAgent(),
                method: req.method,
                url: req.url,
                path: req.path(),
                query: req.query,
            });
            return next();
        });
    }

}