import restify from 'restify';

// Server create
const server = restify.createServer({
    name: "meat-api",
    version: "1.0.0"
});

// Register a route
server.get('/hello', (req, res, next) => {
    res.json({message: 'hello'});
    return next();
});

// Server listen port
server.listen(3000, () => {
    console.log('API is running on http://localhost:3000');
});