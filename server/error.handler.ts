import { Request, Response } from 'restify';

export const handleError = (req: Request, res: Response, err: any, done: any) => {
    handle(err);
    return done();
}

const handle = (err: any) => {
    switch (err.name) {
        case 'MongoError':
            if(err.code === '11000') {
                err.statusCode = 400;   
            }
            err.toJSON = () => {
                return {
                    message: err.message
                }
            }            
            break;
        case 'ValidationError':
            err.statusCode = 400;
            const messages: any[] = [];
            for(let name in err.errors) {
                messages.push({ message: err.errors[name].message})
            }
            err.toJSON = () => {
                return {
                    errors: messages
                }
            }
            break;
        default:
            break;
    }
}