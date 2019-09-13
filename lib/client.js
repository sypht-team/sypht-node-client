const axios = require('axios');
const moment = require('moment');
const FormData = require('form-data');
const utils = require('../lib/utils');

class Sypht{
/** Client for accessing Sypht REST API 
 *
 * @constructor
 * @param {Object} options
 * @param {String} [options.apiHost="https://api.sypht.com"] API hostname
 * @param {String} [options.authHost="https://login.sypht.com"] login endpoint
 * @param {String} [options.authHost="https://api.sypht.com"] OAuth audience
 * @param {Object} [options.auth] 
 */
    constructor(options){
        this.clientId = options.clientId;
        this.clientSecret = options.clientSecret;
        this.apiHost = options.apiHost || 'https://api.sypht.com';
        this.authHost = options.authHost || 'https://login.sypht.com';
        this.authAudience = options.authAudience || 'https://api.sypht.com';
        this.auth = {
            expiresAt: 0
        };
    }

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

    async fileUpload(fieldSets, fileData, filename){
        try{
            await this.authenticate();
            var isValid = await utils.validateFileType(filename);
            if (!isValid) {
                throw new Error('invalid file : ' + filename);
            }
            let formData = new FormData();
            formData.append('fileToUpload', fileData, {filename});
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

module.exports = Sypht;