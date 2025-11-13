const Imagekit = require('imagekit');
// SDK initialization

var ImageKit = require("imagekit");

var imagekit = new ImageKit({
    publicKey : "public_E3n3DkLB4TFBQWqMu3RQt7af0bs=",
    privateKey : "private_8yu8K1xHz5brz7ACu4AyA7p1ciA=",
    urlEndpoint : "https://ik.imagekit.io/ubut71lld"
});


async function imageFileUpload(file, fileName) {
    console.log("step1")
    try {
        console.log(file, fileName)
        console.log("\n", imagekit)
        const result = await imagekit.upload({ file, fileName })
        console.log("step2")
        return result
    } catch (err) {
        console.error("Upload error:", err.message || err)
    }
}

module.exports = {
    imageFileUpload
}