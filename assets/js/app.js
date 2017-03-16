// Global variables
//=====================================================

var widgetWidth = "100%";
var widgetHeight = 385;
var widgetUrl = "https://embed.spotify.com/?uri=spotify:user:";
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
var thinArr = ["Atash"]; //global placeholder for thinned out array of artists
var inTownEvents = [];
var userCity = '';

// Functions
//===============================================
$(document).ready(function() {

    $("#app-login").hide()
    $("#app-main").hide();
    $("#emotions").hide();
    $("#btn-current-feeling").hide();
    $("#music").hide();

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
                console.log("HEY DUMDUM, you missed feeling #" + i);
            }
            $("#emotions").append(a);
        }
    };

    renderButtons();

    $("#btn-auth").click(function() {
        $("#app-intro").hide();
        $("#app-login").show();
    });

    $("#add-city").click(function() {
        $("#app-main").show();
        $("#welcome").show();
        $("#emotions").show();
    });

$("#btn-current-feeling").click(function(){
    $(this).hide();
    $("#music").hide();
    $("#emotions").show();
});
    $(".btn-feeling").click(function() {
        $("#playlist-items").empty();
        $("#emotions").hide();
        $("#music").show();
        artists = [];
        currentFeeling = $(this).attr("data-emo");
        var currentFeelingStyle = $(this).attr("class");
        var listArr = []
        var queryUrl = "https://api.spotify.com/v1/search?q=" + currentFeeling + "&type=playlist";

        $("#btn-current-feeling").text(currentFeeling);
        $("#btn-current-feeling").attr("class", currentFeelingStyle);
        $("#btn-current-feeling").show();

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).done(function(response) {
            results = response.playlists.items;
            console.log("SPOTIFY SEARCH, BTN-FEELING ONCLICK - - - - - - - - - - - - - - - - - - -");
            console.log(results);
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");

            for (var i = 0; i < results.length; i++) {
                playlistDiv = $("<div>")
                pName = $("<p>");
                pName.text("Playlist Name: " + results[i].name);
                pHref = $("<p>");
                pHref.text("External Href from Object: " + results[i].external_urls.spotify)
                playlistDiv.append(pName);
                playlistDiv.append(pHref);
                playlistDiv.addClass("playlistDiv");
                $("#playlist-items").append(playlistDiv);
            } // end of for loop

            var listMin = 0;
            var listMax = results.length;

            function pickList(min, max) {
                var i = parseInt(Math.random() * (max - min) + min);
                var currentListName = results[i].name;
                var currentListID = results[i].id;
                var currentListUser = results[i].uri;
                var currentListUserId = currentListUser.match("user:(.*):playlist");
                var widgetSrc = widgetUrl + currentListUserId[1] + ":playlist:" + currentListID; // build url
                console.log("pickList(): PLAYLIST INFO  //  random list: " + i + ", name: " + currentListName + ", id: " + currentListID);
                console.log("pickList(): PLAYLIST OWNER INFO  //  currentListUser: " + currentListUser + ", currentListUserId: " + currentListUserId[1]);

                $("#playlist-items").append(currentListName);

                var widget = $("<iframe>");
                widget.attr({
                    "id": "spotify-widget",
                    "width": widgetWidth, // see global variables
                    "height": widgetHeight, // see global variables
                    "frameborder": 0,
                    "allowtransparency": "true",
                    "src": widgetSrc
                });
                $("#widget-container").html(widget);
            }

            pickList(listMin, listMax); // select a playlist at random from the search results
            grabArtist("BULLSHIT");
            searchShows(thinArr);

        }); // end of done function response

        $("#moodDiv").empty();
        $("#moodDiv").append(this.getAttribute("data-emo"));
        $("#playlist-items").empty();
    });


    //City gathering
    function cityLaunch(e) {
        e.preventDefault();
        //set the user city
        userCity = $('#city').val().trim();
        //hide the login screen (you can animate this)
        $('#app-login').hide()
            //show the selection screen
        $('#app-main').show();
        $("#new-log-in").hide();
        //can set this up anywhere
    }

    function genPlaylists(e) {
        e.preventDefault();
        $("#playlist-items").empty();
        //JN: topic should be OK to be locally scoped
        var topic = $(this).attr("data-emo");
        var limit = 5 //Set Max results -> Could be an option FEATURE
        var queryUrl = "https://api.spotify.com/v1/search?q=" + topic + "&type=playlist&limit=" + limit;
        $.ajax({
            url: queryUrl,
            // headers: { "Authorization": "Bearer " + "BQBVgnFxqm_8fUIR3uRjY5KZTL85HDbuM34jCM8_Sr7W51L8DphLMCNP76c4h_z294Tez3Iz6OerYYbxigMOBDRcOhS5arxkXjxm7j8xEtKrEiMFjHQMPL7GmvBP__JwLyoIuouUD6_0o66TvAb1Upkt7tV4HCwL-C9k"},
            method: "GET"
        }).done(function(response) {
            results = response.playlists.items;
            console.log("SPOTIFY RESULTS #2 FROM genPlaylists - - - - - - - - - - - - - - - - - - - - - - - -");
            console.log(results);

            for (var i = 0; i < results.length; i++) {
                playlistDiv = $("<div>");
                $(playlistDiv).attr({
                    'data-href': results[i].tracks.href,
                    'data-uri': results[i].uri
                });
                pName = $("<p>");
                pName.text("Playlist Name: " + results[i].name);

                playlistDiv.append(pName);

                playlistDiv.addClass("playlistDiv");
                $("#playlist-items").append(playlistDiv);
            } // end of for loop

        }); // end of done function response
    }

    //Events
    $('#add-city').on('click', cityLaunch);

    function reupSpotify() {
        $('.modal').addClass('activate');
    }

    //THIS FUNCTION GRABS INFO FROM RETURNED LISTING
    //I'M SCARED OF IT
    function grabArtist(url) {
        console.log("grabArtist(url): " + url);
        $.ajax({
            context: this,
            url: url,
            headers: { "Authorization": "Bearer " + access_token },
            method: "GET"
        }).done(function(response) {
            for (i = 0; i < response.items.length; i++) {
                var artist = response.items[i].track.artists[0].name;
                artists.push(artist);
                //removing duplicates
                console.log(artist);
                $.each(artists, function(i, el) {
                    if ($.inArray(el, thinArr) === -1) thinArr.push(el);
                });
            }

        }).fail(function(jqXHR) {
            //reupSpotify();
        });
    }

    function searchShows(arr) {
        $('#artist-events').empty();
        $('#artist-events').append('<h3>Upcoming Shows in ' + userCity + '</h3>');
        //looping over thinned out artist array
        for (i = 0; i < arr.length; i++) {
            var queryUrl = "https://rest.bandsintown.com/artists/" + arr[i] + "/events?app_id=MoodMash"; // to add date range format is "&date=2017-03-01,2017-12-31";
            $.ajax({
                url: queryUrl,
                method: "GET"
            }).done(function(response) {
                eventListings = response;
                console.log("EVENT LISTINGS - - - - - - - - - - - - - - - - - - - -");
                console.log(eventListings);
                for (i = 0; i < eventListings.length; i++) {
                    if (eventListings[i].venue.city === userCity) {
                        var artistName = eventListings[i].lineup[0];
                        var convertedDate = moment(eventListings[i].datetime).format("MM/DD/YY" + ", " + "hh:mmA");
                        var venue = eventListings[i].venue.name;
                        var artistDiv = $('<div class="event-div">');
                        //JN: May want to structure this more
                        $(artistDiv).append('<div>' + artistName + '</div><div>' + venue + '</div><div>' + convertedDate + '</div>');
                        $('#artist-events').append(artistDiv);
                    }
                    // this always shows because else doesn't go with for.
                    /*
                    else {
                        $('#artist-events').append('<div>Sorry! No bands on this playlist are coming to your town!</div>')
                    }
                    */
                    for (var i = 0; i < eventListings.length; i++) {
                        var convertedDate = moment(eventListings[i].datetime).format("MM/DD/YY" + ", " + "hh:mm");
                        eventDiv = $("<div>");
                        eventDiv.addClass("well well-sm");
                        pDate = $("<p>");
                        pVenue = $("<p>");
                        pCity = $("<p>");
                        pCoordinates = $("<p>");
                        pDate.text(convertedDate);
                        pVenue.text(artistName + " is playing at " + eventListings[i].venue.name);
                        pCity.text(eventListings[i].venue.city + ", " + eventListings[i].venue.region);
                        pCoordinates.text(eventListings[i].venue.latitude + " ,  " + eventListings[i].venue.longitude);
                        eventDiv.append(pDate, pVenue, pCity, pCoordinates);
                        $("#artist-events").append(eventDiv);
                    } // end of for loop
                }
            }); // end of done function
        }
    }

});
