// Hash, App Error and SQLite Connection Import
const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");

class PratosController {
  async create(request, response) {
    // Capturing Body Parameters
    const { title, description, category, price, ingredients } = request.body;

    // Solicitando nome da imagem
    const imageFileName = request.file.filename;

    // Instanciando diskStorage
    const diskStorage = new DiskStorage();

    // Saving image file
    const filename = await diskStorage.saveFile(imageFileName);

    // // Connection with Database
    const checkPratoExist = await knex("pratos").where({ title }).first();

    // Verifications
    if (checkPratoExist) {
      throw new AppError("Erro: Este prato já está cadastrado!");
    }

    const [dish_id] = await knex("pratos").insert({
      title,
      description,
      category,
      price,
      image: filename,
    });

    // Verificando se o prato tem apenas um ingrediente e inserindo as informações no banco de dados
    const temApenasUmIngrediente = typeof ingredients === "string";

    let ingredientsInsert;

    if (dish_id) {
      if (temApenasUmIngrediente) {
        ingredientsInsert = {
          name: ingredients,
          dish_id,
        };
      } else if (ingredients.length > 1) {
        ingredientsInsert = ingredients.map((name) => {
          return {
            dish_id,
            name,
          };
        });
      }
      await knex("ingredients").insert(ingredientsInsert);
    } else {
      throw new AppError("Não foi possivel cadastrar esse prato!");
    }

    return response.status(201).json();
  }

  async update(request, response) {
    const { title, description, category, price, ingredients } = request.body;
    const { id } = request.params;

    // // ?. é um operador channel, que verifica se existe o filename dentro de file
    const imageFileName = request.file?.filename;

    // Instantiating diskStorage
    const diskStorage = new DiskStorage();

    // // Getting the dish data through the informed ID
    const dish = await knex("pratos").where({ id }).first();

    // Deleting the old image if a new image is uploaded and saving the new image
    if (imageFileName != null || imageFileName != undefined ) {
      await diskStorage.deleteFile(dish.image);
      const filename = await diskStorage.saveFile(imageFileName);
      dish.image = filename ?? dish.image;
    }
     
    dish.title = title ?? dish.title;
    dish.description = description ?? dish.description;
    dish.category = category ?? dish.category;
    dish.price = price ?? dish.price;

    await knex("pratos").where({ id }).update(dish);

    // Verificando se o prato tem apenas um ingrediente e inserindo as informações no banco de dados
    const temApenasUmIngrediente = typeof ingredients === "string";

    let ingredientsInsert;

    if (temApenasUmIngrediente) {
      ingredientsInsert = {
        dish_id: dish.id,
        name: ingredients
      };
    } else if (ingredients.length > 1) {
      ingredientsInsert = ingredients.map((name) => {
        return {
          dish_id: dish.id,
          name
        };
      });
    }
    await knex("ingredients").where({dish_id: id}).delete();
    await knex("ingredients").where({dish_id: id}).insert(ingredientsInsert);

    return response.status(201).json();
  }

  async show(request, response) {
    // Pegando o id
    const { id } = request.params;

    const dish = await knex("pratos").where({ id }).first();
    const ingredients = await knex("ingredients")
      .where({ dish_id: id })
      .orderBy("name");

    return response.status(201).json({
      ...dish,
      ingredients,
    });
  }

  async index(request, response) {
    // Capturing Query Parameters
    const { title, ingredients } = request.query;

    let pratos;

    if (ingredients) {
      const filterIngredients = ingredients
        .split(",")
        .map((ingredient) => ingredient.trim());

      pratos = await knex("ingredients")
        .select([
          "pratos.id",
          "pratos.title",
          "pratos.description",
          "pratos.category",
          "pratos.price",
          "pratos.image",
        ])
        .whereLike("pratos.title", `%${title}%`)
        .whereIn("name", filterIngredients)
        .innerJoin("pratos", "pratos.id", "ingredients.dish_id")
        .groupBy("pratos.id")
        .orderBy("pratos.title");
    } else {
      pratos = await knex("pratos")
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const ingredientsPratos = await knex("ingredients");
    const pratosComIngradients = pratos.map((prato) => {
      const ingredientPrato = ingredientsPratos.filter(
        (ingredient) => ingredient.dish_id === prato.id
      );
      return {
        ...prato,
        ingredients: ingredientPrato,
      };
    });
    return response.status(200).json(pratosComIngradients);
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("pratos").where({ id }).delete();

    return response.status(201).json();
  }
}

module.exports = PratosController;
