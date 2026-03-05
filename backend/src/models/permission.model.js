const db = require('../config/db.config.js')
async function permissionTable(){
    const isExists =await db.schema.hasTable('permissions')
    
   if(!isExists){
    await db.schema.createTableIfNotExists('permissions', function (table){
        table.increments('id').primary();
        table.integer('role_id').unsigned().notNullable().references('id').inTable('roles').onDelete('CASCADE');
        table.integer('module_id').unsigned().notNullable().references('id').inTable('modules').onDelete('CASCADE');
        table.string('description').notNullable();
        table.timestamps(true,true);
    })
}
   }

module.exports= permissionTable