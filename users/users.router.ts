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

        /**
         * Exemplo para versionamento de endpoints aqui é a versão 1.0.0
         * @param req 
         * @param res 
         * @param next 
         */
        const processFindAll100 = (req: Request, res: Response, next: Next) => {
            this.userService.find()
                .then(this.renderAll(res, next))
                .catch(next);
        };

        /**
         * Exemplo para versionamento de endpoints aqui é a versão 2.0.0
         * @param req 
         * @param res 
         * @param next 
         */
        const processFindAll200 = (req: Request, res: Response, next: Next) => {
            if (req.query.email) {
                this.userService.findByEmail(req.query.email)
                    .then(user => user ? [user]: [])
                    .then(this.renderAll(res, next, false))
                    .catch(next);
            } else {
                next();
            }
        };

        // Versionamento de endpoints controlado pelo header Accept-Version
        // Exemplo de utilização do header na chamada do endpoint
        // Accept-Version = 1.0.0
        // Accept-Version = 2.0.0
        // Accept-Version > 1.0.0
        // Caso não seja passada a versão no header a versão mais recente será escolhida pelo restify (nesse caso a 2.0.0)
        application.get({ path: BASE_RESOURCE, version: '1.0.0'}, processFindAll100);
        application.get({ path: BASE_RESOURCE, version: '2.0.0'}, [processFindAll200, processFindAll100]);
    }

    /**
     * Load a user by id
     * @param application 
     */
    load(application: restify.Server): void {

        const processLoad100 = (req: Request, res: Response, next: Next) => {
            this.userService.findById(req.params.id)
                .then(this.render(res, next))
                .catch(next);
        };

        application.get(`${BASE_RESOURCE}/:id`, [this.validateId, processLoad100]);
    }

    /**
     * Create new user
     * @param application 
     */
    create(application: restify.Server): void {

        const processCreate100 = (req: Request, res: Response, next: Next) => {
            this.userService.create(req.body)
                .then(this.render(res, next))
                .catch(next);

        };

        application.post(BASE_RESOURCE, processCreate100);
    }

    /**
     * Update full resource
     * @param application 
     */
    replace(application: restify.Server): void {

        const processReplace100 = (req: Request, res: Response, next: Next) => {
            this.userService.update(req.params.id, req.body)
                .then(this.render(res, next))
                .catch(next);            
        };

        application.put(`${BASE_RESOURCE}/:id`, [this.validateId, processReplace100]);
    }

    /**
     * Update parcial resource
     * @param application 
     */
    update(application: restify.Server): void {

        const processUpdate100 = (req: Request, res: Response, next: Next) => {
            this.userService.update(req.params.id, req.body, false)
                .then(this.render(res, next))
                .catch(next);
        };

        application.patch(`${BASE_RESOURCE}/:id`, [this.validateId, processUpdate100]);
    }

    /**
     * Remove a resource
     * @param application 
     */
    delete(application: restify.Server): void {

        const processDelete100 = (req: Request, res: Response, next: Next) => {
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
        }; 

        application.del(`${BASE_RESOURCE}/:id`, 
            [
                this.validateId,
                processDelete100
            ]
        )
    }
}

export default new UserRoutes();