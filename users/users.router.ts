import restify from 'restify';

import Route from '../common/route';
import User from './users.model';

const BASE_RESOURCE = "/users";

class UserRoutes extends Route {   
    applyRoutes(application: restify.Server): void {
        this.findAll(application);
        this.load(application);
    }

    /**
     * List all users
     * @param application 
     */
    findAll(application: restify.Server): void {
        application.get(BASE_RESOURCE, (req, res, next) => {
            User.find()
                .then(users => {
                    res.json(users);
                    return next();
                })
        })
    }

    load(application: restify.Server): void {
        application.get(`${BASE_RESOURCE}/:id`, (req, res, next) => {
            User.findById(req.params.id)
                .then(user => {
                    if (user) {
                        res.json(user)
                        return next();
                    }
                    res.send(404);
                    return next();
                });
        })
    }
}

export const usersRoutes = new UserRoutes();