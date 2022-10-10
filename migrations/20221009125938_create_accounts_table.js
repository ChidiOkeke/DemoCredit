/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('accounts', function (table) {
        table.increments('account_id');
        table.integer('user_id').unsigned().references('users.user_id').onDelete('CASCADE');
        table.bigint('account_balance').notNullable();
        table.string('account_status').notNullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('accounts');
};