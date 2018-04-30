require('dotenv').config()
var keys = require("./keys.js");
var fs = require('fs');
var moment = require("moment");

function processInput(array){

    action = array[0];
    array.splice(0,1);

    fs.appendFile('liri.log',"Request: "+action+", Value: "+array.join(" ")+", Timestamp: "+moment(this.date).format("LLLL")+"\n", function (err) {
        if (err) throw err;
        //console.log('Request logged to liri.log');
    });

    if(action==="my-tweets"){
        getTweets();
    }
    else if(action==="spotify-this-song"){
        getSong(array);
    }
    else if(action==="movie-this"){
        getMovie(array);
    }
    else if(action==="do-what-it-says"){

        var content;
        fs.readFile('./random.txt',"UTF-8", function read(err, data) {
            if (err) {
                throw err;
            }
            var content = data;
            console.log("Being request from file random.txt: '"+content+"'");
            array = [];
            array = content.split(" ");
            processInput(array);
        });
    }
    else if(action === "help"){
        getHelp();
    }
}

function getTweets(){
    var Twitter = require('twitter');
    var client = new Twitter(keys.twitter);
    var params = {screen_name: '__mikemikemike'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log("Your 5 most recent tweets:");
            console.log("===========================");
            for(i=1;i<6;i++){
                console.log("Tweet #"+i)
                console.log(tweets[i-1].created_at);
                console.log(tweets[i-1].text);
                console.log("===========================");
            }
        }
    });
}

function getSong(array){
    value = array.join(" ");
    var Spotify = require('node-spotify-api');
 
    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });
    
    if(value === ''){
        spotify.search({ type: 'track', query: "The Sign Ace of Base" }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log("You did not provide a song. Here is a song you should listen to!")
            console.log("===========================");
            console.log("Track: "+data.tracks.items[0].name);
            console.log("Artist: "+data.tracks.items[0].artists[0].name);
            console.log("Album: "+data.tracks.items[0].album.name);
            console.log("Track Number: "+data.tracks.items[0].track_number);
            console.log("Popularity Score: "+data.tracks.items[0].popularity);
            console.log("Spotify URI: "+data.tracks.items[0].uri);
            console.log("===========================");
        });
    }
    else{
        spotify.search({ type: 'track', query: value }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log("Here is the most popular track with the name '"+value+"'")
            console.log("===========================");
            console.log("Track: "+data.tracks.items[0].name);
            console.log("Artist: "+data.tracks.items[0].artists[0].name);
            console.log("Album: "+data.tracks.items[0].album.name);
            console.log("Track Number: "+data.tracks.items[0].track_number);
            console.log("Popularity Score: "+data.tracks.items[0].popularity);
            console.log("Spotify URI: "+data.tracks.items[0].uri);
            console.log("===========================");
        });
    }

}

function getMovie(array){
    value = array.join("+");

    if(value === ''){
        queryURL = "http://www.omdbapi.com/?apikey="+keys.omdb.key+"&t="+"Mr+Nobody";
        var request = require('request');
        request(queryURL, function (error, response, body) {
            content = JSON.parse(body);
            console.log("You did not provide a movie. Here is a movie you should watch!")
            console.log("===========================");
            console.log("Title: "+content.Title);
            console.log("Year: "+content.Year);
            console.log("Rated: "+content.Rated);
            console.log("Genre: "+content.Genre);
            console.log("IMDB Rating: "+content.imdbRating);
            console.log("Rotten Tomatoes Rating: "+content.Ratings[1].Value);
            console.log("Country Produced: "+content.Country);
            console.log("Plot: "+content.Plot);
            console.log("Actors: "+content.Actors);
            console.log("===========================");
        });
    }
    else{
        valueString = array.join(" ");
        queryURL = "http://www.omdbapi.com/?apikey="+keys.omdb.key+"&t="+value;
        var request = require('request');
        request(queryURL, function (error, response, body) {
            content = JSON.parse(body);
            console.log("Here is the most popular movie with the name '"+valueString+"'")
            console.log("===========================");
            console.log("Title: "+content.Title);
            console.log("Year: "+content.Year);
            console.log("Rated: "+content.Rated);
            console.log("Genre: "+content.Genre);
            console.log("IMDB Rating: "+content.imdbRating);
            console.log("Rotten Tomatoes Rating: "+content.Ratings[1].Value);
            console.log("Country Produced: "+content.Country);
            console.log("Plot: "+content.Plot);
            console.log("Actors: "+content.Actors);
            console.log("===========================");
        });
    }
}

function getHelp(){
    console.log("Here are a list of the available commands:");
    console.log('my-tweets --> ex: "node liri.js my-tweets"');
    console.log('spotify-this-song --> ex: "node liri.js spotify-this-song The Sign"');
    console.log('movie-this --> ex: "node liri.js movie-this Mr. Nobody"');
    console.log('do-what-it-says --> ex: node liri.js do-what-it-says');
}

inputArray = [];
inputArray = process.argv;
inputArray.splice(0,2);
processInput(inputArray);