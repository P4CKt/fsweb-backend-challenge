/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("users").truncate();
  await knex("posts").truncate();
  await knex("post_interaction").truncate();

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
  await knex("posts").insert([
    {
      post_id: 1,
      post_content:
        "Canım çok kahve istiyor çocukken kahve kazanına düşmedim mi yoksa ",
      user_id: 1,
    },
    {
      post_id: 2,
      post_content: "Hayat çok anlamsız oluyor bazen öyle böyle ",
      user_id: 2,
    },
    {
      post_id: 3,
      post_content:
        "Buz tutmuş kalpler, soğuk insanlar Herşey bi' çıkardan ibaret, umut olsan da Yanımda yokken bile adımı ansan da Nefret kokar nefesi, yanına varsan da",
      user_id: 3,
    },
  ]);
  await knex("post_interaction").insert([
    {
      post_id: 1,
      comment: "Filtre Kahvem var :P",
      liked: 1,
      user_id: 2,
    },
  ]);
};
