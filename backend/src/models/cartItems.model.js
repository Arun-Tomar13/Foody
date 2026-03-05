const db = require('../config/db.config')
const { tableConstant } = require('../utils/constant')

const createCartItemsTable= async () => {
    const isExists =  await db.schema.hasTable(tableConstant.cartItem);

    if(!isExists) await db.schema.createTable(tableConstant.cartItem,function (table){
        table.increments('id').primary();
        table.integer('item_id').unsigned().notNullable().references('id').inTable(tableConstant.menu).onDelete('CASCADE');
        table.integer('quantity').unsigned().defaultTo(1);
        table.integer('price').unsigned().notNullable();
        table.integer('cart_id').unsigned().notNullable().references('id').inTable(tableConstant.cart).onDelete('CASCADE');
        table.timestamps(true,true);
    })
}

module.exports = createCartItemsTable