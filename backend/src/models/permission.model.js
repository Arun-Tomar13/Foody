const db = require('../config/db.config.js');
const { tableConstant } = require('../utils/constant.js');
async function permissionTable(){
    const isExists =await db.schema.hasTable(tableConstant.permission)
    
   if(!isExists){
    await db.schema.createTableIfNotExists(tableConstant.permission, function (table){
        table.increments('id').primary();
        table.integer('role_id').unsigned().notNullable().references('id').inTable(tableConstant.role).onDelete('CASCADE');
        table.integer('module_id').unsigned().notNullable().references('id').inTable(tableConstant.module).onDelete('CASCADE');
        table.integer('action_id').unsigned().notNullable().references('id').inTable(tableConstant.action).onDelete('CASCADE');
        table.string('description').notNullable();
        table.timestamps(true,true)
    })
}
   }

module.exports= permissionTable