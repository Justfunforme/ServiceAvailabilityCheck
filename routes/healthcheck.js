const express = require('express');
const router = express.Router();

const basicFunctions = require('../controllers/basicFunctions.js');
const healthCheckFunctions = require('../controllers/healthCheckFunctions.js');

async function getServices() {
    return JSON.parse(await basicFunctions.readFile(process.env.SERVICES));
};

router.get('/', async function(req, res) {
    res.send(await getServices());
});

router.get('/service/:service', async function(req, res){
    const service = req.params.service
    res.send(await healthCheckFunctions.performHealthCheck(service));
});

router.get('/all', async function(req, res) {
    res.send(await healthCheckFunctions.performHealthCheckAll());
});

module.exports = router;