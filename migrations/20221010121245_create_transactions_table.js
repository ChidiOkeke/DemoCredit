/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('transactions', function (table) {
        table.uuid('transaction_id').notNullable();
        table.string('transaction_type').notNullable();
        table.uuid('from_account_id').notNullable().references('accounts.account_id');
        table.uuid('to_account_id').notNullable().references('accounts.account_id');
        table.string('date_issued').notNullable();
        table.float('amount').notNullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('transactions');
};
