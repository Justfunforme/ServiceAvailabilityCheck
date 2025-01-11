module.exports = {
    whereAmI: function helloWorld() {
        console.log('basicFuncsions.js');
        return;
    }, 
    readFile: async function readFile(filePath) {
        const fs = require('node:fs/promises');
        try {
            var data = await fs.readFile(filePath, 'utf8', (err, data) => {
                if(err) {
                }
            });
        } catch (err) { 
        }
        return data;
    }, 
    sleep: function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    },
    formatDateTime: function formatDateTime(datetime) {        
        let formatedDateTime
        
        var day = datetime.getDate()
        var month = datetime.getMonth() + 1
        var year = datetime.getYear() + 1900
        var hour = datetime.getHours()
        var minute = datetime.getMinutes()
        var second = datetime.getSeconds()

        formatedDateTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second

        return formatedDateTime
    }, 
    isDbEnabled: function isDbEnabled() {
        switch(process.env.ENABLE_DATABASE) {
            case "true":
                return true
            default:
                return false
        }
    }
}