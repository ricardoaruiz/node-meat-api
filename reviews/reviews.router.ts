import { Server, Request, Response, Next } from 'restify';
import Route from "../common/route";
import reviewService from './reviews.service';

class ReviewRoutes extends Route {

    private static readonly BASE_RESOURCE = '/reviews';

    applyRoutes(application: Server): void {
        this.find(application);
        this.load(application);
        this.create(application);
    }

    private find(application: Server): void {

        const process = (request: Request, response: Response, next: Next) => {
            reviewService.find(request.query, request.query.complete)
                .then(this.renderAll(response, next))
                .catch(next);
            };

        application.get(ReviewRoutes.BASE_RESOURCE, process);
    }

    private load(application: Server): void {

        const process = (request: Request, response: Response, next: Next) => {
            reviewService.load(request.params.id)
                .then(this.render(response, next))
                .catch(next);
        };

        application.get(`${ReviewRoutes.BASE_RESOURCE}/:id`, [this.validateId, process]);
    }

    private create(application: Server): void {
        
        const process = (request: Request, response: Response, next: Next) => {
            reviewService.create(request.body)
                .then(this.render(response, next))
                .catch(next);
        };

        application.post(ReviewRoutes.BASE_RESOURCE, process);        
    }

}

export default new ReviewRoutes();