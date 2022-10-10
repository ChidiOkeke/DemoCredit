/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('accounts', function (table) {
        table.uuid('account_id').unique().notNullable();
        table.uuid('user_id').notNullable().references('users.user_id');
        table.float('account_balance').notNullable();
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
