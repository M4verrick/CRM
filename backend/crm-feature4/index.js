const express = require('express');
const sftpRoutes = require('./routes/sftpRoutes');
const dbRoutes = require('./routes/dbRoutes');



const app = express();
app.use('/sftp', sftpRoutes);
app.use('/db', dbRoutes);

const PORT = 3000;
app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
