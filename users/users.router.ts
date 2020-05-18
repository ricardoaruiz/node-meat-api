import restify, { Request, Response, Next } from 'restify';

import Route from '../common/route';
import UserService from './user.service';

const BASE_RESOURCE = "/users";

class UserRoutes extends Route {  
    
    userService = new UserService();

    constructor() {
        super();

        this.on('beforeRender', document => {
            document.password = undefined;
        })
    }

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
            this.userService.find()
                .then(this.render(res, next));
        });
    }

    /**
     * Load a user by id
     * @param application 
     */
    load(application: restify.Server): void {
        application.get(`${BASE_RESOURCE}/:id`, (req: Request, res: Response, next: Next) => {
            this.userService.findById(req.params.id)
                .then(this.render(res, next));
        });
    }

    /**
     * Create new user
     * @param application 
     */
    create(application: restify.Server): void {
        application.post(BASE_RESOURCE, (req: Request, res: Response, next: Next) => {
            this.userService.create(req.body)
                .then(this.render(res, next));

        });
    }

    /**
     * Update full resource
     * @param application 
     */
    update(application: restify.Server): void {
        application.put(`${BASE_RESOURCE}/:id`, (req: Request, res: Response, next: Next) => {
            this.userService.update(req.params.id, req.body)
                .then(result => {
                    if(result.n) {
                        return this.userService.findById(req.params.id);
                    } else {
                        res.send(404);
                    }
                })            
                .then(this.render(res, next));
        });
    }

    /**
     * Update parcial resource
     * @param application 
     */
    partialUpdate(application: restify.Server): void {
        application.patch(`${BASE_RESOURCE}/:id`, (req: Request, res: Response, next: Next) => {
            this.userService.partialUpdate(req.params.id, req.body)
                .then(this.render(res, next));
        });
    }

    /**
     * Remove a resource
     * @param application 
     */
    delete(application: restify.Server): void {
        application.del(`${BASE_RESOURCE}/:id`, (req: Request, res: Response, next: Next) => {
            this.userService.delete(req.params.id)
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