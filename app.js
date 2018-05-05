const   express         =   require('express'),
        app             =   express(),
        bodyParser      = require('body-parser'),
        mongoose        =   require('mongoose'),
        passport        = require('passport'),
        yelp            =   require('yelp-fusion'),
        configDB        = require('./config/database.js'),
        RSVP            =   require('./models/rsvp.js'),
        Strategy        = require('passport-twitter').Strategy,
        session         = require('express-session')
        
        
mongoose.connect('mongodb://Zaknefeinn:1234asdf@ds115071.mlab.com:15071/nightlife')    
.then((db) => console.log('connection successful'))
  .catch((err) => console.error(err));

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, x-request-metadata');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//Auth
passport.use(new Strategy({
    consumerKey:'jHMwAfkyvQvRa31djddYvipGM',
    consumerSecret:'5HTbwkjiLuK2IRdMTC0jV2ptuszVz3AeEF0IeBI0VGyQdpg0h5',
    callbackURL:'https://nightlife-v2-ehutc00f.c9users.io/auth/twitter/callback'
}, (token,tokenSecret,profile,callback) => console.log('profile', profile)
    
));

passport.serializeUser((user, callback) => callback(null, user))
passport.deserializeUser((obj,callback) => callback(null, obj))

app.use(session({
    secret:'Something secrative',
    resave: true,
    saveUninitialized: true
}));


//Yelp API
const apiKey = 'FMxKEzVir_sEeThtAntSsSgbQp_9IDvaaAQW0L8CbsdZqtg8eB01RMy77Q-XuVZMAjYsumIxIJIdx602SznIhbNWPJvCidsxKfB1hrlCPgU0oM-boHiDIGyZDFFAWnYx';
const client = yelp.client(apiKey);

//Search town
app.get('/api/search/:id', (req,res) => {
    var searchRequest = {
            term:'Bar',
            location: req.params.id
    }
    let database;
    RSVP.find({}, (err, item) => {
        if(err) throw err;
        database = item;
    })
        var data = [];
    client.search(searchRequest)
.then( response => {
    const firstResult = response.jsonBody.businesses;   
    firstResult.forEach( e => {
        const id = e.id;
        // console.log(database.find(x => {x.id === id}).)
        data.push({
            id: id,
            name: e.name,
            img: e.image_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png',
            rating: e.rating,
            location: e.location,
            url:e.url,
            phone: e.phone,
            rsvp: database.find(x=> x.id === e.id) || ''
        });
    })
        res.send(data)
})

})
// RSVP
app.post('/test', (req,res) => {
    const id = req.body.id
    let user = req.body.user
    const bar = req.body.bar
    let userArray = [];
    RSVP.find({id}, (err,rsvp) => {
        if(err){
            throw err
        } else {
            //if already stored
            if(rsvp.length > 0){
                userArray = rsvp[0].user;
                //if user doesn't exist
                if(userArray.indexOf(user) < 0){
                    userArray.push(user)
                } else {
                //if user exists
                userArray = userArray.filter( x => x !== user)
                }
                if(userArray.length > 0){
                    RSVP.findByIdAndUpdate(rsvp[0]._id, {$set:{user:userArray}},(err,update) => {
                        if(err) throw err;
                    })
                } else {
                    RSVP.findByIdAndRemove(rsvp[0]._id, (err, rem) =>{
                        if(err) throw err;
                    })
                }
            } else {
            //if new    
                RSVP.create({id:id, user:[user], bar:bar},(err, created) => {
                    if(err){
                        console.log(err)
                    } else {
                        res.end()
                    }
                })
            }
        }
    }) 
})


//login
app.get('/auth/twitter', passport.authenticate('twitter'))

app.get('/auth/twitter/callback', passport.authenticate('twitter',{
    failureRedirect: '/'}), (req,res) => {
        console.log('hit')
        res.redirect('/');
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
