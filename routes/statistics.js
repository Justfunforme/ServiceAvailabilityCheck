const express = require('express');
const router = express.Router();

const basicFunctions = require('../controllers/basicFunctions.js');
const statistics = require('../controllers/statistics.js');

router.get('/service/:service', async function(req, res){
    const service = req.params.service
    res.send(await statistics.getStatistics(service));
});

module.exports = router;