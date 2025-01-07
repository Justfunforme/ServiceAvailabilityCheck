const fs = require('node:fs/promises')
const basicFunctions = require('../controllers/basicFunctions.js');
const availability = require('../database/availability.js');

module.exports = {
    getStatistics: async function getStatistics(route) {
        return await availability.getValues(route)
    }
}