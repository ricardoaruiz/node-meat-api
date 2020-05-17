import restify from 'restify';

// Server create
const server = restify.createServer({
    name: "meat-api",
    version: "1.0.0"
});

// Config query params parser
server.use(restify.plugins.queryParser());

// Register a route
server.get('/info', (req, res, next) => {
    res.json({
        browser: req.userAgent(),
        method: req.method,
        url: req.url,
        path: req.path(),
        query: req.query,
    });
    return next();
});

// Server listen port
server.listen(3000, () => {
    console.log('API is running on http://localhost:3000');
});