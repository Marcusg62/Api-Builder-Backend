const { exec } = require('child_process');

const express = require('express')
const app = express()
const port = 4000;
var AdmZip = require('adm-zip');
const db = require('./config');
const { generateFunctionalities } = require('./features/firebase-crud')
const fs = require('fs');

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
  let errorStep = '0'

  try {


    let api = (await db.doc('api/simplePetStore2').get()).data().swaggerDoc

    // make sure it's easy to read in doc
    api = JSON.stringify(JSON.parse(api), null, 4);
    fs.writeFileSync('petStoreApi.json', api);
    console.log('wrote file')

  } catch (error) {
    console.log('error: ', error)
    res.send(error)
  }

  try {
    console.log('generating...')
    //   console.log('step', errorStep)
    await exec('java -jar openapi-generator-cli.jar generate \
    -i petStoreApi.json \
    -g nodejs-express-server \
    -o tmp/petstore', (error, stdout, stderr) => {
      // console.log(`stdout: ${stdout}`);
      // console.error(`stderr: ${stderr}`);

      //     errorStep = '1'
      //     console.log('step', errorStep)

      console.log('errur?', stderr)

      // START CODE GEN

      console.log('generated...')

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


module.exports = {
  app
};


// /Users/marcusgallegos/api-builder-71719-7bf68aea3f5b.json