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


const generateFunctionalities = async function (apiId) {
  // get functionalities

  let api = (await db.doc('api/' + apiId).get()).data()
  let functionalities = api.functionalities

  console.log('generating functionalities...')

  let paths = JSON.parse(api.swaggerDoc).paths

  // get method -> know what query/body params we have

  // for each key of functionalities
  if (!functionalities) {
    return
  }

  for (const [key, value] of Object.entries(functionalities)) {

    let apiRouteMeta;
    let operationId = key;


    let new_code_gen = `
    const ${operationId} = () => new Promise(
      async (resolve, reject) => {
        try {
          // replace me
          `;

    let path = ''
    if (value.path == 'dynamic') {
      path = 'req.query.dynamicPath'
    } else {
      path = value.path
    }
    // switch case
    switch (value.type) {
      case 'firestore-document-get':
        // static or dynamic path'

        new_code_gen += `
        return (await db.doc('${path}').get()).data()
        `
        break;
      case 'firestore-document-delete':
        // static or dynamic path
        new_code_gen += `
        return await db.doc('${path}').delete()

        `
        // returns WriteResult

        break;
      case 'firestore-document-update':
        // static or dynamic path
        new_code_gen += `
        return await db.doc('${path}').update({... firestore-update-data})
        `
        // returns WriteResult

        break;
      case 'firestore-collection-get':
        // static or dynamic path
        // static or dynamic query string
        new_code_gen += `
        let result = []; 
        (await db.collection('pets').get()).forEach(doc => {
          results.push(doc.data())
        })

        return result;
        `


        break;

      case 'firestore-collection-query':

        query = `'name', '==', 'Fido'`

        new_code_gen += `
        let result = []
        let data = await (db.collection('${path}').where(${query}).get())
        data.forEach(doc => {
          result.push(doc.data())
        })
        return result;
        `

        break;
      default:
        break;
    }


    new_code_gen += `
      } catch (e) {
        reject(Service.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405,
        ));
      }
    },
    );
    `

    // replace code
    try {
      let regex = new RegExp(`const ${key} (.*\\s)*?\\)\\;`)
      console.log('regex', regex)
      let fnName = key
      const options = {
        files: `tmp/gen/services/DefaultService.js`,
        from: regex,
        to: new_code_gen,
      };
      const results = await replace.sync(options);
    } catch (error) {
      console.error('Regex error...: ', error)
    }

  } // end for 

}


module.exports.generateFunctionalities = generateFunctionalities;