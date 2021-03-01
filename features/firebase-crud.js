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

  let paths = JSON.parse(api.swaggerDoc).paths

  // get method -> know what query/body params we have

  // for each key of functionalities
  for (const [key, value] of Object.entries(functionalities)) {

    let apiRouteMeta;

    for (const [o_key, o_value] of Object.entries(paths)) {
      // /pet, /store
      for (const [m_key, m_value] of Object.entries(o_value)) {
        // get, put, delete

        if (m_value.operationId == key) {
          apiRouteMeta = m_value
        }

      }


    }


    let new_code_gen = ``;

    // default to hardcoded path 
    // if there is a dynamic path, it is concatenated to hardcarded path
    //     dynamic path needs to be passed as a paramter named pathName
    let path = value.path;
    if (apiRouteMeta.parameters.filter(param => param.name === 'pathName').length > 0) {
      // to do: how to make sure we have appropriate syntax? like.. x/y//z/a b/c ? appropriate slashes
      path += apiRouteMeta.parameters.filter(param => param.name === 'pathName')[0]
    }





    // switch case
    switch (key) {
      case 'firestore-document-get':
        // static or dynamic path
        new_code_gen = `
        let result = (await db.doc('${path}').get()).data()
        `
        break;
      case 'firestore-document-delete':
        // static or dynamic path
        new_code_gen = `
        return await db.doc('${path}').delete()

        `
        // returns WriteResult

        break;
      case 'firestore-document-update':
        // static or dynamic path
        new_code_gen = `
        return await db.doc('${path}').update({... firestore-update-data)
        `
        // returns WriteResult

        break;
      case 'firestore-collection-get':
        // static or dynamic path
        // static or dynamic query string


        // default to query string
        // if there is a dynamic query string, it replaces hardcoded query string
        let query = value.query;
        if (apiRouteMeta.parameters.filter(param => param.name === 'firestore-collection-query').length > 0) {
          // to do: how to make sure we have appropriate syntax? like.. x/y//z/a b/c ? appropriate slashes
          query = 'firestore-collection-query'
        }

        new_code_gen = `
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