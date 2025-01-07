const db = require("./db")
const logging = require("../controllers/logging.js");
const basicFunctions = require("../controllers/basicFunctions.js");

async function insertValue(route, isAvailable) {    
    conn = await db.pool.getConnection()    
    const datetime = new Date()

    try {
        await conn.query("INSERT INTO " + process.env.MARIADB_DATABASE + ".availability (route, datetime, available) VALUES ('" + route + "', '" + basicFunctions.formatDateTime(datetime) + "', " + isAvailable + ")")
    } catch (err) {
        await logging.log("WARNING", "Error inserting value: " + err)
    } finally {
        if (conn) await conn.release();
    }
}

async function getValuesByRoute(route) {
    conn = await db.pool.getConnection()    

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
        await insertValue(route, isAvailable)
    },

    getValues: async function getValues(route) {
        let stat
        await getValuesByRoute(route).then((res) => stat = res)
        return stat
    },
}