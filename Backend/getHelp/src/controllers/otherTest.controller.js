const storageService = require('../services/storage.service');
const {v4:uuid} = require("uuid")

async function testing1(req, res){
    try {   
        console.log(req.body)
        console.log(req.file)
        const uploading = await storageService.fileUpload(req.file.buffer, uuid())
        res.send(uploading)

    } catch (error) {
        res.json({"message": "something went wrong: ", error})
    }
}

module.exports = {
    testing1
}