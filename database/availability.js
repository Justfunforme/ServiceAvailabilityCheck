const db = require("./db")
const logging = require("../controllers/logging.js");
const basicFunctions = require("../controllers/basicFunctions.js");

async function insertValue(route, isAvailable) {    
    try {
        conn = await db.pool.getConnection()
    } catch (err) {
        await logging.log("ERROR", "Error connecting to database (" + process.env.MARIADB_URL + ":" + process.env.DBPORT + "): " + err)
        await basicFunctions.sleep(500)
        throw new Error("Exiting program. See log files for details!")
    }

    const datetime = new Date()

    try {
        await logging.log("INFO", "Inserting new value...")
        await conn.query("INSERT INTO " + process.env.MARIADB_DATABASE + ".availability (route, datetime, available) VALUES ('" + route + "', '" + basicFunctions.formatDateTime(datetime) + "', " + isAvailable + ")")
    } catch (err) {
        await logging.log("WARNING", "Error inserting value: " + err)
    } finally {
        if (conn) await conn.release();
    }
}

async function getValuesByRoute(route) {
    try {
        conn = await db.pool.getConnection()
    } catch (err) {
        await logging.log("ERROR", "Error connecting to database (" + process.env.MARIADB_URL + ":" + process.env.DBPORT + "): " + err)
        await basicFunctions.sleep(500)
        throw new Error("Exiting program. See log files for details!")
    }

    try {
        var result = await conn.query("SELECT \
	        DATE_FORMAT(datetime, '%y-%m-%d %h') AS 'date' \
	        , AVG(available) AS 'available' \
            FROM healthcheck.availability a \
            WHERE route = '" + route + "' \
            GROUP BY DATE_FORMAT(datetime, '%y-%m-%d %h') LIMIT 24")
    } catch (err) {
        await logging.log("WARNING", "Error inserting value: " + err)
    } finally {
        if (conn) await conn.release();
    }
    return result
}

module.exports = {
    saveValue: async function saveValue(route, isAvailable) {
        if (basicFunctions.isDbEnabled() === false) {
            logging.log("INFO", "Storing values in database is not enabled!")
            return 
        }
        await insertValue(route, isAvailable)
    },

    getValues: async function getValues(route) {
        if (basicFunctions.isDbEnabled() === false) {
            logging.log("INFO", "Storing values in database is not enabled!")
            return 
        }
        let stat
        await getValuesByRoute(route).then((res) => stat = res)
        return stat
    },
}