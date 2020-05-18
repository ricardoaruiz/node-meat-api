import restify from 'restify';

import Route from '../common/route';
import User, { UserDocument } from './users.model';

const BASE_RESOURCE = "/users";

class UserRoutes extends Route {   
    applyRoutes(application: restify.Server): void {
        this.findAll(application);
        this.load(application);
        this.create(application);
        this.update(application);
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
        });
    }

    /**
     * Load a user by id
     * @param application 
     */
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
        });
    }

    /**
     * Create new user
     * @param application 
     */
    create(application: restify.Server): void {
        application.post(BASE_RESOURCE, (req, res, next) => {
            const user = new User(req.body);
            user.save()
                .then(user => {
                    user.password = '';
                    res.json(user)
                    return next();
                })

        });
    }

    update(application: restify.Server): void {
        application.put(`${BASE_RESOURCE}/:id`, (req, res, next) => {
            const options = { overwrite: true };
            User.update({ _id: req.params.id }, req.body, options)
                .exec()
                .then(result => {
                    if(result.n) {
                        return User.findById(req.params.id);
                    } else {
                        res.send(404);
                    }
                })
                .then((user: UserDocument) => {
                    res.json(user);
                    return next();
                });
        });
    }
}

export const usersRoutes = new UserRoutes();