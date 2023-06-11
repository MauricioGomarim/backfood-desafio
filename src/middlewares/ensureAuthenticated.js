const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticated(request, response, next){
    const authHeader = request.headers.authorization;

    if(!authHeader) {
        throw new AppError("JWT inválido!", 401);
    }

    const [, token] = authHeader.split(" ")

    try {
        verify(token, authConfig.jwt.secret)
    } catch {

    }
}