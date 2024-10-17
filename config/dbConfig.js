module.exports = {
  dbConfig: {
    user: "postgres",
    host: "localhost",
    database: "test",
    password: "postgres",
    port: 5432,
    ssl: false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxUses: 7500,
  },
};
