 const multer = require("multer");
 const uploadConfig = require("../configs/upload")


const  {Router}  = require("express");

const UsersController = require("../controllers/UsersController")
const UserAvatarController = require("../controllers/UserAvatarController")

const userAvatarController = new UserAvatarController();
const usersController = new UsersController();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")


const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER)

usersRoutes.post('/', usersController.create);
usersRoutes.put('/', ensureAuthenticated, usersController.update);
usersRoutes.patch('/avatar', ensureAuthenticated, upload.single("avatar"), userAvatarController.update);



module.exports = usersRoutes;