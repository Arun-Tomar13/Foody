const db = require('../config/db.config.js');
const { tableConstant } = require('../utils/constant.js');
async function offerUsedTable(){
    const isExists =await db.schema.hasTable(tableConstant.offerUsed)
    
   if(!isExists){
    await db.schema.createTableIfNotExists(tableConstant.offerUsed, function (table){
        table.increments('id').primary();
        table.integer('offer_id').unsigned().notNullable().references('id').inTable(tableConstant.offer).onDelete('CASCADE')
        table.integer('order_id').unsigned().notNullable().references('id').inTable(tableConstant.order).onDelete('CASCADE')
        table.integer('used_by').unsigned().notNullable().references('id').inTable(tableConstant.user).onDelete('CASCADE')
        table.timestamps(true,true);
    })
}
   }

module.exports=offerUsedTable