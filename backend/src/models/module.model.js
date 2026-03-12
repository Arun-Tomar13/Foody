const db = require('../config/db.config.js');
const { tableConstant } = require('../utils/constant.js');
async function moduleTable(){
    const isExists =await db.schema.hasTable(tableConstant.module)
    
   if(!isExists){
    await db.schema.createTableIfNotExists(tableConstant.module, function (table){
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.timestamps(true,true);
    })
}
   }

module.exports= moduleTable