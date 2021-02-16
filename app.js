const { exec } = require('child_process');

const express = require('express')
const app = express()
const port = 4000;
var AdmZip = require('adm-zip');
const { CloudFunctionsServiceClient } = require('@google-cloud/functions');
const db = require('./config');
const { generateFunctionalities } = require('./features/firebase-crud')

// end routes
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

var cors = require('cors');
app.use(cors())

app.get('/testAuth', async (req, res) => {

  // Imports the Google Cloud client library.

  // Instantiates a client. If you don't specify credentials when constructing
  // the client, the client library will look for credentials in the
  // environment.
  // Makes an authenticated API request.
  try {
    res.send('hello govna')
    // const { Storage } = require('@google-cloud/storage');

    // const storage = new Storage();

    // const results = await storage.getBuckets();

    // const [buckets] = results;

    // console.log('Buckets:');
    // buckets.forEach(bucket => {
    //   console.log(bucket.name);
    // });
    // res.send("you're authenticated !!!")

  } catch (err) {
    console.error('ERROR:', err);
    res.send(error)

  }

})

app.get('/testing', async (req, res) => {

  console.log('testing...')


  const admin = require('firebase-admin');
  var app = admin.initializeApp();

  const db = admin.firestore()

  db.doc('incrementTest/test').create({ number: 1 })

  res.send('done')



})


app.get('/replace', async (req, res) => {


  let s =
    `
  /* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Add a new pet to the store
*
* body Pet Pet object that needs to be added to the store
* no response value expected for this operation
* */
const addPet = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        body,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Deletes a pet
*
* petId Long Pet id to delete
* apiUnderscorekey String  (optional)
* no response value expected for this operation
* */
const deletePet = ({ petId, apiUnderscorekey }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        petId,
        apiUnderscorekey,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Finds Pets by status
* Multiple status values can be provided with comma separated strings
*
* status List Status values that need to be considered for filter
* returns List
* */
const findPetsByStatus = ({ status }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        status,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Finds Pets by tags
* Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
*
* tags List Tags to filter by
* returns List
* */
const findPetsByTags = ({ tags }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        tags,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Find pet by ID
* Returns a single pet
*
* petId Long ID of pet to return
* returns Pet
* */
const getPetById = ({ petId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        petId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Update an existing pet
*
* body Pet Pet object that needs to be added to the store
* no response value expected for this operation
* */
const updatePet = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        body,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Updates a pet in the store with form data
*
* petId Long ID of pet that needs to be updated
* name String Updated name of the pet (optional)
* status String Updated status of the pet (optional)
* no response value expected for this operation
* */
const updatePetWithForm = ({ petId, name, status }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        petId,
        name,
        status,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* uploads an image
*
* petId Long ID of pet to update
* additionalMetadata String Additional data to pass to server (optional)
* file File file to upload (optional)
* returns ApiResponse
* */
const uploadFile = ({ petId, additionalMetadata, file }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        petId,
        additionalMetadata,
        file,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  addPet,
  deletePet,
  findPetsByStatus,
  findPetsByTags,
  getPetById,
  updatePet,
  updatePetWithForm,
  uploadFile,
};

  `

  s = s.replace(/const addPet (.*\s)*?\)\;/, 'hello')

 
  res.send(s)

});

