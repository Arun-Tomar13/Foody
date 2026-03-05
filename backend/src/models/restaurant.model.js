const db = require('../config/db.config')

async function createRestaurantTable() {
    const isExists = await db.schema.hasTable('restaurants')

    if(!isExists){
        await db.schema.createTableIfNotExists('restaurants',function(table){
            table.increments('id').primary();
            table.string('name').notNullable();
            table.enu('type', ["veg", "non-veg", "both"]).notNullable();
            table.string('address').notNullable();
            table.boolean('isOpen').notNullable().defaultTo(true);
            table.string('openingTime').notNullable();
            table.string('closingTime').notNullable();
            table.integer('owner_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE');
            table.decimal('rating',5).unsigned().defaultTo(0)
            table.timestamps(true,true);
        })
    }
}

module.exports = createRestaurantTable