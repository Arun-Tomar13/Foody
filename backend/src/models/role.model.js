const db = require('../config/db.config.js');
const { tableConstant } = require('../utils/constant.js');
async function roleTable(){
    const isExists =await db.schema.hasTable(tableConstant.role)
    
   if(!isExists){
    await db.schema.createTableIfNotExists(tableConstant.role, function (table){
        table.increments('id').primary();
        table.string('name').unique().notNullable();
        table.string('description').notNullable();
        table.timestamps(true,true);
    })
}
   }

module.exports= roleTable