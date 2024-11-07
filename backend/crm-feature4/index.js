const express = require('express');
const sftpRoutes = require('./routes/sftpRoutes');
const dbRoutes = require('./routes/dbRoutes');
const dataRoutes = require('./routes/dataRoutes');


const app = express();
app.use('/sftp', sftpRoutes);
app.use('/db', dbRoutes);
app.use('/data', dataRoutes);



app.get('/fetch-files', async (req, res) => {
    try {
        await downloadAndProcessFiles();
        res.send("Files downloaded and processed.");
    } catch (error) {
        res.status(500).send("Error processing files: " + error.message);
    }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});


// app use vs app listen