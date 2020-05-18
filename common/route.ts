import { EventEmitter } from 'events';
import restify, { Response, Next } from 'restify';

export default abstract class Route extends EventEmitter {
    
    abstract applyRoutes(application: restify.Server): void;

    render(response: Response, next: Next) {
        return (document: any) => {
            if (document) {
                this.emit('beforeRender', document);
                response.json(document);
            } else {
                response.send(404);
            }
            return next();
        }
    }

}