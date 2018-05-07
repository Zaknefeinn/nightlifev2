const   express         =   require('express'),
        app             =   express(),
        bodyParser      = require('body-parser'),
        mongoose        =   require('mongoose'),
        passport        = require('passport'),
        yelp            =   require('yelp-fusion'),
        configDB        = require('./config/database.js'),
        RSVP            =   require('./models/rsvp.js'),
        User            =   require('./models/user.js'),
        Strategy        = require('passport-twitter').Strategy,
        axios           =   require('axios'),
        cookieSession   = require('cookie-session'),
        keys            = require('./keys')
        
        
mongoose.connect(keys.DBURL)    
.then((db) => console.log('connection successful'))
  .catch((err) => console.error(err));

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ['asdasdasdaxdfsa']
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://nightlife-v2-ehutc00f.c9users.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, x-request-metadata');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
//Auth
passport.use(new Strategy({
    consumerKey: keys.TWITTERKEY,
    consumerSecret:keys.TWITTERSECRET,
    callbackURL:'/auth/twitter/callback'
    // proxy: true
}, async(token,tokenSecret,profile,done) => {
    const existingUser = await User.findOne({twitterID: profile.id});
    if (existingUser) {
        done(null, existingUser);
    } else {
        const user = await new User({twitterID: profile.id, name: profile.displayName}).save();
        done(null, user);
    }
}
    
));

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});


//Yelp API
const apiKey = keys.YELPKEY;
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
    const name = req.body.userName
    let userArray = [];
    let userNames = [];
    RSVP.find({id}, (err,rsvp) => {
        if(err){
            throw err
        } else {
            //if already stored
            if(rsvp.length > 0){
                userArray = rsvp[0].user;
                userNames = rsvp[0].userNames;
                //if user doesn't exist
                if(userArray.indexOf(user) < 0){
                    userArray.push(user)
                    userNames.push(name)
                } else {
                //if user exists
                userArray = userArray.filter( x => x !== user)
                userNames = userNames.filter( x => x !== name)
                }
                if(userArray.length > 0){
                    RSVP.findByIdAndUpdate(rsvp[0]._id, {$set:{user:userArray,userNames:userNames}},(err,update) => {
                        if(err) throw err;
                    })
                } else {
                    RSVP.findByIdAndRemove(rsvp[0]._id, (err, rem) =>{
                        if(err) throw err;
                    })
                }
            } else {
            //if new    
                RSVP.create({id:id, user:[user], userNames:[name], bar:bar},(err, created) => {
                    if(err){
                        console.log(err)
                    } 
                })
            }
        }
        res.end()
    }) 
})

//login
app.get('/auth/twitter',(req, res, next) => next(),
passport.authenticate('twitter'))

app.get('/auth/twitter/callback', passport.authenticate('twitter',{
    failureRedirect: 'https://nightlife-v2-ehutc00f.c9users.io/'}), (req,res) => {
        res.redirect('https://nightlife-v2-ehutc00f.c9users.io/');
    })

app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('https://nightlife-v2-ehutc00f.c9users.io/');
})

app.get('/api/get_user', (req, res) => {
    res.send(req.user);
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
