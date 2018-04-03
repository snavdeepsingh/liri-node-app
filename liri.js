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
let arg1 = process.argv.splice(3).join("+");



function nodeLiri(arg, arg1) {
    switch (arg) {
        case "my-tweets":
            // add twitter request and response here
            var params = {
                screen_name: arg1,
                count: 20
            };
            client.get('statuses/user_timeline', params, function (error, tweets, response) {
                if (error) throw error;
                for (var i = 0; i < tweets.length; i++) {
                    console.log(`
    tweet ${(i+ 1)}:        ${tweets[i].text}
    Created at :            ${tweets[i].created_at} 
                    `);

                }
            });
            break;

        case "spotify-this-song":
            // add spotify request and response here
            spotify
                .search({
                    type: 'track',
                    query: arg1,
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
                })
                .catch(function (err) {
                    console.log(err);
                });
            break;

        case "movie-this":
            // add omdbi request and response here
            request("http://www.omdbapi.com/?t=" + arg1 + "&y=&plot=short&apikey=c172e433")
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
                })
            break;

        case "do-what-it-says":
            // add fs.readFile to read random.txt here
            fs.readFile("random.txt", "utf8")
                .then(data => {
                    let Data = data.split(",");
                    arg = Data[0];
                    arg1 = Data[1];
                    nodeLiri(arg, arg1);
                })
                .catch(err => {
                    console.log(err)
                });
            break;

        default:
            inquirer.prompt([{
                type: "list",
                message: "Choose a command:",
                choices: ["node liri my-tweets ", "spotify-this-song", "movie-this", "do-what-it-says"],
                name: "userchoice"
            }]).then(answers => {
                console.log(answers)
            });
    };
};

nodeLiri(arg, arg1);