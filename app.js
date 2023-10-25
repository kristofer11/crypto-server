const express = require('express');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb')
require('dotenv').config();

app.use(express.static('public'));

const uri = process.env.MONGODB_URI;

app.get('/api/latest-crypto-price', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const collection = client.db('Cluster0').collection('crypto_prices')

        const latestDocument = await collection
            .find()
            .sort({ timestamp: -1 })
            .limit(1)
            .toArray()

        if (latestDocument.length > 0) {
            res.json(latestDocument[0]);
        } else {
            res.status(404).send('No data found.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred while fetching data from DB.');
    } finally {
        client.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})