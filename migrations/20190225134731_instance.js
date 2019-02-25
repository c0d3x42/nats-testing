exports.up = function(knex, Promise) {
  return knex.schema.createTable('instances', table => {
    table.increments('id').primary();
    table.uuid('uuid');
    table.bigInteger('createdAt').notNullable();
    table.bigInteger('updatedAt').notNullable();
  });
};

exports.down = function(knex, Promise) {};
