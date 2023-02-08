const path=require('path')
require('dotenv').config({})
const express = require("express");
const app = express();

const cors = require('cors');

const http = require('http');
// const app = require('./app')
const PORT = process.env.PORT || 3001

const server = http.createServer(app);

 server.listen(PORT, () => console.log(`server is starting on port http://localhost:${PORT} ..`));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));



//* Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, './build')));

 
//* All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});




//? ================================================
// !! =========== ERROR Handling URL ========= !! //
//? ================================================

app.use((req, res, next) => {
  const error = new Error('Not Found!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});