const db = require('../config/db.config')
const { tableConstant } = require('../utils/constant')

const createCartTable= async () => {
    const isExists =  await db.schema.hasTable(tableConstant.cart);

    if(!isExists) await db.schema.createTable(tableConstant.cart,function (table){
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable(tableConstant.user).onDelete('CASCADE');
        table.timestamps(true,true);
    })
}

module.exports = createCartTable