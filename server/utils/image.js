const cloudinary = require("../config/cloudinary.js");

const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    resource_type: "image",
    quality: "auto",
    format: "webp",
    transformation: [
        { width: 500, height: 500, crop: "fit", gravity: "center" }
    ]
}

const imageUpload = async (folder, files) => {
    try {
        const uploadPromises = files.map(file => cloudinary.uploader.upload(file, {...options, folder}))

        const results = await Promise.all(uploadPromises);
        return results;
    } catch(err) {
       return { message: "Error uploading image", error: err.message };
    }
}

module.exports = imageUpload;