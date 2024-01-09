const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB (replace 'your_mongodb_connection_string' with your actual MongoDB connection string)
mongoose.connect('mongodb://127.0.0.1:27017/highwayDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a Highway schema
const highwaySchema = new mongoose.Schema({
    name: String,
    geometry: Object,
});

const Highway = mongoose.model('Highway', highwaySchema);

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    // Send the HTML file containing the Leaflet map
    
});


// Routes
app.post('/api/saveHighway', async (req, res) => {
    try {
        const { name, geometry } = req.body;
        
        const newHighway = new Highway({
            name,
            geometry,
        });

        await newHighway.save();

        res.status(201).json({ message: 'Highway saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/deleteHighway/:id', async (req, res) => {
    try {
        const highwayId = req.params.id;

        const deletedHighway = await Highway.findByIdAndDelete(highwayId);

        if (!deletedHighway) {
            return res.status(404).json({ error: 'Highway not found' });
        }

        res.json({ message: 'Highway deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
