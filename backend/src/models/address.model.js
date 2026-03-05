const db = require('../config/db.config')
const { tableConstant } = require('../utils/constant')

const createAddressTable= async () => {
    const isExists =  await db.schema.hasTable(tableConstant.address);

    if(!isExists) await db.schema.createTable(tableConstant.address,function (table){
        table.increments('id').primary();
        table.string('address').notNullable();
        table.integer('user_id').unsigned().notNullable().references('id').inTable(tableConstant.user).onDelete('CASCADE');
        table.timestamps(true,true);
    })
}

module.exports = createAddressTable