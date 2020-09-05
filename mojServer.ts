const https = require('http');

const app = require("./back/expressapp.ts"); 

app.set('port', 3000);

const server = https.createServer(app);

server.listen(3000);


