var Sypht = require("../lib/client");
const fs = require('fs');
const utils = require('../lib/utils');

const GENERIC = 'sypht.generic', DOCUMENT =  'sypht.document', INVOICE =  'sypht.invoice',BILL = 'sypht.bill', BANK = 'sypht.bank';

async function main () {
    var arr = utils.processAPIKey(process.env.SYPHT_API_KEY);
    var sypht = new Sypht({
        clientId : arr[0],
        clientSecret : arr[1],
    });
    var data = await sypht.fileUpload([INVOICE, DOCUMENT], fs.createReadStream('./sample_invoice.pdf'), 'sample_invoice.pdf');
    data = await sypht.fetchResults(data['fileId']);
    console.log(JSON.stringify(data, null, 2));
} 

main();
