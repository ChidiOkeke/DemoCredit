const app = require('../dist/app').default;
const supertest = require('supertest');
const request = supertest(app)

function randomNumber() {
    return Math.floor(Math.random() * 1000) + 1000
}

const firstUserRandomNumber = randomNumber();
const secondUserRandomNumber = randomNumber();

const userDetails = {
    first_name: "John",
    last_name: "Doe",
    date_of_birth: "01-01-1990",
    email: `johndoe` + firstUserRandomNumber + `@gmail.com`,
    phone_number: `0901200` + firstUserRandomNumber,
    password: "54321",
    confirm_password: "54321"
}


const secondUserDetails = {
    first_name: "John",
    last_name: "Doe",
    date_of_birth: "01-01-1990",
    email: `johndoe` + secondUserRandomNumber + `@gmail.com`,
    phone_number: `0901200` + secondUserRandomNumber,
    password: "54321",
    confirm_password: "54321"
}

const userLoginDetails = {
    email: userDetails.email,
    password: userDetails.password
}

const secondUserLoginDetails = {
    email: secondUserDetails.email,
    password: secondUserDetails.password
}

let userId = null;
let secondUserId = null;
let token = null;
let secondUserToken = null;
let accountId = null;
let secondUserAccountId = null;

//positive test cases
describe("POST /accounts/create should handle accounts ", () => {


    it('Should create a new user', async () => {

        const res = await request.post('/users/register')
            .send(userDetails)

        userId = res.body.user_id
        expect(res.body.success).toBe(true)
        expect(res.statusCode).toBe(201)
    })


    it('Should login an existing user', async () => {

        const res = await request.post('/users/login')
            .send(userLoginDetails)

        token = res.body.token

        expect(res.body.user.user_id).toBeTruthy()
        expect(res.body.success).toBe(true)
        expect(res.statusCode).toBe(200)

    })


    it('Should create a new account', async () => {

        const res = await request.post('/accounts/create')
            .send({
                user_id: userId,
                account_status: "active"
            })
            .set('Authorization', `Bearer ${token}`)

        accountId = res.body.account_id
        expect(res.body.success).toBe(true)
        expect(res.statusCode).toBe(201)

    })

    it('Should fund an account', async () => {

        const res = await request.put('/accounts/fund')
            .send({
                account_id: accountId,
                amount: 100.00
            })
            .set('Authorization', `Bearer ${token}`)

        expect(res.body.success).toBe(true)
        expect(res.statusCode).toBe(200)

    })

    /***
     *  Create another user to test funds transfer between users 
     */

    it('Should create another user', async () => {

        const res = await request.post('/users/register')
            .send(secondUserDetails)

        secondUserId = res.body.user_id
        expect(res.body.success).toBe(true)
        expect(res.statusCode).toBe(201)
    })

    it('Should login another user', async () => {

        const res = await request.post('/users/login')
            .send(secondUserLoginDetails)

        secondUserToken = res.body.token

        expect(res.body.user.user_id).toBeTruthy()
        expect(res.body.success).toBe(true)
        expect(res.statusCode).toBe(200)

    })

    it('Should create another new account', async () => {

        const res = await request.post('/accounts/create')
            .send({
                user_id: secondUserId,
                account_status: "active"
            })
            .set('Authorization', `Bearer ${secondUserToken}`)

        secondUserAccountId = res.body.account_id
        expect(res.body.success).toBe(true)
        expect(res.statusCode).toBe(201)

    })

    it('Should fund new account', async () => {

        const res = await request.put('/accounts/fund')
            .send({
                account_id: secondUserAccountId,
                amount: 100.00
            })
            .set('Authorization', `Bearer ${secondUserToken}`)

        expect(res.body.success).toBe(true)
        expect(res.statusCode).toBe(200)

    })

});

describe("GET /transactions ", () => {
    //get transactions positive test case
    it('Should get transactions', async () => {
        const res = await request.get('/transactions')
            .set('Authorization', `Bearer ${token}`)

        expect(res.body.success).toBe(true)
        expect(res.statusCode).toBe(200)

    })

    it('Should get transactions by account ID', async () => {
        const res = await request.get(`/transactions/` + accountId)
            .set('Authorization', `Bearer ${token}`)

        expect(res.body.success).toBe(true)
        expect(res.statusCode).toBe(200)

    })

});