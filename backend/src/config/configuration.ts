export default () => ({
  server: {
    port: parseInt(process.env.PORT) || 3001,
  },
  database: {
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    host: process.env.POSTGRES_HOST || 'localhost',
    username: process.env.POSTGRES_USER || 'student',
    password: process.env.POSTGRES_PASSWORD || 'student',
    name: process.env.POSTGRES_DB || 'kupipodariday',
    synchronize: process.env.DB_SYNCHRONIZE === 'true' ? true : false,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    ttl: process.env.JWT_TTL || '300000s',
  },
});
