const db = require('../config')
const replace = require('replace-in-file');
const { json } = require('express');


// template vars

const code_gen_start = `

  const getPet = () => new Promise(
    async (resolve, reject) => {
      try {
  



    `;


const code_gen_end = `
    
          resolve.successResponse(result, 200)
    
    
        } catch (e) {
    
          reject(e)
        }
      },
    );
  
      `;


module.exports.generateFunctionalities = async function () {
  // get functionalities

  let api = (await db.doc('api/simplePetStore2').get()).data()
  let functionalities = api.functionalities

  console.log('generating functionalities...')

  let paths = JSON.parse(api.swaggerDoc)
58  f
  let route = 

  // get method -> know what query/body params we have

  // for each key of functionalities
  for (const [key, value] of Object.entries(functionalities)) {
    console.log(`${key}: ${value}`);

    let new_code_gen = ``;


    // switch case
    switch (key) {
      case 'firestore-document-get':
        // static or dynamic path
        new_code_gen = `
        let result = (await db.doc('xyz').get()).data()
        `
        break;
      case 'firestore-document-delete':
        // static or dynamic path
        new_code_gen = `
        return await db.doc('a path').delete()

        `
        // returns WriteResult

        break;
      case 'firestore-document-update':
        // static or dynamic path
        new_code_gen = `
        return await db.doc('a path').update(some data)
        `
        // returns WriteResult

        break;
      case 'firestore-collection-get':
        // static or dynamic path
        // static or dynamic query string

        new_code_gen = `
        let result = []
        let data = await (db.collection("pets").where("name", "==", "Fido").get())
        data.forEach(doc => {
          result.push(doc.data())
        })
        return result;
        `
        break;
      default:
        break;
    }

    // replace code

    let fnName = key
    const options = {
      files: 'tmp/petstore/services/PetService.js',
      from: new RegExp(`const ${key} (.*\s)*?\)\;`),
      to: new_code_gen,
    };


  }





  // const results = replace.sync(options);







}