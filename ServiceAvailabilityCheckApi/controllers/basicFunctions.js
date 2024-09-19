module.exports = {
    whereAmI: function helloWorld() {
        console.log('basicFuncsions.js');
        return;
    }, 
    readFile: async function readFile(filePath) {
        const fs = require('node:fs/promises');
        var data = await fs.readFile(filePath, 'utf8', (err, data) => {
            if(err) {
                console.error(err);
                return;
            }
        });
        return data;
    }
}