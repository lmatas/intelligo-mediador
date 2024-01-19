var express = require('express');
var cors = require('cors');
import Patent from '../services/Patent/Patent'
import Repository from '../services/Repository/Repository'

// App
const app = express();

// var morgan = require('morgan');
// router.use(morgan('combined', { stream: logger.stream }));


// Enable Alls CORS Request
app.use(cors());

app.get('/api/patent/query', Patent.resolveQuery);
app.get('/api/patent/query-docs', Patent.resolveDocsQuery);
app.get('/api/patent/filter', Patent.resolveFilter);
app.get('/api/patent/filter-docs', Patent.resolveDocsFilter);
app.get('/api/patent/node', Patent.resolveNode);

app.get('/api/repository/query/:lang', Repository.resolveQuery);
app.get('/api/repository/query-docs', Repository.resolveDocsQuery);
app.get('/api/repository/filter/:lang', Repository.resolveFilter);
app.get('/api/repository/filter-docs', Repository.resolveDocsFilter);
app.get('/api/repository/node/:lang', Repository.resolveNode);


app.use('/', (req, res,next) => {
    res.send('Hello it is a API for Intelligo');
});
module.exports = app;