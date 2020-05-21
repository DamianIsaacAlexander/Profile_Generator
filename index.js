const axios = require('axios');
const inquier = require('inquirer');
const pdf = require('html-pdf');
let options = {format: 'Letter', orientation: 'portrait'};

const questions = [{
    type: "input",
    name: "username",
    message: "Enter your GitHub username: ",
},
{
    type: "list",
    name: "color",
    message: "What is your favorite color?",
    choices: ["green", "blue", "pink", "red", "violet", "turquoise", "gray"],
}];

let userData = {
    name: "",
    location: "",
    userWebsite: "",
    gitUrl: "",
    repos: 0,
    following: 0,
    followers: 0,
    stars: 0,
    bio: "",
    userImg: "",
    favColor: ""
}



init();

function init()
{
    inquier.prompt(questions).then(function({username, color}){
        userData.favColor = color;
        const queryUrl = `https://api.github.com/users/${username}`;
        const queryStarsUrl = `https://api.github.com/users/${username}/repos`;
        axios.get(queryUrl).then(function(res)
        {
            if(res.data.name === null)
            {
                userData.name = res.data.login;
            }
            else
            {
                userData.name = res.data.name
            }
            if(res.data.location === null)
            {
                userData.location = "";
            }
            else
            {
                userData.location = res.data.location;
            }
            if(res.data.bio === null)
            {
                userData.bio = "Thank you!";
            }
            else
            {
                userData.location = res.data.bio;
            }
            userData.gitUrl = res.data.html_url;
            userData.followers = res.data.following;
            userData.following = res.data.followers;
            userData.userImg = res.data.avatar_url;
            userData.repos = res.data.public_repos;
            axios.get(queryStarsUrl).then(function(res){
                for(let i = 0; i < res.data.length; i++)
                {
                   userData.stars += res.data[i].stargazers_count;
                }
                generatePDF();
            });
        });
    });
  
}
function generatePDF()
{
    pdf.create(generateHTML(), options).toFile('./profile.pdf', function(err, res)
    {
        if (err) return console.log(err);
        console.log(res);
    });
}
function generateHTML()
{
    return `<!DOCTYPE html>

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Merriweather:400,700&display=swap" rel="stylesheet">
        <style>
    
            html, body
            {
                margin: 0;
                padding: 0;
            }
            html, #wrapper
            {
                height: 100%;
            }
            a
            {
                text-decoration: none;
                color: white;
            }
            body
            {
                background-color: ${userData.favColor};
                color: white;
                font-weight: 700;
                font-family: 'Merriweather';
            }
            .profile-img
            {
                position: relative;
                top: -50px;
                border-radius: 50%;
                height: 170px;
                border: solid 5px yellow;
            }
            #top-banner
            {
                z-index: 1;
                height: 320px;
                width: 95%;
                margin: 70px auto 0 auto;
                background-color: rgb(255, 131, 116);
                text-align: center;
                border-radius: 5px;
            }
            .top-banner-text
            {
                position: relative;
                top: -60px;
            }
            #top-banner ul li
            {
                display: inline;
                margin-right: 20px;
            }
            #lower-banner
            {
                z-index: -1;
                padding-top: 60px;
                position: relative;
                top: -50px;
                background-color: rgb(233, 237, 238);
                height: 400px;
                text-align: center;
            }
            .block
            {
                background-color: rgb(255, 131, 116);
                display: inline-block;
                width: 240px;
                margin: 15px;
                padding: 10px 30px;
                border-radius: 5px;
            }
            .numbers
            {
                font-size: 1.5rem;
            }
            #lower-banner h3
            {
                color: black;
            }
        </style>
    </head>
    
    <body>
        <div id="wrapper">
            <div id="top-banner">
                <img src="${userData.userImg}" class="profile-img alt="profile img">
                <div class="top-banner-text">
                    <h1>Hi!</h1>
                    <h1>My name is ${userData.name}!</h1>
                    <ul>
                        <li><a href="https://www.google.com/maps/place/${userData.location}" target="_blank">${userData.location}</a></li>
                        <li><a href="${userData.gitUrl}" target="_blank">GitHub</a></li>
                    </ul>
                </div>
            </div>
            <div id="lower-banner">
                <h3>${userData.bio}</h3>
                <div class="block">
                    <h2>Public Repositories</h2><span class="numbers">${userData.repos}</span>
                </div>
                <div class="block">
                    <h2>Followers</h2><span class="numbers">${userData.followers}</span>
                </div>
                <br>
                <div class="block">
                    <h2>GitHub Stars</h2><span class="numbers">${userData.stars}</span>
                </div>
                <div class="block">
                    <h2>Following</h2><span class="numbers">${userData.following}</span>
                </div>
            </div>
        </div>
    </body>
    
    </html>`;
}