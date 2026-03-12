const db = require('../config/db.config.js');
const { tableConstant } = require('../utils/constant.js');
async function actionTable(){
    const isExists =await db.schema.hasTable(tableConstant.action)
    
   if(!isExists){
    await db.schema.createTableIfNotExists(tableConstant.action, function (table){
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.timestamps(true,true);
    })
}
   }

module.exports= actionTable