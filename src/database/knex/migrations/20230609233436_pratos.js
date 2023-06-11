exports.up = knex => knex.schema.createTable("pratos", table => {
    table.increments("id");
    table.text("title");
    table.text("description");
    table.text("category");
    table.text("price");
    table.varchar("image");
});

exports.down = knex => knex.schema.dropTable("pratos");
