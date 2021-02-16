const db = require('../config')
const replace = require('replace-in-file');


// template vars

const code_gen_start = `

  const getPet = () => new Promise(
    async (resolve, reject) => {
      try {
  
        let result = []
        let data = await (db.collection("pets").where("name", "==", "Fido").get())
        data.forEach(doc => {
          result.push(doc.data())
        })


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

  // for each key of functionalities
  for (const [key, value] of Object.entries(functionalities)) {
    console.log(`${key}: ${value}`);

    let new_code_gen = ``;


    // switch case
    switch (key) {
      case 'firestore-document-get':
        // static or dynamic path


        break;
      case 'firestore-document-delete':
        // static or dynamic path

        break;
      case 'firestore-document-update':
        // static or dynamic path
        break;
      case 'firestore-collection-get':
        // static or dynamic path
        // static or dynamic query string
        break;
      default:
        break;
    }

    // replace code

    // let fnName = 'addPet'
    // const options = {
    //   files: 'tmp/petstore/services/PetService.js',
    //   from: /const getPet (.*\s)*?\)\;/,
    //   to: newCode,
    // };


  }





  // const results = replace.sync(options);







}