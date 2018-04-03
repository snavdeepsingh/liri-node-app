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
                    console.log("\n", "tweet", (i + 1), ": ", tweets[i].text, "\n", "Created at: ", tweets[i].created_at, "\n");
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
                    console.log("\n", "Artist(s): ", data.artists[0].name, "\n", "Song Name: ", data.name, "\n", "Preview Link: ", data.external_urls.spotify, "\n", "Album: ", data.album.name, "\n");
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
                    console.log("\n", "Movie Title: ", data.Title, "\n", "Movie Year: ", data.Year, "\n", "Movie imdbRating: ", data.imdbRating, "\n", "Movie Rotten Tomatoes Rating: ", data.Ratings[1].Value, "\n", "Country: ", data.Country, "\n", "Language: ", data.Language, "\n", "Movie Plot: ", data.Plot, "\n", "Actors: ", data.Actors);
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