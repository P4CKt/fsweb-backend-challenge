/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("posts").truncate();

  return await knex("posts").insert([
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
};
