const db = require("./db")
const logging = require("../controllers/logging.js");

async function setupDatabase() {
    conn = await db.initPool.getConnection()

    try {
        await conn.query("CREATE DATABASE IF NOT EXISTS " + process.env.MARIADB_DATABASE)
    } catch (err) {
        await logging.log("WARNING", "Error creating database: " + err)
    } finally {
        if (conn) await conn.release()
            db.initPool.end()
    }
}

async function setupAvailabilityTable() {
    conn = await db.pool.getConnection()

    try {
        await conn.query("CREATE TABLE IF NOT EXISTS availability ( \
                        id INT(11) unsigned NOT NULL AUTO_INCREMENT, \
                        route VARCHAR(50) NOT NULL, \
                        datetime DATETIME NOT NULL, \
                        available BOOLEAN NOT NULL, \
                        PRIMARY KEY (id))")
    } catch (err) {
        await logging.log("WARNING", "Error creating table: " + err)
    } finally {
        if (conn) await conn.release();
    }
}

module.exports = {
    setup: async function setup() {
        await logging.log("INFO", "Creating database if it does not exist yet!")
        await setupDatabase()
        await logging.log("INFO", "Creating tables if it they do not exist yet!")
        await setupAvailabilityTable()
    }
}