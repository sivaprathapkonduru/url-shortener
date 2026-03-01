const configuration = () => ({
    port: Number.parseInt(process.env.PORT || '3000', 10),
    db: {
        host: process.env.DB_HOST,
        port: Number.parseInt(process.env.DB_PORT || '5432', 10),
        mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener',
        redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
            username: process.env.REDIS_USERNAME || 'default',
            password: process.env.REDIS_PASSWORD || 'my-top-secret',
            db: process.env.REDIS_DB ? Number.parseInt(process.env.REDIS_DB, 10) : 0,
        },
    },
});
export default configuration;