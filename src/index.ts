'use strict';

import { logger } from "./utils/Logger";
import dotenv from 'dotenv';
const app = require('./server/express');
// var express = require('./server/express');
// var express = require('express');
// const app = express();

dotenv.config();

// Constants
const PORT = process.env.PORT;

app.listen(PORT, () => {
  var message = `App running on port ${PORT}`;
  logger.info(message);
});
