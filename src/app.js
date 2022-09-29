const express = require("express");
const cors = require("cors");
const auth = require('./routes/auth');
const authApi = require('./routes/api/auth.json');
const lelangApi = require('./routes/api/lelang.json');
const ecommerceApi = require('./routes/api/ecommerce.json');
const settings = require('./routes/settings');
const admin = require('./routes/admin');
const lelang = require('./routes/lelang');
const ecommerce = require('./routes/ecommerce');
const emall = require('./routes/emall');
const { sequelizeInstance, Sequelize } = require('./configs/db.config');
const { importModels } = require('./models/index')
const models = importModels(sequelizeInstance, Sequelize);
const { verifyToken } = require('./middleware/VerifyToken');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

try {
  sequelizeInstance.authenticate();
  console.log('Connection has been established successfully.');
  
  const corsOptions = { origin: "http://localhost:3000" };
  app.use(cors(corsOptions));
  // parse requests of content-type - application/json
  app.use(express.json());
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname,'/public')));
  // simple route
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
  });
  //api
  app.use('/apirest/v1/auth', authApi(models));
  app.use('/apirest/v1/lelang', lelangApi(models));
  app.use('/apirest/v1/ecommerce', ecommerceApi(models));
  //cms
  app.use('/api/v1/auth', auth(models));
  app.use('/api/v1/settings', settings(models));
  app.use('/api/v1/admin', admin(models));
  app.use('/api/v1/lelang', lelang(models));
  app.use('/api/v1/ecommerce', ecommerce(models));
  app.use('/api/v1/emall', emall(models));
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });

} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// set port, listen for requests

module.exports = app;