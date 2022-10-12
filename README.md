# Demo Credit - API

Demo Credit is a mobile lending app that enables wallet functionality. It enables borrowers receive loans they have been granted and also send the money for repayments.

## How to run this project

Before starting this project, install Git, MySQL and NodeJS on your machine.


VSCode is recommended.

```bash
# Clone this repository using SSH
$ git clone git@github.com:ChidiOkeke/DemoCredit.git 

OR 

# Clone this repository using HTTPS
$ git clone https://github.com/ChidiOkeke/DemoCredit.git

# Access the repository on your terminal.
$ cd DemoCredit

# 
# Setup environment variables for JWT and MySQL
#

# Install dependencies
$ yarn install

# Compile in watch mode
$ yarn compile

# Run migrations
$ yarn migrate

# Run
$ yarn dev

# Run tests
$ yarn test

```

The project will now be accessible at [http://localhost:3000](http://localhost:3000)



## Instructions
- All routes except **/users/login** and **/users/register** require bearer token authorization

- **/accounts/fund**, **/accounts/withdraw** and **/accounts/transfer** prevent duplicate transactions which occur under 60 seconds

- **/accounts/fund**,  **/accounts/withdraw**  and **/accounts/transfer** create entries in the transactions table for each transaction.

- #### Register user `POST /users/register` 
The route must receive first name, last name, date of birth, email, phone number, password and confirm password within the body of the request. The email and phone number must be unique per user. Creates an instance of the User with the received data and inserts in the users table. Returns newly generated user ID, success boolean and success message.

**Expected Input**
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "01-01-1990",
    "email": "johndoe@gmail.com",
    "phone_number": "09028374630",
    "password": "54321",
    "confirm_password": "54321"
}
```

**Expected Output**
```json
{
    "message": "You have successfully created a user",
    "success": true,
    "user_id": "31e68d3b-a893-4dbe-84d1-c886655c6d44"
}
```

- #### Login user `POST /users/login`  
The route must receive email and password within the body of the request. The email and password must match an existing user email and password for success. Returns all user data except password hash.

**Expected Input**
```json
{
    "email": "johndoe@gmail.com",
    "password": "54321"
}
```

**Expected Output**
```json
{
    "message": "Successfully logged in",
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY2E5ZTBkMDItYzI1YS00ZjJiLTg5MGQtY2UxMzcxNzJmM2JkIiwiaWF0IjoxNjY1NDA2MDgxLCJleHAiOjE2NjU0OTI0ODF9.X3deV437cD21FFT7XajUY_19sR9qZdeTIoK_UqtkjT8",
    "user": {
        "user_id": "ca9e0d02-c25a-4f2b-890d-ce137172f3bd",
        "first_name": "John",
        "last_name": "Doe",
        "phone_number": "09028374630",
        "date_of_birth": "01-01-1990",
        "email": "johndoe@gmail.com",
        "avatar": null,
        "is_verified": 0,
        "created_at": "2022-10-10T12:00:10.000Z",
        "updated_at": "2022-10-10T12:00:10.000Z"
    }
}
```


- #### Create account `POST /accounts/create` 

The route must receive user ID and account status within the body of the request. Each user ID is unique in the accounts table. 
A user cannot have more than one associated account.
Returns newly generated account ID, success boolean and success message.


**Expected Input**
```json
{
   "user_id": "86b6b5b6-b175-4f49-b0fb-9ec8959d16f6",
   "account_status": "active"
}
```

**Expected Output**
```json
{
    "message": "You have successfully created an account",
    "success": true,
    "account_id": "ddf795c0-155a-4813-b334-1fd6457715cd"
}
```
- #### Fund account `PUT /accounts/fund`

The route must receive account ID and amount to fund within the body of the request. Amount to fund must be greater than 0.0. Prevents duplicate transactions under 60 seconds. Returns funded account ID, success boolean, amount, updated account balance and success message.

**Expected Input**
```json
{
    "account_id": "f11aa73c-505d-400f-b6ae-dea2aff3faae",
    "amount": 100.00
}
```

**Expected Output**
```json
{
    "message": "You have successfully funded account",
    "account_id": "f11aa73c-505d-400f-b6ae-dea2aff3faae",
    "amount": 100,
    "account_balance": 1505.23,
    "success": true
}
```
- #### Funds transfer `PUT /accounts/transfer`
The route must receive source account ID, destination account ID and amount. Amount to fund must be greater than 0.0. Source and destination account IDs must be different. Cannot transfer more than the current account balance. Prevents duplicate transactions under 60 seconds. Returns source account ID, destination account ID, amount, source account balance, destination account balance, success boolean and success message.

**Expected Input**
```json
{
    "from_account_id": "f11aa73c-505d-400f-b6ae-dea2aff3faae",
    "to_account_id": "ddf795c0-155a-4813-b334-1fd6457715cd",
    "amount": 199.43
}
```

**Expected Output**
```json
{
    "message": "You have successfully transferred",
    "from_account_id": "f11aa73c-505d-400f-b6ae-dea2aff3faae",
    "to_account_id": "ddf795c0-155a-4813-b334-1fd6457715cd",
    "amount": 199.43,
    "source_account_balance": 1105.8,
    "destination_account_balance": 997.15,
    "success": true
}
```
- #### Funds withdrawal `PUT /accounts/withdraw`

The route must receive account ID and amount. Cannot withdraw more than the current account balance. Prevents duplicate transactions under 60 seconds. Returns withdrawal account ID, success boolean, amount, updated account balance and success message.

**Expected Input**
```json
{
    "account_id": "f11aa73c-505d-400f-b6ae-dea2aff3faae",
    "amount": 200
}
```

**Expected Output**
```json
{
    "message": "You have successfully withdrawn from your account",
    "account_id": "f11aa73c-505d-400f-b6ae-dea2aff3faae",
    "amount": 200,
    "account_balance": 1305.23,
    "success": true
}
```
- #### Get all transactions `GET /transactions`
Returns an array of all transactions in the transactions table, a count of all transactions and success boolean.

**Expected Output**
```json
{
    "count": 34,
    "success": true,
    "transactions": [
        {
            "transaction_id": "63c22503-53ec-4b0d-bf21-97cd6fb32bc9",
            "transaction_type": "inward",
            "from_account_id": "f11aa73c-505d-400f-b6ae-dea2aff3faae",
            "to_account_id": "f11aa73c-505d-400f-b6ae-dea2aff3faae",
            "date_issued": "2022-10-10T17:46:39.449Z",
            "amount": 100.22,
            "created_at": "2022-10-10T17:46:39.000Z",
            "updated_at": "2022-10-10T17:46:39.000Z"
        }
    ]

}
        
