const readChunk = require('read-chunk');
const fileType = require('file-type');

var utils = {
    validateFileType : async function (filePath) {
        let supportedTypes = ['application/pdf', 'image/tiff', 'image/jpeg', 'image/png', 'image/gif'];
        try{
            const buffer = readChunk.sync(filePath, 0, fileType.minimumBytes);
            for (let tp of supportedTypes) {
                if (fileType(buffer) !== undefined && fileType(buffer).mime === tp) {
                    return true;
                }
            } 
            return false;
        }catch(error){
            console.log(error);
            throw error;
        }
        return false;
    },
    processAPIKey : function (apiKey) {
        try {
            var arr = apiKey.split(':');
            if (arr.length != 2) {
                throw new Error('invalid apikey : ' + apiKey);
            }
            return arr
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = utils;
