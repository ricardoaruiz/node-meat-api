import restify, { Request, Response, Next } from 'restify';
import { NotFoundError } from 'restify-errors';

import Route from '../common/route';
import UserService from './users.service';

const BASE_RESOURCE = "/users";

class UserRoutes extends Route {  
    
    userService = new UserService();

    constructor() {
        super();

        /**
         * Antes de exibir um documento User atribui undefined para o password
         */
        this.on('beforeRender', document => {
            document.password = undefined;
        })
    }

    /**
     * Aplica as rotas na aplicação
     * @param application 
     */
    applyRoutes(application: restify.Server): void {
        this.findAll(application);
        this.load(application);
        this.create(application);
        this.replace(application);
        this.update(application);
        this.delete(application);
    }

    /**
     * List all users
     * @param application 
     */
    findAll(application: restify.Server): void {

        const processFindAll100 = (req: Request, res: Response, next: Next) => {
            this.userService.find()
                .then(this.renderAll(res, next))
                .catch(next);
        };

        const processFindAll200 = (req: Request, res: Response, next: Next) => {
            if(req.query.email) {
                this.userService.find(req.query)
                    .then(this.renderAll(res, next))
                    .catch(next);
            } else {
                next();
            }

        };

        application.get({ path: BASE_RESOURCE, version: '1.0.0'}, processFindAll100);
        application.get({ path: BASE_RESOURCE, version: '2.0.0'}, [processFindAll200, processFindAll100]);
    }

    /**
     * Load a user by id
     * @param application 
     */
    load(application: restify.Server): void {
        application.get(`${BASE_RESOURCE}/:id`, 
        [
            this.validateId,
            (req: Request, res: Response, next: Next) => {
                this.userService.findById(req.params.id)
                    .then(this.render(res, next))
                    .catch(next);
            }
        ]
        );
    }

    /**
     * Create new user
     * @param application 
     */
    create(application: restify.Server): void {
        application.post(BASE_RESOURCE, (req: Request, res: Response, next: Next) => {
            this.userService.create(req.body)
                .then(this.render(res, next))
                .catch(next);

        });
    }

    /**
     * Update full resource
     * @param application 
     */
    replace(application: restify.Server): void {
        application.put(`${BASE_RESOURCE}/:id`, 
            [
                this.validateId,
                (req: Request, res: Response, next: Next) => {
                    this.userService.update(req.params.id, req.body)
                        .then(this.render(res, next))
                        .catch(next);            
                }
            ]
        );
    }

    /**
     * Update parcial resource
     * @param application 
     */
    update(application: restify.Server): void {
        application.patch(`${BASE_RESOURCE}/:id`, 
            [
                this.validateId,
                (req: Request, res: Response, next: Next) => {
                    this.userService.update(req.params.id, req.body, false)
                        .then(this.render(res, next))
                        .catch(next);
                }
            ]
        );
    }

    /**
     * Remove a resource
     * @param application 
     */
    delete(application: restify.Server): void {
        application.del(`${BASE_RESOURCE}/:id`, 
            [
                this.validateId,
                (req: Request, res: Response, next: Next) => {
                    this.userService.delete(req.params.id)
                        .then(user => {
                            if(user) {
                                res.status(200);
                                res.json(user);
                            } else {
                                throw new NotFoundError('Documento não encontrado');
                            }
                            return next();
                        })
                        .catch(next);
                }
            ]
        )
    }
}

export default new UserRoutes();