var sypht = require("../lib/client");
const fs = require('fs');

const GENERIC = 'sypht.generic', DOCUMENT =  'sypht.document', INVOICE =  'sypht.invoice',BILL = 'sypht.bill', BANK = 'sypht.bank';

async function main () {
    var data = await sypht.fileUpload([INVOICE, DOCUMENT], fs.createReadStream('./sample_invoice.pdf'), 'sample_invoice.pdf');
    data = await sypht.fetchResults(data['fileId']);
    var data = await sypht.fetchResults('d03d0c19-2cb9-4791-a520-afbcd7003967');
    console.log(JSON.stringify(data, null, 2));
} 

main();
