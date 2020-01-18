const express = require('express');
const path = require('path')

const app = express();

//settings
app.set('port',process.env.PORT || 4000);

//statics files
app.use(express.static(path.join(__dirname, 'public')));

//starting server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});