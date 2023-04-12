/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("users").truncate();

  await knex("users").insert([
    {
      user_id: 1,
      username: "kahve_-_delisi",
      e_mail: "cilginKahve_41@hotmail.com",
      password: "1234",
    },
    {
      user_id: 2,
      username: "kahve_-_ayusu",
      e_mail: "cilginKahve_42@hotmail.com",
      password: "1234",
    },
    {
      user_id: 3,
      username: "kahve_-_delirmisi",
      e_mail: "cilginKahve_43@hotmail.com",
      password: "1234",
    },
  ]);
};
