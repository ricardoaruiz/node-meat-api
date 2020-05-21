import { Request, Response } from 'restify';

interface ErrorsResponse {
    errors: ErrorResponse[]
}

interface ErrorResponse {
    message: string;
}

export const handleError = (req: Request, res: Response, err: any, done: any) => {
    handle(err);
    buildResponseError(err);
    return done();
}

const handle = (err: any) => {
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

const buildResponseError = (err: any) => {
    const errors: ErrorResponse[] = [];

    if (err.errors) {
        for(let name in err.errors) {
            errors.push({ message: err.errors[name].message})
        }
    } else {
        errors.push({ message: err.message})
    }
    
    err.toJSON = () => {
        return {
            errors
        }
    }
}