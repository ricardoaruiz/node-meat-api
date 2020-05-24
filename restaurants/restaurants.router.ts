import { Server, Request, Response, Next } from 'restify';
import Route from "../common/route";
import restaurantService from './restaurants.service';

class RestaurantsRoutes extends Route {

    private static readonly BASE_RESOURCE = '/restaurants';
    private static readonly MENU_RESOURCE = `${RestaurantsRoutes.BASE_RESOURCE}/:id/menu`;

    applyRoutes(application: Server): void {
        this.find(application);
        this.load(application);
        this.create(application);
        this.replace(application);
        this.update(application);
        this.delete(application);

        this.findMenu(application);
        this.replaceMenu(application);
    }

    private find(application: Server): void {

        const process = (request: Request, response: Response, next: Next) => {
            restaurantService.find(request.query, request.query.showMenu)
                .then(this.renderAll(response, next))
                .catch(next);
        };

        application.get(RestaurantsRoutes.BASE_RESOURCE, process);
    }

    private load(application: Server): void {

        const process = (request: Request, response: Response, next: Next) => {
            restaurantService.load(request.params.id)
                .then(this.render(response, next))
                .catch(next);
        };

        application.get(`${RestaurantsRoutes.BASE_RESOURCE}/:id`, [this.validateId, process]
        );
    }

    private create(application: Server): void {

        const process = (request: Request, response: Response, next: Next) => {
            restaurantService.create(request.body)
                .then(this.render(response, next))
                .catch(next);
        };

        application.post(RestaurantsRoutes.BASE_RESOURCE, process);
    }

    private replace(application: Server): void {

        const process = (request: Request, response: Response, next: Next) => {
            restaurantService.update(request.params.id, request.body)
                .then(this.render(response, next))
                .catch(next);
        };

        application.put(`${RestaurantsRoutes.BASE_RESOURCE}/:id`, [this.validateId, process]);
    }

    private update(application: Server): void {

        const process = (request: Request, response: Response, next: Next) => {
            restaurantService.update(request.params.id, request.body, false)
                .then(this.render(response, next))
                .catch(next);
        }; 

        application.patch(`${RestaurantsRoutes.BASE_RESOURCE}/:id`, [ this.validateId, process ]);
    }

    private delete(application: Server): void {

        const process = (request: Request, response: Response, next: Next) => {
            restaurantService.delete(request.params.id)
                .then(this.render(response, next))
                .catch(next);
        }; 

        application.del(`${RestaurantsRoutes.BASE_RESOURCE}/:id`, [this.validateId, process]);
    }

    private findMenu(application: Server): void {

        const process = (request: Request, response: Response, next: Next) => {
            restaurantService.loadMenu(request.params.id)
                .then(this.render(response, next))
                .catch(next);
        };

        application.get(RestaurantsRoutes.MENU_RESOURCE, [this.validateId, process])
    }

    private replaceMenu(application: Server): void {

        const process = (request: Request, response: Response, next: Next) => {
            restaurantService.updateMenu(request.params.id, request.body)
                .then(this.render(response, next))
                .catch(next);
        }; 

        application.put(RestaurantsRoutes.MENU_RESOURCE, [this.validateId, process])
    }

}

export default new RestaurantsRoutes();