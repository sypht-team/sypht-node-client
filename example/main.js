var sypht = require('../../sypht-node-client');

async function main () {
    var data = await sypht.fileUpload(['invoices'], '../sample_invoice.pdf');
    data = await sypht.fetchResults(data['fileId']);
    return JSON.stringify(data, null, 2);
} 

main().then(
    data => console.log(data)
)
.catch(
    e => console.log(e)
);