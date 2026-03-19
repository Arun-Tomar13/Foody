const db = require('../config/db.config.js');
const { tableConstant } = require('../utils/constant.js');
async function offerTable(){
    const isExists =await db.schema.hasTable(tableConstant.offer)
    
   if(!isExists){
    await db.schema.createTableIfNotExists(tableConstant.offer, function (table){
        table.increments('id').primary();
        table.string('name').notNullable();
        table.enu("type", ["Flat Discount", "Percentage Discount", "Cashback"]).notNullable();
        table.string('description').notNullable();
        table.integer('discount').unsigned().notNullable();
        table.integer('max_discount_limit').unsigned().notNullable();
        table.integer('min_order_amount').notNullable();
        table.string('start_time').notNullable();
        table.string('start_date').notNullable();
        table.string('end_time').notNullable();
        table.string('end_date').notNullable();
        table.integer('limit').notNullable();
        table.integer('created_by').notNullable();
        table.boolean('status').defaultTo(true);
        table.string('coupon_code').notNullable();
        table.timestamps(true,true);
    })
}
   }

module.exports= offerTable