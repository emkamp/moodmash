// ------------------------------------------------------ GLOBAL VARIABLES ------
//------------------------------------------------------------------------------

var widgetWidth = "100%";
var widgetHeight = 385;
var widgetUrl = "https://embed.spotify.com/?uri=";
var feelings = [
    "Productive",
    "Pumped",
    "Puzzled",
    "Exhausted",
    "Determined",
    "Touchy", // 5
    "Frustrated",
    "Chill",
    "Blissful",
    "Dreamy",
    "Playful", // 10
    "Lit",
    "Frisky",
    "Emo",
    "Overwhelmed",
    "Accomplished", // 15
    "Sleepy",
    "Studious",
    "Zen",
    "Morose",
    "Lazy"
]
var artists = []; //NOTE--this creates an empty array that populates with each mood click.  I'm not sure what our
var thinArr = []; //global placeholder for thinned out array of artists
var inTownEvents = [];
var userCity = '';
var genPlaylist = [];

// -----------------------------------------------------------------   UI  ------
// ------------------------------------------------------------------------------


function shift(class1, class2) {
    $("#shifty").addClass(class1);
    $("#shifty-layer").addClass(class2);

    window.setInterval(function() {
        $("#shifty-layer").fadeOut(3000).fadeIn(3000);
    }, 500);
}

shift("shifty-chill-1", "shifty-chill-2");

// ------------------------------------------------------------ FUNCTIONS ------
//------------------------------------------------------------------------------


function cityLaunch(e) {
    e.preventDefault();

    //set the user city
    userCity = $('#city').val().trim();
    $(".user-city").html(userCity);

    //hide the login screen (you can animate this)
    $('#app-login').hide()

    //show the selection screen
    $('#app-main').show();
    $("#new-log-in").hide();
}

function renderButtons() {
    $("#emotions").empty();
    for (var i = 0; i < feelings.length; i++) {
        var a = $("<button>");
        a.addClass("btn-feeling");
        a.attr("data-emo", feelings[i]);
        a.text(feelings[i]);
        if (i === 0 || i === 4 || i === 15 || i === 17) {
            a.addClass("btn-feeling-doing");
        } else if (i === 7 || i === 8 || i === 9 || i === 10 || i === 18) {
            a.addClass("btn-feeling-positive");
        } else if (i === 2 || i === 11 || i === 12) {
            a.addClass("btn-feeling-energy");
        } else if (i === 1 || i === 5 || i === 6 || i === 14) {
            a.addClass("btn-feeling-aggro");
        } else if (i === 3 || i === 13 || i === 16 || i === 19 || i === 20) {
            a.addClass("btn-feeling-low");
        } else {
            console.log("HEY DEVELOPER, you missed feeling #" + i);
        }
        $("#emotions").append(a);
    }
};

function genPlaylists(e) {
    e.preventDefault();
    //JN: topic should be OK to be locally scoped
    var topic = $(this).attr("data-emo");
    //console.log("genPlaylists: topic = " + topic);
    var limit = 5 //Set Max results -> Could be an option FEATURE
    var queryUrl = "https://api.spotify.com/v1/search?q=" + topic + "&type=playlist&limit=" + limit;
    $.ajax({
        context: this,
        url: queryUrl,
        headers: { "Authorization": "Bearer " + access_token },
        method: "GET"
    }).done(function(response) {
        results = response.playlists.items;
        //console.log("genPlaylists results -->");
        //console.log(results);
        var max = 5;
        var min = 1;
        var num = parseInt(Math.random() * (max - min) + min);
        genPlaylist = results[num];
        console.log("genPlaylist -->")
        console.log(genPlaylist);
        var href = genPlaylist.href;
        console.log("genPlaylist.href = " + href);
        var uri = genPlaylist.uri;
        //console.log("uri = " + uri);
        grabArtist(href);
        launchPlayer(uri, href);
    }); // end of done function response
}

function launchPlayer(uri, href) {
    var widget = $("<iframe>");
    var playlistUrl = href;
    var playlistUri = uri;

    widget.attr({
        "width": widgetWidth, // see global variables
        "height": widgetHeight, // see global variables
        "frameborder": 0,
        "allowtransparency": "true",
        "src": widgetUrl + playlistUri // build url
    });

    $("#widget-container").html(widget);
}


