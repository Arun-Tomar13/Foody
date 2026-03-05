const db = require('../config/db.config')
const { tableConstant } = require('../utils/constant')

const createOrderItemsTable= async () => {
    const isExists =  await db.schema.hasTable(tableConstant.orderItem);

    if(!isExists) await db.schema.createTable(tableConstant.orderItem,function (table){
        table.increments('id').primary();
        table.integer('order_id').unsigned().notNullable().references('id').inTable(tableConstant.order).onDelete('CASCADE').onUpdate('CASCADE');
        table.integer('quantity').unsigned().notNullable();
        table.integer('price').unsigned().notNullable();
        table.integer('item_id').unsigned().references('id').inTable(tableConstant.menu).onDelete('SET NULL');
        table.integer('user_id').unsigned().references('id').inTable(tableConstant.user).onDelete('SET NULL');
        table.timestamps(true,true)
    })
}

module.exports = createOrderItemsTable
