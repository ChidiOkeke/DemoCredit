const app = require('../dist/app').default;
const supertest = require('supertest');
const request = supertest(app)

const knex = require('knex');
const knexConfig = require('../knexfile.js')
const database = knex(knexConfig.test);

const randomNumber = Math.floor(Math.random() * 100) + 100

describe("POST /users/create should handle user registration ", () => {

    const userData = {
        first_name: "John",
        last_name: "Doe",
        date_of_birth: "01-01-1990",
        email: `johndoe` + randomNumber + `@gmail.com`,
        phone_number: `09125004` + randomNumber,
        password: "54321",
        confirm_password: "54321"
    }

    it('Should create a new user', async () => {

        const res = await request.post('/users/register')
            .send(userData)

        expect(res.body.success).toBe(true)
        expect(res.statusCode).toBe(201)

        // Searches the user in the database
        const user = await database('users').select('email', 'first_name').where('email', userData.email).first()
        expect(user.first_name).toBe(userData.first_name)
        expect(user.email).toBe(userData.email)

    })

    it('Should fail with existing email', async () => {

        const res = await request.post('/users/register')
            .send(userData)


        expect(res.body.success).toBe(false)
        expect(res.statusCode).toBe(409)

    
        const user = await database('users').select('email', 'first_name').where('email', userData.email).first()
        expect(user.first_name).toBe(userData.first_name)
        expect(user.email).toBe(userData.email)

    })

});


describe("POST /users/login should handle user login ", () => {

    const userData = {
        email: `johndoe` + randomNumber + `@gmail.com`,
        password: "54321"
    }
    
    it('Should login an existing user', async () => {

        const res = await request.post('/users/login')
            .send(userData)

        expect(res.body.user.user_id).toBeTruthy()
        expect(res.body.success).toBe(true)
        expect(res.statusCode).toBe(200)

        // Searches in the database
        const user = await database('users').select('email').where('email', userData.email).first()
        expect(user.email).toBe(userData.email)

    })
});