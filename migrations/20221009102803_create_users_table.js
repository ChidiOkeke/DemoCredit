/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('user_id').notNullable();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('phone_number').notNullable();
        table.string('date_of_birth').notNullable();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.string('avatar');
        table.boolean('is_verified').defaultTo(false);
        table.timestamps(true, true);
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('users');
}
