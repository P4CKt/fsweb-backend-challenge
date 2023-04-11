/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("post_interaction").truncate();
  return await knex("post_interaction").insert([
    {
      post_id: 1,
      comment: "Filtre Kahvem var :P",
      liked: 1,
      user_id: 2,
    },
  ]);
};
