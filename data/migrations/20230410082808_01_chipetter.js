/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments("user_id");
      tbl.string("username", 64).unique().notNullable();
      tbl.string("e_mail", 64).unique().notNullable();
      tbl.string("password", 64).notNullable();
    })
    .createTable("posts", (tbl) => {
      tbl.increments("post_id");
      tbl.string("post_content", 280).notNullable();
      tbl.timestamp("post_date").defaultTo(knex.fn.now());
      tbl
        .integer("user_id")
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("RESTRICT")
        .onUpdate("RESTRICT");
    })
    .createTable("post_interaction", (tbl) => {
      tbl.increments("interaction_id");
      tbl.string("comment", 280);
      tbl.timestamp("interaction_date").defaultTo(knex.fn.now());
      tbl.boolean("liked").defaultTo(false);
      tbl
        .integer("post_id")
        .notNullable()
        .references("post_id")
        .inTable("posts")
        .onDelete("RESTRICT")
        .onUpdate("RESTRICT");
      tbl
        .integer("user_id")
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("RESTRICT")
        .onUpdate("RESTRICT");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("post_interaction")
    .dropTableIfExists("posts")
    .dropTableIfExists("users");
};
