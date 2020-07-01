var sypht = require('../../sypht-node-client');

const GENERIC = 'sypht.generic', DOCUMENT =  'sypht.document', INVOICE =  'sypht.invoice',BILL = 'sypht.bill', BANK = 'sypht.bank';

async function main () {
    var data = await sypht.fileUpload(['sypht.invoice', 'sypht.document'], './sample_invoice.pdf');
    data = await sypht.fetchResults(data['fileId']);
    return JSON.stringify(data, null, 2);
} 

main().then(
    data => console.log(data)
)
.catch(
    e => console.log(e)
);