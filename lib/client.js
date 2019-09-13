const axios = require('axios');
const moment = require('moment');
const FormData = require('form-data');
const utils = require('./utils');
const fs = require('fs');
const path = require('path');

class Sypht{
/** Client for accessing Sypht REST API 
 *
 * @constructor
 * @param {Object} options
 * @param {String} apiKey
 * @param {String} [options.apiHost="https://api.sypht.com"] API hostname
 * @param {String} [options.authHost="https://login.sypht.com"] login endpoint
 * @param {String} [options.authAudience="https://api.sypht.com"] OAuth audience
 * @param {Object} [options.auth] authentication info
 */
    constructor(options){
        var arr = utils.processAPIKey(options.apiKey);
        this.clientId = arr[0];
        this.clientSecret = arr[1];
        this.apiHost = options.apiHost || 'https://api.sypht.com';
        this.authHost = options.authHost || 'https://login.sypht.com';
        this.authAudience = options.authAudience || 'https://api.sypht.com';
        this.auth = {
            expiresAt: 0
        };
    }

    /** Login to Sypht 
     */
    async authenticate(){
        try{
            if(!this.auth.access_token || moment().isAfter(this.auth.expiresAt)) {
                let {data} = await axios.post(`${this.authHost}/oauth/token`, {
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    audience: 'https://api.sypht.com',
                    grant_type: 'client_credentials'
                });
                this.auth = data;
                this.auth.expiresAt = moment().unix() + this.auth.expires_in - (10 * 60);  // token expires after 24 hours - 10 minutes
            }
        }catch(error){
            console.log(error);
            throw error;
        }

    }

    /** upload a file to Sypht for prediction
     * @param {Array} fieldSets list of fieldset 
     * Supported fieldSets : 'sypht.generic', 'sypht.document','sypht.invoice', 'sypht.bill', 'sypht.bank'
     * @param {String} filePath path to the file to upload
     */
    async fileUpload(fieldSets, filePath){
        try{
            await this.authenticate();
            var fileName = path.basename(filePath);
            var fileData = fs.createReadStream(filePath)
            var isValid = await utils.validateFileType(fileName);
            if (!isValid) {
                throw new Error('invalid file : ' + fileName);
            }
            let formData = new FormData();
            formData.append('fileToUpload', fileData, {fileName});
            formData.append('fieldSets', JSON.stringify(fieldSets));

            let {data} = await axios.post(`${this.apiHost}/fileupload`, formData, {
                headers:{
                    'Authorization':`Bearer ${this.auth.access_token}`,
                    'Content-Type': formData.getHeaders()['content-type']
                }
            });
            return data;
        }catch(error){
            console.log(error);
            throw error;
        }

    }

    /** fetches results of uploaded file 
     * @param {String} fileId id of uploaded file
     * @returns prediction results
     */
    async fetchResults(fileId){
        try{
            await this.authenticate();

            let {data} = await axios.get(`${this.apiHost}/result/final/${fileId}`, {
                headers:{
                    'Authorization':`Bearer ${this.auth.access_token}`
                }
            });
            return data;
        }catch(error){
            console.log(error);
            throw error;
        }

    }

    /** retrieves an image copy of the uploaded document. 
     * @param {String} fileId id of uploaded file
     * @param {Number} pageNo page number of the uploaded file to retrieve
     * @returns file data
     */
    async fetchImage(fileId, pageNo){
        try{
            await this.authenticate();

            let {data} = await axios.get(`${this.apiHost}/result/image/${fileId}?page=${pageNo}`, {
                headers:{
                    'Authorization':`Bearer ${this.auth.access_token}`
                }
            });
            return data;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

}

module.exports = new Sypht({apiKey : process.env.SYPHT_API_KEY});
