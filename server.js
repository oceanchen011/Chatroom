const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');

const app = express()
const port = 8080

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: path.join(__dirname, 'views', 'layouts') }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', homeHandler.getHome);
app.get('/room', roomHandler.getRoom);
app.post('/create-room', roomHandler.createRoom);
app.post('/post-message', roomHandler.postMessage);
app.get('/get-messages', roomHandler.getMessages);
app.get('/enter-room', roomHandler.getRoom);

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
