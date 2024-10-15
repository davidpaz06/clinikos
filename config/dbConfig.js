module.exports = {
  dbConfig: {
    user: "postgres",
    host: "localhost",
    database: "test",
    password: "davidpaz06",
    port: 5432,
    ssl: false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxUses: 7500,
  },

  // dbConfig: {
  //   user: "postgres.meptjduhouhxagaqcmoy",
  //   host: "aws-0-us-west-1.pooler.supabase.com",
  //   database: "postgres",
  //   password: "4uXeeJmu3SkV3gZ6",
  //   port: 6543,
  //   ssl: false,
  //   max: 20,
  //   idleTimeoutMillis: 30000,
  //   connectionTimeoutMillis: 2000,
  //   maxUses: 7500,
  // },
};
