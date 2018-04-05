console.log("hello");
require("dotenv").config();
let keys = require("./key.js");
let request = require("request-promise");
var inquirer = require("inquirer");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs-extra");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

let arg = process.argv[2];
let argSearch = process.argv.splice(3).join("+");

function myTweets(){
    fs.appendFile("./log.txt", "\n\n User command: node liri.js my-tweets " + argSearch +"\n\n",  (err) => {
        if (err) throw err;
    })
    var params = {
        screen_name: argSearch,
        count: 20
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) throw error;
        for (var i = 0; i < tweets.length; i++) {
            console.log(`
tweet ${(i+ 1)}:        ${tweets[i].text}
Created at :            ${tweets[i].created_at}
            `);
            fs.appendFile("./log.txt", `
tweet ${(i+ 1)}:        ${tweets[i].text}
Created at :            ${tweets[i].created_at}
\n\n
            =================================================
                            `, (err) => {
                if (err) throw err;
            })
        }
    });
}

function spotifyThisSong(){
    fs.appendFile("./log.txt", "\n\n User command: node liri.js spotify-this-song " + argSearch+"\n\n", (err) => {
        if (err) throw err;
    })
    if (argSearch === "") {
        spotify
            .search({
                type: 'track',
                query: "The Sign Ace of Base",
                limit: 1
            })
            .then(function (response) {
                let data = response.tracks.items[0];
                console.log(`
Artist(s):          ${data.artists[0].name}
Song Name:          ${data.name}
Preview Link:       ${data.external_urls.spotify}
Album:              ${data.album.name}
            `);
            fs.appendFile("./log.txt", `
Artist(s):          ${data.artists[0].name}
Song Name:          ${data.name}
Preview Link:       ${data.external_urls.spotify}
Album:              ${data.album.name}
            =======================================
            \n\n
                            `, (err)=>{
                                if(err) throw err;
                            })
            })
            .catch(function (err) {
                console.log(err);
            });
    } else {
        spotify
            .search({
                type: 'track',
                query: argSearch,
                limit: 1
            })
            .then(function (response) {
                let data = response.tracks.items[0];
                console.log(`
Artist(s):          ${data.artists[0].name}
Song Name:          ${data.name}
Preview Link:       ${data.external_urls.spotify}
Album:              ${data.album.name}
            `);
            fs.appendFile("./log.txt", `
Artist(s):          ${data.artists[0].name}
Song Name:          ${data.name}
Preview Link:       ${data.external_urls.spotify}
Album:              ${data.album.name}
            =======================================
            \n\n
                            `, (err)=>{
                                if(err) throw err;
                            })
            })
            .catch(function (err) {
                console.log(err);
            });
    }
};

function movieThis(){
    fs.appendFile("./log.txt", "\n\n User command: node liri.js movie-this " + argSearch+"\n\n", (err) =>{
        if(err) throw err;
    })
    if (argSearch === "") {
        request("http://www.omdbapi.com/?t=" + "Mr. Nobody." + "&y=&plot=short&apikey=c172e433")
            .then(e => {
                let data = JSON.parse(e);
                // console.log(data);
                console.log(`
Movie Title:                    ${data.Title}
Movie Year:                     ${data.Year}
Movie imdbRating:               ${data.imdbRating}
Movie Rotten Tomatoes Rating:   ${data.Ratings[1].Value}
Country:                        ${data.Country}
Language:                       ${data.Language}
Actors:                         ${data.Actors}
Movie Plot:                     ${data.Plot}
            `);
            fs.appendFile("./log.txt", `
Movie Title:                    ${data.Title}
Movie Year:                     ${data.Year}
Movie imdbRating:               ${data.imdbRating}
Movie Rotten Tomatoes Rating:   ${data.Ratings[1].Value}
Country:                        ${data.Country}
Language:                       ${data.Language}
Actors:                         ${data.Actors}
Movie Plot:                     ${data.Plot}
            =======================================
            \n\n
                            `, (err)=>{
                                if(err) throw err;
                            })
            })
    } else {
        request("http://www.omdbapi.com/?t=" + argSearch + "&y=&plot=short&apikey=c172e433")
            .then(e => {
                let data = JSON.parse(e);
                // console.log(data);
                console.log(`
Movie Title:                    ${data.Title}
Movie Year:                     ${data.Year}
Movie imdbRating:               ${data.imdbRating}
Movie Rotten Tomatoes Rating:   ${data.Ratings[1].Value}
Country:                        ${data.Country}
Language:                       ${data.Language}
Actors:                         ${data.Actors}
Movie Plot:                     ${data.Plot}
            `);
            fs.appendFile("./log.txt", `
Movie Title:                    ${data.Title}
Movie Year:                     ${data.Year}
Movie imdbRating:               ${data.imdbRating}
Movie Rotten Tomatoes Rating:   ${data.Ratings[1].Value}
Country:                        ${data.Country}
Language:                       ${data.Language}
Actors:                         ${data.Actors}
Movie Plot:                     ${data.Plot}
            =======================================
            \n\n
                            `, (err)=>{
                                if(err) throw err;
                            })
            })
    }

}

function doWhatItSays(){
    fs.appendFile("./log.txt", "\n\n User command: node liri.js do-what-it-says " + argSearch+"\n\n", (err) =>{
        if(err) throw err;
    })
    fs.readFile("./random.txt", "utf8")
        .then(data => {
            let Data = data.split(",");
            arg = Data[0];
            argSearch = Data[1];
            nodeLiri(arg, argSearch);
        })
        .catch(err => {
            console.log(err)
        });
}


function nodeLiri(arg, argSearch) {
    switch (arg) {
        case "my-tweets":

            // add twitter request and response here
            myTweets();
            break;

        case "spotify-this-song":
            // add spotify request and response here
            spotifyThisSong();
        break;

        case "movie-this":
            // add omdbi request and response here
            movieThis();
            break;

        case "do-what-it-says":
            // add fs.readFile to read random.txt here
            doWhatItSays();
            break;

        default:
            inquirer.prompt([{
                type: "list",
                message: "You must enter a command like this:",
                choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
                name: "userchoice"
            }]).then(answers => {
                if(answers.userchoice === "my-tweets"){
                    console.log('mytweets')
                    myTweets();
                } else if(answers.userchoice === "spotify-this-song"){
                    spotifyThisSong();
                }else if(answers.userchoice === "movie-this"){
                    movieThis();
                }else if(answers.userchoice === "do-what-it-says"){
                    doWhatItSays();
                }
            });
    };
};

nodeLiri(arg, argSearch);