const { exec } = require('child_process');

const express = require('express')
const app = express()
const port = 3000;
var AdmZip = require('adm-zip');
const { CloudFunctionsServiceClient } = require('@google-cloud/functions');


app.get('/testAuth', async (req, res) => {

  // Imports the Google Cloud client library.
  const { Storage } = require('@google-cloud/storage');

  // Instantiates a client. If you don't specify credentials when constructing
  // the client, the client library will look for credentials in the
  // environment.
  const storage = new Storage();
  // Makes an authenticated API request.
  async function listBuckets() {
    try {
      const results = await storage.getBuckets();

      const [buckets] = results;

      console.log('Buckets:');
      buckets.forEach(bucket => {
        console.log(bucket.name);
      });
    } catch (err) {
      console.error('ERROR:', err);
      res.send(`NOT authenticated :( :( :( <br><br>
        export GOOGLE_APPLICATION_CREDENTIALS="/Users/marcusgallegos/Senior Design-18c4109462fd.json"`)

    }
  }
  await listBuckets();
  res.send("you're authenticated !!!")
})

app.get('/generate', (req, res) => {


  exec('java -jar openapi-generator-cli.jar generate \
  -i petstore.yaml \
  -g nodejs-express-server \
  -o output/petsore', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  })

  try {
    // creating archives
    var zip = new AdmZip();
    zip.addLocalFolder('output/petsore');
    // or write everything to disk
    zip.writeZip("tmp/output.zip");
  } catch (error) {
    console.error(error)
  }


  res.sendFile('/tmp/output.zip')



});

app.get('/', (req, res) => {

  res.send('API Generator Running....')



});


app.get('/list', async (req, res) => {


  try {
    // Imports the Google Cloud client library

    // remove this line after package is released
    // eslint-disable-next-line node/no-missing-require
    const { CloudFunctionsServiceClient } = require('@google-cloud/functions');

    // TODO(developer): replace with your prefered project ID.
    const projectId = 'senior-design-293721'

    // Creates a client
    const client = new CloudFunctionsServiceClient();
    const project = 'projects/senior-design-293721/locations/us-central1'; // Get the functions for a project.
    const page_size = 100; //Max number of functions to return per call
    const page_token = 'token';
    // const project = 'senior-design-293721/*/locations/*'; // Get the functions for a project.


    const [functions] = await client.listFunctions({
      parent: project,
      pageSize: page_size,
      pageToken: page_token,
    });
    console.info('functions: ', functions);

    // create cloud function

    // client.createFunction({
    //   name: 'newFunction',
    //   so

    // })

    // export GOOGLE_APPLICATION_CREDENTIALS="/Users/marcusgallegos/Senior Design-18c4109462fd.json"   

    res.send('Sucessfully Listed Functions, check your console!');


  } catch (error) {
    console.log('error: ', error)
    res.send(error);

  }

});

app.get('/generateUploadUrl', async (req, res) => {
  const { CloudFunctionsServiceClient } = require('@google-cloud/functions');

  const client = new CloudFunctionsServiceClient();

  let request = {
    parent: 'projects/senior-design-293721/locations/us-central1'
  }

  const [response] = await client.generateUploadUrl(request);

  console.log('response', response.uploadUrl)
  // res.send(response)

  var axios = require('axios');
  var FormData = require('form-data');
  var fs = require('fs');
  var data = new FormData();
  data.append('File', fs.createReadStream('/Users/marcusgallegos/Downloads/function-source (1).zip'));

  var config = {
    method: 'put',
    url: response.uploadUrl,
    headers: {
      ...data.getHeaders(),
      'content-type': 'application/zip',
      'x-goog-content-length-range': '0,104857600',
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      res.send(response)
    })
    .catch(function (error) {
      // console.log(error);
      res.send(error)
    });


});




app.get('/upload', async (req, res) => {
  const location = 'projects/senior-design-293721/locations/us-central1';


  try {

    const client = new CloudFunctionsServiceClient();
    let myFunction = {
      "name": "projects/senior-design-293721/locations/us-central1/functions/firstDeployed",
      "sourceUploadUrl": "https://storage.googleapis.com/gcf-upload-us-central1-06164526-5e4b-41ba-98e5-7c2d9a3e7260/4320182d-ea72-4c4a-bfb3-06ecd70ba4b5.zip?GoogleAccessId=service-824226399055@gcf-admin-robot.iam.gserviceaccount.com&Expires=1606527088&Signature=SO%2BSMHRh1iIzyhqQdP4ZA5X4jK5GzAwAVP5ZU%2BaIN1C20Fj3DpwXWY%2BsvVxgQe1m3JlhKu0egfC2mhueUL1j%2BkobjqLRdikg7A6daU0f0tJEUiP6wSZPbmm6zv2Rv9mJXC4inwbR3WwomUHbo%2ByXNJ9F7mHzFDSetJ9rJ5pvkCRbzkPJ%2FLDMgipMz7m7JxDxkQCb8l2l1bkef6zEsoS3DPgTrxKhwuW614ztDzuwenpXeTI295Yo9KusZMvj8juEBfyXszMe3SVFfGRVEOcC8SyQcpkBOtLoU01a1s2oOu5Jr1S%2BpamClKwmIWkfa1NdFVAAGG%2BloP4mhoRP85Ae3g%3D%3D",
      "description": "test",
      "maxInstances": 1000,
      "timeout": "300s",
      "entryPoint": "",
      "httpsTrigger": {},
      "labels": {},
      "network": "",
      "runtime": "nodejs10",
      "serviceAccountEmail": "",
      "vpcConnector": ""
    }



    let request = {
      location: location,
      function: myFunction

    }
    const [operation] = await client.createFunction(request);
    const [response] = await operation.promise();

    res.send('Sucessfully Uploaded', response);


  } catch (error) {
    console.log('error: ', error)
    res.send(error);

  }

});

// end routes
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})