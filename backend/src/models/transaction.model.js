const db = require('../config/db.config.js');
const { tableConstant } = require('../utils/constant.js');
async function transactionTable(){
    const isExists =await db.schema.hasTable(tableConstant.transaction)
    
   if(!isExists){
    await db.schema.createTableIfNotExists(tableConstant.transaction, function (table){
        table.increments('id').primary();
        table.integer('user_id').notNullable().unsigned().references('id').inTable(tableConstant.user);
        table.integer('order_id').nullable().unsigned().references('id').inTable(tableConstant.order);
        table.integer('credit').nullable();
        table.integer('debit').nullable();
        table.string('transaction_type').notNullable();
        table.string('transaction_id').notNullable().unique();
        table.timestamps(true,true);
    })
}
   }

module.exports= transactionTable