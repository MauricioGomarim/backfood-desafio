const { Router } = require('express');

// Importando as rotas //
const usersRouter = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const pratosRoutes = require("./pratos.routes");



// Inicializando o router //
const routes = Router();

// Aplicando as rotas //
routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRoutes);
routes.use("/pratos", pratosRoutes);


// Exportando
module.exports = routes;