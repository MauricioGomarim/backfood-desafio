const { Router } = require("express")
const multer = require('multer');
const uploadConfig = require('../configs/upload');
const PratosController = require("../controllers/PratosController");
const pratosController = new PratosController();

const pratosRoutes = Router();
const upload = multer(uploadConfig.MULTER);

// Sem o comando upload.single("image"), não da para receber dados pela classe FormData

pratosRoutes.post("/", upload.single("image"), pratosController.create);
pratosRoutes.get("/", pratosController.index);
pratosRoutes.get("/:id", pratosController.show);
pratosRoutes.put("/:id",upload.single("image"), pratosController.update);
pratosRoutes.delete("/:id", pratosController.delete);



module.exports = pratosRoutes;