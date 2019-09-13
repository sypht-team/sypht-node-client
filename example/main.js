var sypht = require('sypht-node-client');
const fs = require('fs');

const GENERIC = 'sypht.generic', DOCUMENT =  'sypht.document', INVOICE =  'sypht.invoice',BILL = 'sypht.bill', BANK = 'sypht.bank';

async function main () {
    var data = await sypht.fileUpload(['sypht.invoice', 'sypht.document'], fs.createReadStream('./sample_invoice.pdf'), 'sample_invoice.pdf');
    data = await sypht.fetchResults(data['fileId']);
    console.log(JSON.stringify(data, null, 2));
} 

main();