```
- #### Get account transactions `GET /transactions/:account_id`
 Returns an array of all transactions from or to a given account ID, a count of these transactions and success boolean.

**Expected Output**
```json
{
    "count": 2,
    "success": true,
    "transactions": [
        {
            "transaction_id": "1226bb27-0ad8-4c20-a878-42bf3879f9cf",
            "transaction_type": "transfer",
            "from_account_id": "f11aa73c-505d-400f-b6ae-dea2aff3faae",
            "to_account_id": "ddf795c0-155a-4813-b334-1fd6457715cd",
            "date_issued": "2022-10-10T18:46:29.592Z",
            "amount": 199.43,
            "created_at": "2022-10-10T18:46:29.000Z",
            "updated_at": "2022-10-10T18:46:29.000Z"
        },
        {
            "transaction_id": "e5a89285-5e2f-4a8f-a06d-cc0bad462f7a",
            "transaction_type": "transfer",
            "from_account_id": "f11aa73c-505d-400f-b6ae-dea2aff3faae",
            "to_account_id": "ddf795c0-155a-4813-b334-1fd6457715cd",
            "date_issued": "2022-10-11T05:47:00.577Z",
            "amount": 199.43,
            "created_at": "2022-10-11T05:47:00.000Z",
            "updated_at": "2022-10-11T05:47:00.000Z"
        }
    ]
}
        
```
## E-R Diagram:
![Alt text](https://github.com/ChidiOkeke/DemoCredit/blob/main/images/demo_credit.png "E-R Diagram")


## Technologies used:

- Typescript
- NodeJS
- Express
- KnexJS
- Yarn

## License
[MIT](https://choosealicense.com/licenses/mit/)