import restify, { Response, Next } from 'restify';
import { NotFoundError } from 'restify-errors'
import { EventEmitter } from 'events';

export default abstract class Route extends EventEmitter {
    
    abstract applyRoutes(application: restify.Server): void;

    render(response: Response, next: Next) {
        return (document: any) => {
            if (document) {
                this.emit('beforeRender', document);
                response.json(document);
            } else {
                throw new NotFoundError('Documento não encontrado');
            }
            return next();
        }
    }

}