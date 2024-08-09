export default () => ({
  server: {
    port: parseInt(process.env.PORT) || 3001,
  },
  database: {
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME || 'student',
    password: process.env.DB_PASSWORD || 'student',
    name: process.env.DB_NAME || 'kupipodariday',
    synchronize: process.env.DB_SYNCHRONIZE === 'true' ? true : false,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    ttl: process.env.JWT_TTL || '300000s',
  },
});
