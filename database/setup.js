const db = require("./db")
const basicFunctions = require('../controllers/basicFunctions.js')
const logging = require("../controllers/logging.js");

async function setupDatabase() {
    try {
        conn = await db.initPool.getConnection()
    } catch (err) {
        await logging.log("ERROR", "Error connecting to database: " + err)
        await basicFunctions.sleep(500)
        throw new Error("Exiting program. See log files for details!")
    }
    
    try {
        await logging.log("INFO", "Creating database if it does not exist yet...")
        await conn.query("CREATE DATABASE IF NOT EXISTS " + process.env.MARIADB_DATABASE)
    } catch (err) {
        await logging.log("ERROR", "Error creating database: " + err)
    } finally {
        if (conn) await conn.release()
            db.initPool.end()
        await logging.log("INFO", "Successfully connected to database!")
    }
}

async function setupAvailabilityTable() {
    try {
        conn = await db.pool.getConnection()
    } catch (err) {
        await logging.log("ERROR", "Error connecting to database: " + err)
        await basicFunctions.sleep(500)
        throw new Error("Exiting program. See log files for details!")
    }
    
    try {
        await logging.log("INFO", "Creating tables if they do not exist yet...")
        await conn.query("CREATE TABLE IF NOT EXISTS availability ( \
                        id INT(11) unsigned NOT NULL AUTO_INCREMENT, \
                        route VARCHAR(50) NOT NULL, \
                        datetime DATETIME NOT NULL, \
                        available BOOLEAN NOT NULL, \
                        PRIMARY KEY (id))")
    } catch (err) {
        await logging.log("ERROR", "Error creating table: " + err)
    } finally {
        if (conn) await conn.release();
        await logging.log("INFO", "Successfully connected to database!")
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