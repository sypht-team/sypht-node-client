# Sypht Nodejs Client
This repository is a Nodejs reference client implementation for working with the Sypht API at https://api.sypht.com.

## About Sypht
[Sypht](https://sypht.com) is a SaaS [API]((https://docs.sypht.com/)) which extracts key fields from documents. For 
example, you can upload an image or pdf of a bill or invoice and extract the amount due, due date, invoice number 
and biller information. 

### Getting started
To get started you'll need API credentials, i.e. a `client_id` and `client_secret`, which can be obtained by registering
for an [account](https://www.sypht.com/signup/developer)

### Prerequisites
* Node.js version 8+.

### Installation
WIP

### Usage
Populate system environment variable with the credentials generated above:

```Bash
SYPHT_API_KEY="$client_id:$client_secret"
```

then invoke the client with a file of your choice:
```javascript
var sypht = require('sypht-node-client');

async function main () {
    var data = await sypht.fileUpload(['sypht.invoice', 'sypht.document'], fs.createReadStream('./sample_invoice.pdf'), 'sample_invoice.pdf');
    data = await sypht.fetchResults(data['fileId']);
    console.log(JSON.stringify(data, null, 2));
} 

```