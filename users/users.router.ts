import restify from 'restify';

import Route from '../common/route';
import User from './users.model';

const BASE_RESOURCE = "/users";

class UserRoutes extends Route {   
    applyRoutes(application: restify.Server): void {
        this.findAll(application);
    }

    /**
     * List all users
     * @param application 
     */
    findAll(application: restify.Server): void {
        application.get(BASE_RESOURCE, (req, res, next) => {
            User.findAll()
                .then(users => {
                    res.json(users);
                    return next();
                })
        })
    }
}

export const usersRoutes = new UserRoutes();