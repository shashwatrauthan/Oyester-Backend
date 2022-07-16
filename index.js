const connectToMongo = require("./db.js");
const express = require('express');
const cors = require('cors');
const Tasks = require("./models/Tasks.js");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");


connectToMongo();

const options={
  definition: {
    openapi : "3.0.0",
    info:{
      title: "Oyester Backend",
      version: "1.0.0"
    },
    servers:[
      {
          url: "https://oyester-backend.vercel.app/"
      }
    ]
  },
  apis : ["./index.js"]
}

const swaggerSpec = swaggerJSDoc(options)


const app = express()
const port = process.env.PORT || 5000

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(cors());

app.use('/api/auth',require("./routes/auth"));
app.use('/api/tasks',require("./routes/tasks"));


/**
 * @swagger
 *  components:
 *    schema:
 *      Users:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          username:
 *            type: string
 *          password:
 *            type: string
 * 
 *      Login:
 *        type: object
 *        properties:
 *          username:
 *            type: string
 *          password:
 *            type: string
 */

/**
 * @swagger
 * /test:
 *  get:
 *    summary: This api is used to check if server is working or not
 *    description: This api is used to check if server is working or not
 *    responses:
 *      200:
 *          description : To test Server
 * 
 * /api/auth/createuser:
 *  post:
 *    summary: To create User
 *    description: To create User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schema/Users'
 * 
 *    responses:
 *      200:
 *          description : User Created
 * 
 * /api/auth/login:
 *  post:
 *    summary: To login User
 *    description: To login User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schema/Login'
 * 
 *    responses:
 *      200:
 *          description : Loggedin Successfully
 */


app.get('/test',(req,res)=>{
  res.send("Successful");
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})


