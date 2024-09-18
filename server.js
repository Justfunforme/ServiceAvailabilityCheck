const basicFunctions = require('./controllers/basicFunctions.js')
startUp();

async function getDefaultPage() {
    return await basicFunctions.readFile(process.env.DEFAULTPAGE);
};

async function startUp() {
    console.log('Starting Service...');
    const express = require('express');
    const app = express();

    //Loading Routes:
    console.log('Loading Routes...');
    app.get('/', async function(req, res) {
        res.send(await getDefaultPage());
    });

    //Routes: 
    const healthCheckRoutes = require('./routes/healthcheck.js');

    app.use('/healthcheck', healthCheckRoutes)

    console.log('Starting Server...');
    //StartUp: 
    const port = process.env.PORT || 3000
    app.listen(port, () => {
        console.log('Server is running on port ' + port)
    });
}

