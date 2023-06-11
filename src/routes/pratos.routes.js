const { Router } = require("express")

const PratosController = require("../controllers/PratosController");
const pratosController = new PratosController();

const pratosRoutes = Router();

pratosRoutes.post("/", pratosController.create);
pratosRoutes.put("/:id", pratosController.update);


module.exports = pratosRoutes;