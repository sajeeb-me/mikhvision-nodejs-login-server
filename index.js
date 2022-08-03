const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello from Mikhvision!")
})

app.listen(port, () => {
    console.log(`Mikhvision is listening on port ${port}`)
})