import { Request, Response } from 'restify';
import { DefinedHttpError } from 'restify-errors';

export const handleError = (req: Request, res: Response, err: DefinedHttpError, done: any) => {
    overrideError(err);
    handle(err);
    done();
}

const overrideError = (err: DefinedHttpError) => { 
    err.toJSON = () => {
        return {
            message: err.message
        }
    }
}

const handle = (err: DefinedHttpError) => {
    switch (err.name) {
        case 'MongoError':
            if(err.code === '11000') {
                err.statusCode = 400;   
            }
            break;
        case 'ValidationError':
            err.statusCode = 400;
            break;    
        default:
            break;
    }
}