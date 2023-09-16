const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Endpoint to run Python code
app.post('/run-python', (req, res) => {
    const pythonCode = req.body.code;

    // Create a temporary Python file
    fs.writeFileSync('temp.py', pythonCode);

    // Run Python code
    exec('python temp.py', (error, stdout, stderr) => {
        fs.unlinkSync('temp.py'); // Remove the temporary Python file
        if (error) {
            res.status(500).send(error.message);
            return;
        }
        if (stderr) {
            res.status(500).send(stderr);
            return;
        }
        res.send(stdout);
    });
});

// Endpoint to run Java code
app.post('/run-java', (req, res) => {
    const javaCode = req.body.code;

    // Create a temporary Java file
    fs.writeFileSync('Main.java', javaCode);

    // Compile and run Java code
    exec('javac Main.java && java Main', (error, stdout, stderr) => {
        fs.unlinkSync('Main.java'); // Remove the temporary Java file
        if (error) {
            res.status(500).send(error.message);
            return;
        }
        if (stderr) {
            res.status(500).send(stderr);
            return;
        }
        res.send(stdout);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
