const basicFunctions = require('./controllers/basicFunctions.js')
const logging = require("./controllers/logging.js");
const databaseSetup = require("./database/setup.js");

startUp()

async function getDefaultPage() {
    return await basicFunctions.readFile(process.env.DEFAULTPAGE);
};

async function startUp() {
    logging.log("INFO", "Starting up!")
    
    databaseSetup.setup()

    const express = require('express');
    const app = express();

    //Loading Routes:
    app.get('/', async function(req, res) {
        res.send(await getDefaultPage());
    });

    //Routes: 
    const healthCheckRoutes = require('./routes/healthcheck.js');
    const statisticRoutes = require('./routes/statistics.js');

    app.use('/healthcheck', healthCheckRoutes)
    app.use('/statistics', statisticRoutes)

    //StartUp: 
    const port = process.env.PORT || 80
    app.listen(port, () => {
        logging.log("INFO", 'Server is running on port ' + port)
    });
}

