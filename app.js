const   express         =   require('express'),
        app             =   express(),
        bodyParser      = require('body-parser'),
        mongoose        =   require('mongoose'),
        passport        = require('passport'),
        yelp            =   require('yelp-fusion'),
        configDB        = require('./config/database.js');
        
mongoose.connect('mongodb://Zaknefeinn:1234asdf@ds115071.mlab.com:15071/nightlife')    
.then(() => console.log('connection successful'))
  .catch((err) => console.error(err));

mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended:true}));
// app.set('view engine', 'html');
// app.use(express.static(__dirname + '/client/public'));

app.use(require('express-session')({
    secret:'Something secrative',
    resave:false,
    saveUninitialized: false
}));

const apiKey = 'FMxKEzVir_sEeThtAntSsSgbQp_9IDvaaAQW0L8CbsdZqtg8eB01RMy77Q-XuVZMAjYsumIxIJIdx602SznIhbNWPJvCidsxKfB1hrlCPgU0oM-boHiDIGyZDFFAWnYx';
const client = yelp.client(apiKey);

app.use(passport.initialize());
app.use(passport.session());

var searchRequest = {
            term:'Bar',
        location: 'Fayetteville'
}

app.post('/api/', (req,res) => {
client.search(searchRequest)
.then( res => {
    var data = [];
    const firstResult = res.jsonBody.businesses;   
    firstResult.forEach( e => {
        data.push({
            id: e.id,
            name: e.name,
            img: e.image_url,
            rating: e.rating,
            count: e.review_count,
            location: e.location
        });
    })
    res.send(data)
})
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen( 8081, () =>
  console.log(`Listening to port  8081`)
);
