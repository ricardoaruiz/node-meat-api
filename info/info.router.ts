import restify from 'restify';

import Route from '../common/route';

const BASE_RESOURCE = "/info";

class InfoRoutes extends Route {
    applyRoutes(application: restify.Server): void {
        application.get(BASE_RESOURCE, (req, res, next) => {
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

export const infoRoutes = new InfoRoutes();