import restify from 'restify';

const mpContentType = 'application/merge-patch+json';

export const mergePatchBodyParser = (req: restify.Request, res: restify.Response, next: restify.Next) => {
    if (req.getContentType() === mpContentType && req.method === 'PATCH') {
        try {
            (<any>req).rawBody = req.body;
            req.body = JSON.parse(req.body);
        } catch(e) {
            return next(new Error(`Invalid content: ${e.message}`));
        }
    }
    next();
}