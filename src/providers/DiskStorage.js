const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
    async saveFile(file){

        // Mudar o arquivo da pasta TEMP para a pasta Upload
        // o promises.rename serve para mudar o arquivo de lugar
        await fs.promises.rename(path.resolve(uploadConfig.TMP_FOLDER, file),
        path.resolve(uploadConfig.UPLOAD_FOLDER, file));

        return file;
    }

    async deleteFile(file){
        const filePath = path.resolve(uploadConfig.UPLOAD_FOLDER, file);
        try {
            await fs.promises.stat(filePath);
        } catch (err) {
            return;
        }

        await fs.promises.unlink(filePath);
    }
}

module.exports = DiskStorage;