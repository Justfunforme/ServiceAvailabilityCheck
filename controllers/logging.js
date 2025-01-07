const fs = require('node:fs/promises')
const basicFunctions = require('../controllers/basicFunctions.js');

async function writeLogFile(level, message) {
    let logFileDate = new Date()
    let logFileName = "logs_" + logFileDate.toISOString().split('T')[0]
    let logFilePath = "logs/" + logFileName + ".log"

    let newLogEntry = "[" + level + "] " + logFileDate.toLocaleString(process.env.LOG_LOCALE) + ": " + message + "\n"

    let existingLogFile = null

    await readLogFile(logFilePath).then((res) => {
        existingLogFile = res
    })
    
    if(existingLogFile == undefined) {
        newLogFile = newLogEntry
    } else {
        newLogFile = newLogEntry + existingLogFile
    }

    try {
        newContent = "Test1234"
        await fs.writeFile(logFilePath, newLogFile)
    } catch (err) {

    }
}

async function readLogFile(logFileName) {
    return await basicFunctions.readFile(logFileName)
}

module.exports = {
    log: function log(level, message) {
        writeLogFile(level, message)
    }
}