function reupSpotify() {
    $('.modal').addClass('activate');
}

function grabArtist(url) {
    console.log("grabArtist(url): " + url);
    $.ajax({
        context: this,
        url: url,
        headers: { "Authorization": "Bearer " + access_token },
        method: "GET"
    }).done(function(response) {
        console.log("grabArtist ajax call -->");
        console.log(response);
        for (i = 0; i < response.tracks.items.length; i++) {
            var artist = response.tracks.items[i].track.artists[0].name;
            artists.push(artist);
            //removing duplicates
            $.each(artists, function(i, el) {
                if ($.inArray(el, thinArr) === -1) thinArr.push(el);
            });
        }

    }).fail(function(jqXHR) {
        console.log('failing!');
        reupSpotify();
    });

    console.log("thinArr from grabArtist(): -->");
    console.log(thinArr);

    searchShows(thinArr);
}

function searchShows(arr) {
    console.log("searchShows has been called");
    console.log("What's the array in searchShows? -->");
    console.log(arr);
    console.log(" - - - - - - - - - - - - - - - - - -");
    $('#artist-events').append('<h4>Upcoming Shows in ' + userCity + '</h4>');

    var localEvents = []

    //looping over thinned out artist array
    for (i = 0; i < arr.length; i++) {
        var queryUrl = "https://rest.bandsintown.com/artists/" + arr[i] + "/events?app_id=MoodMash"; // to add date range format is "&date=2017-03-01,2017-12-31";

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).done(function(response) {
            eventListings = response;
            console.log("EVENT LISTINGS: EVERY SHOW FOR THESE ARTISTS - - - - - - - - - - - - - - - - - - - -");
            console.log("eventListings.length = " + eventListings.length);
            console.log(eventListings);

            for (i = 0; i < eventListings.length; i++) {

                if (eventListings[i].venue.city === userCity) {
                    var artistName = eventListings[i].lineup[0];
                    var convertedDate = moment(eventListings[i].datetime).format("MM/DD/YY" + ", " + "hh:mmA");
                    var venue = eventListings[i].venue.name;

                    console.log("searchShows: " + artistName + " @ " + venue + ", on " + convertedDate);

                    var eventArr = {
                        'artistName': artistName,
                        'convertedDate': convertedDate,
                        'venue': venue,
                    }

                    localEvents.push(eventArr);

                    if (localEvents.length > -1) {
                        $("#suggestions").show();
                        var artistDiv = $('<div class="event-div"><div class="btn-close pull-right"><i class="glyphicon glyphicon-remove"></i></div><div class="btn-save pull-right"><i class="glyphicon glyphicon-star"></i></div></div>');
                        $(artistDiv).append('<h4 class="event-artist">' + artistName + '</h4><p class="event-venue">' + venue + '</p><p class="event-date">' + convertedDate + '</p>');
                        $('#artist-events').append(artistDiv);
                    } else {}
                } else {}


                console.log("eventArr  = = = = = = >");
                console.log(eventArr);
                console.log("localEvents = = = = = >");
                console.log(localEvents);
            }

            // ------------------------------------------------------- Events Events ---
            // These need to be here and not events, because these elements do not exist on initial page load, they are created by this function.
            $(".btn-close").on('click', function() {
                $(this).closest(".event-div").slideUp(400, function() {
                    $(this).remove();
                });
                if ($('#artist-events').children().length < 3) {
                    setTimeout(500, noEvents());
                } else {}
                console.log("How many children does #artist-events have?");
                console.log($("#artist-events").children().length);
            });

            $(".btn-save").on('click', function() {
                $(this).toggleClass("btn-saved");
            });

        }); // end of done function
    }
}

function noEvents() {
    $("#suggestions").fadeOut();
}


// ------------------------------------------------------------------ EVENTS -----
//--------------------------------------------------------------------------------

$("#app-login").hide();
$("#app-main").hide();
$("#player").hide();
$("#suggestions").hide();
$("#city-mood").hide();
$("#btn-current-feeling").hide();

