const environment = {
    server: { port: process.env.SERVER_PORT || 3000 },
    db: { 
        url: process.env.DB_URL || 'mongodb://rruiz:123456@localhost:27017/meat-api?authSource=admin'
    },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10
    }
}

export default environment;