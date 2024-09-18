const basicFunctions = require('./basicFunctions.js');
const util = require('util');
const exec = util.promisify(require("child_process").exec);

const regexIp = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/

async function getRouteNotFoundPage() {
    return await basicFunctions.readFile(process.env.ROUTENOTFOUND);
};

function valueToArray(name, value) {
    return element = {
        name: name,
        value: value
    }
}

function valueToArrayMeasurement(value, unit) {
    return element = {
        value: value,
        unit: unit
    }
}

async function getPingTimes(searchString) {
    var arrayOfLines = searchString.split(/\r?\n/);

    var IP = 0;
    var duration = 0;
    var pingDuration = 0; 
    var pingTimes = [];
    var averagePing = 0;
    for(i = 0; i < arrayOfLines.length; i++) {
        //Get IP Address
        if(arrayOfLines[i].match(regexIp) != null) {
            IP = arrayOfLines[i].match(regexIp)[0];
        }

        //Get PingTime
        if(arrayOfLines[i].split('time=').length > 1) {
            var pingTime = arrayOfLines[i].split('time=')[1].split(' ')
            pingTimes.push(valueToArrayMeasurement(pingTime[0], pingTime[1]))
        }

        //Get duration
        if(arrayOfLines[i].split('time ').length > 1) {
            duration = arrayOfLines[i].split('time ')[1]
            pingDuration = valueToArrayMeasurement(duration.split('ms')[0], duration.substr(duration.length - 2))
        }
    }

    //Get average Ping Time
    var sumOfPingTime = 0;
    for(let value in pingTimes) {
        sumOfPingTime += parseFloat(pingTimes[value].value)
    }
    averagePing = sumOfPingTime / pingTimes.length

    pingStatistics = [];
    pingStatistics.push(valueToArray('averagePing', averagePing || ''))
    pingStatistics.push(valueToArray('IP', IP || ''))
    pingStatistics.push(valueToArray('pingTimes', pingTimes || ''))
    pingStatistics.push(valueToArray('pingDuration', pingDuration || ''))

    return pingStatistics
};

async function pingService(serviceUrl) {
    const pingCmd = 'ping -c ' + (process.env.PINGCOUNT || 1) + ' ' + serviceUrl

    var Status = false;

    var serviceStatus = {};
    serviceStatus['Available'] = Status
    serviceStatus['Messages'] = [];
    serviceStatus['Statistics'] = [];

    serviceStatus['Statistics'].push(valueToArray('URL', serviceUrl))
    serviceStatus['Statistics'].push(valueToArray('pingCount', process.env.PINGCOUNT || 1))

    try {
        const { stdout, stderr } = await exec(pingCmd);
        if (!stderr) {
            Status = true;
        }
        if(stderr) {
            serviceStatus['Messages'].push(valueToArray('error', stderr));
        }
        if(stdout) {
            serviceStatus['Messages'].push(valueToArray('ping', stdout));
        }
    } catch (err) {
        if(err.stderr) {
            serviceStatus['Messages'].push(valueToArray('error', err.stderr));
        }
        if(err.stdout) {
            serviceStatus['Messages'].push(valueToArray('info', err.stdout));
        }
    }
    serviceStatus['Available'] = Status

    var searchString = getMessageFromMessagesArrayAsString(serviceStatus.Messages, 'ping') || getMessageFromMessagesArrayAsString(serviceStatus.Messages, 'info')
    var pingStatistics = await getPingTimes(searchString || '');

    for(i = 0; i < pingStatistics.length; i++) {
        serviceStatus['Statistics'].push(valueToArray(pingStatistics[i].name, pingStatistics[i].value));
    }

    return serviceStatus
}; 

function getMessageFromMessagesArrayAsString(Obj, searchTerm) {
    for(var i = 0; i < Obj.length; i++) {
        if(Obj[i].name == searchTerm) {
            return Obj[i].value
        }
    }
};

module.exports = {
    whereAmI: function helloWorld() {
        console.log('healthCHeckFunctions.js');
        return;
    }, 
    performHealthCheck: async function performHealthCheck(serviceRoute) {
        const allServices = JSON.parse(await basicFunctions.readFile(process.env.ALLHEALTHCHECKROUTES));
        
        for (let service of allServices.services) {
            if(service.route == serviceRoute) {
                return await pingService(service.ping)
            }
        }
        return await getRouteNotFoundPage()
    },
    performHealthCheckAll: async function performHealthCheckAll() {
        const allServices = JSON.parse(await basicFunctions.readFile(process.env.ALLHEALTHCHECKROUTES));
        var healthCheckAll = [];
        var healthCheck;

        for (let service of allServices.services) {
            healthCheck = {
                name: service.name,
                data: await pingService(service.ping)
            }
            healthCheckAll.push(healthCheck)
        }

        return healthCheckAll
    }
}