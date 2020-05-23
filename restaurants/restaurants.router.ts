import { Server, Request, Response, Next } from 'restify';
import Route from "../common/route";
import restaurantService from './restaurants.service';

class RestaurantsRoutes extends Route {

    private static readonly BASE_RESOURCE = '/restaurants';

    applyRoutes(application: Server): void {
        this.find(application);
        this.load(application);
        this.create(application);
        this.replace(application);
        this.update(application);
        this.delete(application);
    }

    private find(application: Server): void {
        application.get(RestaurantsRoutes.BASE_RESOURCE, (request: Request, response: Response, next: Next) => {
            restaurantService.find(request.query)
                .then(this.renderAll(response, next))
                .catch(next);
        });
    }

    private load(application: Server): void {
        application.get(`${RestaurantsRoutes.BASE_RESOURCE}/:id`, 
            [
                this.validateId,
                (request: Request, response: Response, next: Next) => {
                    restaurantService.load(request.params.id)
                        .then(this.render(response, next))
                        .catch(next);
                }
            ]
        );
    }

    private create(application: Server): void {
        application.post(RestaurantsRoutes.BASE_RESOURCE, (request: Request, response: Response, next: Next) => {
            restaurantService.create(request.body)
                .then(this.render(response, next))
                .catch(next);
        });
    }

    private replace(application: Server): void {
        application.put(`${RestaurantsRoutes.BASE_RESOURCE}/:id`, 
            [
                this.validateId,
                (request: Request, response: Response, next: Next) => {
                restaurantService.update(request.params.id, request.body)
                    .then(this.render(response, next))
                    .catch(next);
                }
            ]
        );
    }

    private update(application: Server): void {
        application.patch(`${RestaurantsRoutes.BASE_RESOURCE}/:id`, 
            [
                this.validateId,
                (request: Request, response: Response, next: Next) => {
                    restaurantService.update(request.params.id, request.body, false)
                        .then(this.render(response, next))
                        .catch(next);
                }
            ]
        );
    }

    private delete(application: Server): void {
        application.del(`${RestaurantsRoutes.BASE_RESOURCE}/:id`, 
            [
                this.validateId,
                (request: Request, response: Response, next: Next) => {
                    restaurantService.delete(request.params.id)
                        .then(this.render(response, next))
                        .catch(next);
                }
            ]
        );
    }

}

export default new RestaurantsRoutes();