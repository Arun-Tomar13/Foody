const db = require("../config/db.config");
async function createTable() {

 const isExists =await db.schema.hasTable('users')

 if(!isExists){
    await db.schema.createTableIfNotExists("users", function (table) {
    table.increments("id").primary();
    table.string("name", 50).notNullable();
    table.integer("age",120).notNullable();
    table.integer('role_id').unsigned().notNullable().references('id').inTable('roles').onDelete('CASCADE');
    table.string("email", 25).notNullable().unique();
    table.string("phone", 10).notNullable();
    table.string("address").notNullable();
    table.string("user_image").nullable();
    table.string("password").notNullable();
    table.string("refresh_token");
    table.string("country", 25).notNullable();
    table.enu("gender", ["male", "female", "other"]).notNullable();
    table.timestamps(true, true);

  });
 }
 
}
module.exports = createTable;
