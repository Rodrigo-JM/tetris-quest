// The following is in the `start.js` file

// say our sequelize instance is create in 'db.js'
const db = require('./server/db/db.js'); 
// and our server that we already created and used as the previous entry point is 'server.js'
const app = require('./server');
const port = process.env.PORT || 5000;

db.sync({force: true})
app.listen(port, function () {
    console.log("Knock, knock");
    console.log("Who's there?");
    console.log(`Your server, listening on port ${port}`);
})

