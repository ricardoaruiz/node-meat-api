import restify, { Request, Response, Next } from 'restify';
import errors from 'restify-errors';
import mongoose from 'mongoose';
import { NotFoundError } from 'restify-errors'
import { EventEmitter } from 'events';

export default abstract class Route extends EventEmitter {
    
    abstract applyRoutes(application: restify.Server): void;

    render(response: Response, next: Next, continueToNextStep: boolean = true) {
        return (document: any) => {
            if (document) {
                this.emit('beforeRender', document);
                response.json(document);
            } else {
                throw new NotFoundError('Documento não encontrado');
            }
            return next(continueToNextStep);
        }
    }

    renderAll(response: Response, next: Next, continueToNextStep: boolean = true) {
        return (documents: any[]) => {
            if (documents) {
                documents.forEach(document => {
                    this.emit('beforeRender', document);
                });
                response.json(documents)
            } else {
                response.json([]);
            }
            return next(continueToNextStep);
        }
    }

    validateId(request: Request, response: Response, next: Next) {
        if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
            next(new errors.NotFoundError('Documento não encontrado'));
        } else {
            next();
        }
    }

}