app.get('/generate', async (req, res) => {

  let api = (await db.doc('api/simplePetStore').get()).data()

  var fs = require('fs');
  const yaml = require('js-yaml');

  let data = yaml.load(api.swaggerDoc, { json: true })

  fs.writeFile("petStoreApi.yaml", yaml.dump(data), function (err) {
    if (err) {
      console.log(err);
    }
  });

  let errorStep = '0'

  try {
    //   console.log('step', errorStep)
    await exec('java -jar openapi-generator-cli.jar generate \
    -i petStoreApi.json \
    -g nodejs-express-server \
    -o tmp/petstore', (error, stdout, stderr) => {
      // console.log(`stdout: ${stdout}`);
      // console.error(`stderr: ${stderr}`);

      //     errorStep = '1'
      //     console.log('step', errorStep)



      // START CODE GEN



      const myPackages = `
    
    {
      "name": "swagger-petstore",
      "version": "1.0.0",
      "description": "No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)",
      "main": "index.js",
      "scripts": {
        "prestart": "npm install",
        "start": "node index.js"
      },
      "keywords": [
        "openapi-generator",
        "openapi"
      ],
      "license": "Unlicense",
      "private": true,
      "dependencies": {
        "body-parser": "^1.19.0",
        "camelcase": "^5.3.1",
        "cookie-parser": "^1.4.4",
        "cors": "^2.8.5",
        "express": "^4.16.4",
        "express-openapi-validator": "^3.9.1",
        "firebase-admin": "^9.4.1",
        "js-yaml": "^3.3.0",
        "ono": "^5.0.1",
        "openapi-sampler": "^1.0.0-beta.15",
        "swagger-ui-express": "^4.0.2",
        "winston": "^3.2.1"
      },
      "devDependencies": {
        "axios": "^0.19.0",
        "chai": "^4.2.0",
        "chai-as-promised": "^7.1.1",
        "eslint": "^5.16.0",
        "eslint-config-airbnb-base": "^14.0.0",
        "eslint-plugin-import": "^2.17.2",
        "mocha": "^7.1.1"
      },
      "eslintConfig": {
        "env": {
          "node": true
        }
      }
    }
    
    
    `

      generateFunctionalities()
      fs.writeFileSync('tmp/petstore/package.json', myPackages, 'utf-8');

      // END CODE GEN





      // creating archives
      var zip = new AdmZip();
      zip.addLocalFolder('tmp/petstore');
      // or write everything to disk
      errorStep = '2'
      console.log('step', errorStep)

      zip.writeZip("tmp/output.zip");
      errorStep = '3'
      console.log('step', errorStep)

      let zipFileContents = zip.toBuffer();
      const fileName = 'generate.zip';
      const fileType = 'application/zip';
      res.writeHead(200, {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': fileType,
      })

      errorStep = '4'
      console.log('step', errorStep)
      if (error) {
        res.send(error)

      }
      return res.end(zipFileContents);
    })



  } catch (error) {

    res.send('there was an error: ' + errorStep + ' ' + error)

  }





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

    // export GOOGLE_APPLICATION_CREDENTIALS="/Users/marcusgallegos/Documents/School/Senior Design/apigen-4d56d-firebase-adminsdk-ras28-3399415085.json"   

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
      "name": "projects/senior-design-293721/locations/us-central1/functions/helloWord",
      "sourceUploadUrl": "https://storage.googleapis.com/gcf-upload-us-central1-06164526-5e4b-41ba-98e5-7c2d9a3e7260/4320182d-ea72-4c4a-bfb3-06ecd70ba4b5.zip?GoogleAccessId=service-824226399055@gcf-admin-robot.iam.gserviceaccount.com&Expires=1606527088&Signature=SO%2BSMHRh1iIzyhqQdP4ZA5X4jK5GzAwAVP5ZU%2BaIN1C20Fj3DpwXWY%2BsvVxgQe1m3JlhKu0egfC2mhueUL1j%2BkobjqLRdikg7A6daU0f0tJEUiP6wSZPbmm6zv2Rv9mJXC4inwbR3WwomUHbo%2ByXNJ9F7mHzFDSetJ9rJ5pvkCRbzkPJ%2FLDMgipMz7m7JxDxkQCb8l2l1bkef6zEsoS3DPgTrxKhwuW614ztDzuwenpXeTI295Yo9KusZMvj8juEBfyXszMe3SVFfGRVEOcC8SyQcpkBOtLoU01a1s2oOu5Jr1S%2BpamClKwmIWkfa1NdFVAAGG%2BloP4mhoRP85Ae3g%3D%3D",
      "description": "test",
      "maxInstances": 1000,
      // "timeout": "300s",
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

module.exports = {
  app
};


// /Users/marcusgallegos/api-builder-71719-7bf68aea3f5b.json