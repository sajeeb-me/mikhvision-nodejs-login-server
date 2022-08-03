const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqi0w.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("database").collection("users");

        app.post('/signup', async (req, res) => {
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const email = req.body.email;
                const signedUpUser = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    pass: hashedPassword
                };
                const alreadyExist = await userCollection.findOne({ email });
                if (alreadyExist) {
                    res.send({ success: false, message: "User already exist!" });
                } else {
                    const user = await userCollection.insertOne(signedUpUser);
                    res.send({ success: true, message: "Signed up successfully!", user: signedUpUser });
                }
            } catch {
                res.send({ success: false, message: "Something went wrong!" });
            }
        })

        app.post('/login', async (req, res) => {
            const email = req.body.email;
            const pass = req.body.password;
            const isUser = await userCollection.findOne({ email });
            if (!isUser) {
                res.send({ success: false, message: "Email or password is incorrect!" });
            }
            try {
                const isValidPass = await bcrypt.compare(pass, isUser.pass);
                if (!isValidPass) {
                    res.send({ success: false, message: "Email or password is incorrect!" });
                } else {
                    res.send({ success: true, message: "Logged in successfully!", user: isUser });
                }
            } catch {
                res.send({ success: false, message: "User not found!" });
            }
        })
    }
    catch (error) {
        console.log(error);
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Hello from Mikhvision!")
})

app.listen(port, () => {
    console.log(`Mikhvision is listening on port ${port}`)
})