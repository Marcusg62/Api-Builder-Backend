const { exec } = require('child_process');

const express = require('express')
const app = express()
const port = 3000;
var AdmZip = require('adm-zip');


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


app.get('/upload', async (req, res) => {


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

    res.send('Sucessfully Uploaded');


  } catch (error) {
    console.log('error: ', error)
    res.send(error);

  }




});

// end routes
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})