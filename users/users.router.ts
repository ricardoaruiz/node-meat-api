import restify, { Request, Response, Next } from 'restify';

import Route from '../common/route';
import User, { UserDocument } from './users.model';

const BASE_RESOURCE = "/users";

class UserRoutes extends Route {   
    applyRoutes(application: restify.Server): void {
        this.findAll(application);
        this.load(application);
        this.create(application);
        this.update(application);
        this.partialUpdate(application);
        this.delete(application);
    }

    /**
     * List all users
     * @param application 
     */
    findAll(application: restify.Server): void {
        application.get(BASE_RESOURCE, (req: Request, res: Response, next: Next) => {
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
        application.get(`${BASE_RESOURCE}/:id`, (req: Request, res: Response, next: Next) => {
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
        application.post(BASE_RESOURCE, (req: Request, res: Response, next: Next) => {
            const user = new User(req.body);
            user.save()
                .then(user => {
                    user.password = '';
                    res.json(user)
                    return next();
                })

        });
    }

    /**
     * Update full resource
     * @param application 
     */
    update(application: restify.Server): void {
        application.put(`${BASE_RESOURCE}/:id`, (req: Request, res: Response, next: Next) => {           
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
                .then((user: any) => {
                    res.json(user);
                    return next();
                });
        });
    }

    /**
     * Update parcial resource
     * @param application 
     */
    partialUpdate(application: restify.Server): void {
        application.patch(`${BASE_RESOURCE}/:id`, (req: Request, res: Response, next: Next) => {

            const options = { new: true };

            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(user => {
                    if (user) {
                        res.json(user);
                        return next();
                    } else {
                        res.send(404);
                        return next();
                    }
                });
        });
    }

    /**
     * Remove a resource
     * @param application 
     */
    delete(application: restify.Server): void {
        application.del(`${BASE_RESOURCE}/:id`, (req: Request, res: Response, next: Next) => {
            User.findByIdAndDelete(req.params.id)
                .then(user => {
                    if(user) {
                        res.status(200);
                        res.json(user);
                        return next();
                    } else {
                        res.send(404);
                        return next();
                    }
                })
        })
    }
}

export const usersRoutes = new UserRoutes();