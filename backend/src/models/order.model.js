const db = require('../config/db.config')
const { tableConstant } = require('../utils/constant')

const createOrderTable= async () => {
    const isExists =  await db.schema.hasTable(tableConstant.order);

    if(!isExists) await db.schema.createTable(tableConstant.order,function (table){
        table.increments('id').primary();
        table.integer('placed_by').unsigned().notNullable().references('id').inTable(tableConstant.user).onDelete('CASCADE');
        table.string('status').defaultTo('placed');
        table.integer('total').unsigned().notNullable();
        table.string('address').notNullable();
        table.timestamps(true,true);
    })
}

module.exports = createOrderTable