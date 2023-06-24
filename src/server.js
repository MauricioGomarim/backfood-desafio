
// Imports
require("express-async-errors");
require ("dotenv/config");

const uploadConfig = require("./configs/upload")

const express = require('express');
const routes = require("./routes");
const app = express();

const AppError = require("./utils/AppError");
const database = require("./database/sqlite");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOAD_FOLDER))

 app.use(routes);
 database();

app.use((error, request, response, next) => {
    // Client error
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }
    console.error(error);
    // Server error
    return response.status(500).json({
        status: "error",
        message: "Internal Server Error"
    })
})

// Running port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
