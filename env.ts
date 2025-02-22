export default {
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "123456",
    name: process.env.DB_NAME || "project_3",
    dialect: process.env.DB_DIALECT || "mysql",
    max: Number(process.env.DB_POOL_MAX) || 5,
    min: Number(process.env.DB_POOL_MIN) || 0,
    acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
    idle: Number(process.env.DB_POOL_IDLE) || 10000,
    logging: process.env.DB_LOGGING === "true",
    isSync: process.env.DB_SYNC === "false",
  },
  bcrypt: {
    saltRounds: Number(process.env.SALT_ROUNDS) || 10,
  },
  auth: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    },
  },
};
