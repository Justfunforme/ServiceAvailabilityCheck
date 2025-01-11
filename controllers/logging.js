const fs = require('node:fs/promises')

const logFileLocation = "logs/"
const logFilePrefix = "logs_"

const minLogLevel =  getLogLevel(process.env.MIN_LOG_LEVEL)
function getLogLevel(logLevel) {
    switch(logLevel) {
        case "ERROR":
            return 2
        case "WARNING":
            return 1
        default: 
            return 0
    }
}

async function writeLogFile(level, message) {
    if (getLogLevel(level) < minLogLevel) {
        return
    }

    let logFileDate = new Date()
    let logFileName = logFilePrefix + logFileDate.toISOString().split('T')[0]
    let logFilePath = logFileLocation + logFileName + ".log"

    let newLogEntry = "[" + level + "] " + logFileDate.toLocaleString(process.env.LOG_LOCALE) + ": " + message + "\n"

    fs.appendFile(logFilePath, newLogEntry, 'utf-8', (err) => {
        if(err) {
            throw new Error("Exiting program. Error writing log file!")
        }
    })
}

module.exports = {
    log: async function log(level, message) {
        await writeLogFile(level, message)
    }
}