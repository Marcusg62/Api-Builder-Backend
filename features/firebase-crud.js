const db = require('../config')
const replace = require('replace-in-file');



module.exports.generateFunctionalities = async function () {

  console.log('gonna add the firebase query now...')

  let myQuery = '.collection("pets") .where("name", "==", "Fido")';

  const newCode = `

  const getPet = () => new Promise(
    async (resolve, reject) => {
      try {
  
        let result = []
        let data = await (db.collection("pets").where("name", "==", "Fido").get())
        data.forEach(doc => {
          result.push(doc.data())
        })
  
        resolve.successResponse(result, 200)
  
  
      } catch (e) {
  
        reject(e)
      }
    },
  );

    `;



  let fnName = 'addPet'
  const options = {
    files: 'tmp/petstore/services/PetService.js',
    from: /const getPet (.*\s)*?\)\;/,
    to: newCode,
  };


  const results = replace.sync(options);







}