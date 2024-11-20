const express = require('express');
const sftpRoutes = require('./routes/sftpRoutes');
const dbRoutes = require('./routes/dbRoutes');
// const dataRoutes = require('./routes/dataRoutes');


const app = express();
app.use(express.json()); // For parsing JSON bodies
app.use('/db', dbRoutes); // Database-related routes under /api/db
app.use('/sftp', sftpRoutes); // SFTP-related routes under /api/sftp
app.get('/', (req, res) => {
    res.send('a'); // Respond with "a"
  });
app.get('/transaction', (req, res) => {
res.send('a'); // Respond with "a"
});


const PORT = 3000;
app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});




