const db = require('../config/db.config')
const { tableConstant } = require('../utils/constant')

const createMenuTable= async () => {
    const isExists =  await db.schema.hasTable(tableConstant.menu);

    if(!isExists) await db.schema.createTable(tableConstant.menu,function (table){
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.string('image').nullable().defaultTo('public\\uploads\\menu\\default_food.png');
        table.enu('type',['veg','non-veg']).notNullable();
        table.boolean('isAvailable').notNullable().defaultTo(true);
        table.integer('price').notNullable();
        table.integer('category_id').unsigned().notNullable().references(`${tableConstant.category}.id`).onDelete('CASCADE');
        table.integer('restaurant_id').unsigned().notNullable().references(`${tableConstant.restaurant}.id`).onDelete('CASCADE');
        table.timestamps(true,true);
    })
}

module.exports = createMenuTable