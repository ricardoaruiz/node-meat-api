import restify from 'restify';

export default abstract class Route {
    abstract applyRoutes(application: restify.Server): void;
}