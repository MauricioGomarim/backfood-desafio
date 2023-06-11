const UsersController = require("../controllers/UsersController")
const usersController = new UsersController();


const  {Router}  = require("express");

const usersRoutes = Router();

usersRoutes.post('/', usersController.create)
usersRoutes.put('/:user_id', usersController.update)

module.exports = usersRoutes;