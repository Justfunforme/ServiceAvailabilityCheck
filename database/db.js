const mariadb = require('mariadb')

module.exports = {
    pool: mariadb.createPool({
        host: process.env.MARIADB_URL,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DATABASE
    }),

    initPool: mariadb.createPool({
        host: process.env.MARIADB_URL,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
    }),
}