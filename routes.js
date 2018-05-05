var    yelp            = require('yelp-fusion');
    
module.exports = function(app, passport) {
    const apiKey = 'FMxKEzVir_sEeThtAntSsSgbQp_9IDvaaAQW0L8CbsdZqtg8eB01RMy77Q-XuVZMAjYsumIxIJIdx602SznIhbNWPJvCidsxKfB1hrlCPgU0oM-boHiDIGyZDFFAWnYx';
    const client = yelp.client(apiKey);
app.get('/test', function(req,res){
    console.log('hit')
    // res.send('hit')
    res.render('index.html', {name: []});
})

app.post('/', function(req,res){
    var searchRequest = {
        term:'Bar',
        location: req.body.town
    };
    var data = [];
client.search(searchRequest).then(response => {
    const firstResult = response.jsonBody.businesses;
    firstResult.forEach( (e) =>{
        data.push({
            id: e.id,
            name: e.name,
            img: e.image_url,
            rating: e.rating,
            count: e.review_count,
            location: e.location
        });
    });
    res.render('index.html',{name: data});
    console.log(data)
    console.log('hit')
}).catch(e => {
  console.log(e);
});
});
}
