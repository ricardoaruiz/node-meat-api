import Server from './server/server';
import Route from './common/route';

// Routes
import { infoRoutes } from './info/info.router';
import { usersRoutes } from './users/users.router';

const routes: Route[] = [infoRoutes, usersRoutes];
const server = new Server(routes);

server.bootstrap()
    .then(server => {
        console.log('Server is listening on: ', 
        (server.application && server.application.address()));
    })
    .catch(error => {
        console.log('Server failed to start');
        console.log(error);
        process.exit(1);
    });