renderButtons();

$('#add-city').on('click', cityLaunch);
$('#emotions').on('click', '.btn-feeling', genPlaylists);

$(".btn-feeling").on("click", function() {

    $("#player").show();
    $("#city-mood").show();
    $("#emotions").hide();

    $("#artist-events").empty();

    var currentFeeling = $(this).attr("data-emo");
    var currentFeelingStyle = $(this).attr("class");
    $("#btn-current-feeling").text(currentFeeling);
    $("#btn-current-feeling").attr("class", currentFeelingStyle);
    $("#btn-current-feeling").show();

    //to change aurora background 
    console.log("currentFeelingStyle: ");
    console.log(currentFeelingStyle);
    var shiftClasses = currentFeelingStyle.split(" ");
    var shiftClassesSplit = shiftClasses[1].split("-");
    var shiftClass1 = "shifty-" + shiftClassesSplit[2] + "-1";
    var shiftClass2 = "shifty-" + shiftClassesSplit[2] + "-2";
    console.log("shiftClass1 = " + shiftClass1 + "  //  shiftClass2 = " + shiftClass2);

    shift(shiftClass1, shiftClass2);
    // end background change

    artists = [];
    topic = $(this).attr("data-emo");
    var listArr = [];
    var queryUrl = "https://api.spotify.com/v1/search?q=" + topic + "&type=playlist";

    $("#moodDiv").empty();
    $("#moodDiv").append(this.getAttribute("data-emo"));
    $("#playlist-items").empty();

    //TH NOTE- BEGINNING of Firebase stuff
    var moodRef = firebase.database();
    var mood = this.getAttribute("data-emo");

    moodRef.ref().push({
        city: userCity,
        userMood: mood
    }); // end of moodRef push

    moodRef.ref().orderByChild('city').equalTo(userCity).limitToLast(3).on('child_added', function(snapshot) {
        var currentCity = snapshot.val().city;
        var cityMood = (snapshot.val().userMood + " | "); // TH note--all that empty space is to put space between words. I'm sure there's a more elgant way but going for quick and dirty
        $("#recent-moods").html(cityMood);
    });
    //TH NOTE --end of firebase stuff
});

// ------------------------------------------------ Select a new feeling ---

$("#btn-current-feeling").on('click', function() {
    //thinArr = [];
    localEvents = [];
    $(this).hide();
    $("#player").hide();
    $("#suggestions").hide();
    $("#recent-moods").hide();
    $("#emotions").show();
    $("#artist-events").empty();
    $("#city-mood").hide();
});


// ------------------------------------------------------------ FIREBASE -------
//------------------------------------------------------------------------------

//NOTE--TH:  I've changed the firebase database to one in my own account so I can see what's happening
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBqVF2q_52BDrEYtc0QNmd6u_3kaKjNotA",
    authDomain: "moodmash-9186e.firebaseapp.com",
    databaseURL: "https://moodmash-9186e.firebaseio.com",
    storageBucket: "moodmash-9186e.appspot.com",
    messagingSenderId: "37101892502"
};
firebase.initializeApp(config);
//END of TH Firebase config stuff

//initialize the database
var database = firebase.database();

//set a ref to child -> moods
var btnRef = database.ref('moodList');

//click counter set to 0 globally ... within the click function reset it to the value being targeted
var clickCounter = 0;

//this function takes clicked element and adds ref/key to datatbase AND SHOULD UPDATE THE TIMES CLICKED
function countClicks(e) {
    e.preventDefault();
}

$("#item-buttons").on("click", ".topic-item", countClicks);

//THIS GETS THE ACCESS TOKEN DURING SESSION
function getTokenFromServer() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

//RENDER TOKEN
var token = getTokenFromServer();
var access_token = token.access_token;

//check if you got that token!
function tokenCheck() {
    //this function should run on page refresh!
    if (jQuery.isEmptyObject(token)) {
        //you are NOT authorized and can't use the app!
        return;
    } else {
        //will launch the next window
        $('#app-intro').hide();
        $('#app-login').show();
    }
}

$(document).ready(function() {
    tokenCheck();
});
