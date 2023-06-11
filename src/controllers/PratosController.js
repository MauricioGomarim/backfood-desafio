// Hash, App Error and SQLite Connection Import
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class PratosController {
  async create(request, response) {
    // Capturing Body Parameters
    const { title, description, category, price, ingredients } = request.body;

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

    const dish = await knex("pratos").where({ id }).first();

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
}

module.exports = PratosController;
