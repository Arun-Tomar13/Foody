const db = require('../config/db.config')
const { tableConstant } = require('../utils/constant')

const createCategoryTable= async () => {
    const isExists =  await db.schema.hasTable(tableConstant.category);

    if(!isExists) await db.schema.createTable(tableConstant.category,function (table){
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.boolean('isAvailable').notNullable().defaultTo(true);
        table.integer('restaurant_id').unsigned().notNullable().references('id').inTable(tableConstant.restaurant).onDelete('CASCADE');
        table.timestamps(true,true);
    })
}

module.exports = createCategoryTable