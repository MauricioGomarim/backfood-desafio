const patch = require("path");
// LIB DE UPLOADS
const multer = require("multer");
const crypto = require("crypto");

const TMP_FOLDER = patch.resolve(__dirname, "..", "..", "tmp");
const UPLOAD_FOLDER = patch.resolve(TMP_FOLDER, "uploads");

const MULTER = {
    storage: multer.diskStorage({
        destination: TMP_FOLDER,
        filename(request, file, callback){
            // Gerando uma sequencia de caracteres
            const fileHash = crypto.randomBytes(10).toString("hex");
            // Concatenando a sequencia de caracteres com o nome do arquivo
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName)
        }
    })
}

module.exports = {
    TMP_FOLDER,
    UPLOAD_FOLDER,
    MULTER
}