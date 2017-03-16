// Global variables
//=====================================================

var widgetWidth = 710;
var widgetHeight = 385;
//JN: Shortening this widgetURL b/c the spotify object returns the string needed (there was some unneccessary string manipulation happening)
//This change is for launchPlayer function returning the URI in data-attr
var widgetUrl = "https://embed.spotify.com/?uri=spotify:user:";
var artists = []; //NOTE--this creates an empty array that populates with each mood click.  I'm not sure what our
var thinArr = ["Atash"]; //global placeholder for thinned out array of artists
var inTownEvents = [];
//end plan is for selection/displaying the actual B.I.T. info so creating this as one option

var userCity = '';

// Functions
//===============================================
$(document).ready(function() {

    // See note in global variables section regarding array.  Not sure what our design plan is for displaying the event info.
    // For now, to get our "proof of concept", I am just using an onclick event below for each artist name to pull from B.I.T.
    //JN: Migrating the concept of this function done into a separate function
    /*
    $("#playlist-items").on("click", ".artist-name", function() {
            var artistName = $(this).attr("data-name");
            $("#artist-events").empty();
            console.log(artistName)

            var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=MoodMash"; // to add date range format is "&date=2017-03-01,2017-12-31";
            $.ajax({
                    url: queryUrl,
                    method: "GET"
                }).done(function(response) {
                    eventListings = response;
                    console.log(eventListings);

                    for (var i = 0; i < eventListings.length; i++) {
                        var convertedDate = moment(eventListings[i].datetime).format("MM/DD/YY" + ", " + "hh:mm");
                        eventDiv = $("<div>");
                        eventDiv.addClass("well well-sm");
                        pDate = $("<p>");
                        pVenue = $("<p>");
                        pCity = $("<p>");
                        pCoordinates = $("<p>");
                        pDate.text(convertedDate);
                        pVenue.text(eventListings[i].venue.name);
                        pCity.text(eventListings[i].venue.city + ", " + eventListings[i].venue.region);
                        pCoordinates.text(eventListings[i].venue.latitude + " ,  " + eventListings[i].venue.longitude);
                        eventDiv.append(pDate, pVenue, pCity, pCoordinates);
                        $("#artist-events").append(eventDiv);
                    } // end of for loop
                }) // end of done function
        }) // end of onclick for getArtistEvents
	*/

    $("#moodDiv").hide();

    $(".btn-warning").on("click", function() {

        // -----------------------------------------------------------------------------------------------------------------
        // ------------------------------------------------------------------------------------ BEGIN UI

        switch (this.getAttribute("data-emo")) {

            case "Puzzled":
            case "Overwhelmed":
            case "Frustrated":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/16/18/58/texture-2072133_960_720.png')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/16/18/34/desktop-2072063_960_720.png')");
                $("#playerLayer").css("backgroundColor", "SandyBrown");
                $("#suggestionsLayer").css("backgroundColor", "midnightBlue");
                $("#suggestions").css("borderColor", "#330000");
                $("#player").css("borderColor", "##330000");
                $("#page2").css("backgroundColor", "#4d0000");
                break;

            case "Touchy":
            case "Worked Up":
            case "Hangry":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/23/18/54/sun-2092921__340.png')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2016/12/26/13/16/backgrounds-1932050__340.jpg')");
                $("#playerLayer").css("backgroundColor", "Thistle");
                $("#suggestionsLayer").css("backgroundColor", "Thistle");
                $("#playerLayer").css("borderColor", "black");
                $("#suggestionsLayer").css("borderColor", "black");
                $("#page2").css("backgroundColor", "#f2c6a6");
                break;

            case "Determined":
            case "Productive":
            case "Studious":
            case "Accomplished":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2016/11/22/23/49/bright-1851267__340.jpg')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2016/11/23/13/46/abstract-1852931__340.jpg')");
                $("#page2").css("backgroundColor", "beige");
                break;

            case "Zen":
            case "Uplifted":
            case "Dreamy":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2016/12/17/19/05/background-1914145_960_720.jpg')");
                $("#playerLayer").css("backgroundColor", "Violet");
                $("#suggestionsLayer").css("backgroundColor", "YellowGreen");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2016/11/29/04/42/color-1867371_960_720.jpg')");
                $("#page2").css("backgroundColor", "#d1e0b8");
                break;

            case "Morose":
            case "Emo":
                break;

            case "Sleepy":
            case "Exhausted":
            case "Washed":
            case "Lazy":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2016/12/26/09/41/bokeh-1931727_960_720.jpg')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/09/13/24/background-2051998__340.jpg')");
                $("#suggestionsLayer").css("backgroundColor", "PowderBlue");
                $("#suggestionsLayer").css("borderColor", "SlateGray");
                $("#playerLayer").css("backgroundColor", "SkyBlue");
                $("#playerLayer").css("borderColor", "SlateGray");
                $("#page2").css("backgroundColor", "#eafbfb");
                break;

            case "Frisky":
            case "Seductive":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2017/03/12/02/12/fractal-2136278__340.jpg')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2017/03/12/02/12/fractal-2136278__340.jpg')");
                $("#playerLayer").css("backgroundColor", "SaddleBrown");
                $("#suggestionsLayer").css("backgroundColor", "SaddleBrown");
                $("#page2").css("backgroundColor", "#5a2d0c");
                $("#suggestionsLayer").css("borderColor", "#2d1606");
                $("#playerLayer").css("borderColor", "#2d1606");
                $("#suggestions").css("borderColor", "#160b03");
                $("#player").css("borderColor", "#160b03");
                break;

            case "Blissful":
            case "Jubilant":
            case "Playful":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2012/03/02/11/06/abstract-21118__340.jpg')");
                // $("#playerLayer").css("backgroundColor", "lightGray");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2016/11/06/10/05/wood-1802625__340.jpg')");
                $("#page2").css("backgroundColor", "#fff4b3");
                break;

            case "Political":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2017/03/01/16/43/fabric-2109038__340.jpg')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2017/03/01/16/43/fabric-2109038__340.jpg')");
                $("#page2").css("backgroundColor", "lightGray");
                break;

            case "Possessed":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/26/00/24/colorful-2099189_960_720.png')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/26/00/24/colorful-2099189_960_720.png'");
                $("#playerLayer").css("backgroundColor", "lightGray");
                $("#suggestionsLayer").css("backgroundColor", "lightGray");
                $("#playerLayer").css("borderColor", "black");
                $("#suggestionsLayer").css("borderColor", "black");
                $("#page2").css("backgroundColor", "beige");
                break;

            case "Lit":
                break;

            case "Swole":
            case "Pumped":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2016/05/16/15/38/texture-1395979__340.jpg')");
                $("#playerLayer").css("backgroundColor", "peru");
                $("#suggestionsLayer").css("backgroundColor", "lightGray");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2015/06/30/21/06/grid-826831__340.jpg')");
                $("#page2").css("backgroundColor", "beige");
                break;

        } //end of switch statements in click events

        //Gradient
        var colors = new Array(
            [255, 228, 181], [238, 130, 238], [210, 105, 30], [25, 25, 112], [255, 228, 77], [95, 158, 160], [124, 252, 0], [191, 191, 191], [0, 0, 0], [255, 182, 193], [75, 0, 130], [255, 0, 0]);

        var step = 0;
        //color table indices for:
        // current color left
        // next color left
        // current color right
        // next color right
        var colorIndices = [0, 1, 2, 3];

        //transition speed
        var gradientSpeed = 0.0015;

        function updateGradient() {

            if ($ === undefined) return;

            var c0_0 = colors[colorIndices[0]];
            var c0_1 = colors[colorIndices[1]];
            var c1_0 = colors[colorIndices[2]];
            var c1_1 = colors[colorIndices[3]];

            var istep = 1 - step;
            var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
            var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
            var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
            var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

            var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
            var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
            var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
            var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

            $('#gradient').css({
                background: "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))"
            }).css({
                background: "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)"
            });

            step += gradientSpeed;
            if (step >= 1) {
                step %= 1;
                colorIndices[0] = colorIndices[1];
                colorIndices[2] = colorIndices[3];

                //pick two new target color indices
                //do not pick the same as the current one
                colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
                colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
            }
        }

        setInterval(updateGradient, 10);
        //END OF GRADIENT

        $("html,body").delay(500).animate({ scrollTop: $("#page2").offset().top }, 1400);

        // -----------------------------------------------------------------------------------------------------------------
        // -------------------------------------------------------------------------- END UI


        $("#emotions").effect("clip", 300, callback);
        $("#moodDiv").delay(1250).show("clip", 505);

        function callback() {
            setTimeout(function() {
                $("#emotions").removeAttr("style").hide().fadeIn();
            }, 1000);
        };

        $("#playlist-items").empty();
        artists = [];
        topic = $(this).attr("data-name");
        var listArr = []
            // leaving this as playlist instead of artist because jason got the spotify authorization
        var queryUrl = "https://api.spotify.com/v1/search?q=" + topic + "&type=playlist";

        $.ajax({
            url: queryUrl,
            //headers: { "Authorization": "Bearer " + "BQBVgnFxqm_8fUIR3uRjY5KZTL85HDbuM34jCM8_Sr7W51L8DphLMCNP76c4h_z294Tez3Iz6OerYYbxigMOBDRcOhS5arxkXjxm7j8xEtKrEiMFjHQMPL7GmvBP__JwLyoIuouUD6_0o66TvAb1Upkt7tV4HCwL-C9k"},
            method: "GET"
        }).done(function(response) {
            results = response.playlists.items;
            console.log("SPOTIFY SEARCH #3, BTN-WARNING ONCLICK - - - - - - - - - - - - - - - - - - -");
            console.log(results);
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");

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

    $(".btn-primary").on("click", function() {
        $("html,body").animate({ scrollTop: $("#welcome").offset().top }, 500);
        $("#moodDiv").hide();
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
        //$('.modal').addClass('activate');
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
            reupSpotify();
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

    //firebased god
    var config = {
        apiKey: "AIzaSyCJWSKJq1r2_Fyu9hk8NdNFXWV1PAmgLXU",
        authDomain: "mood-mash-userbase.firebaseapp.com",
        databaseURL: "https://mood-mash-userbase.firebaseio.com",
        storageBucket: "mood-mash-userbase.appspot.com",
        messagingSenderId: "1081624019575"
    };
    firebase.initializeApp(config);

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
    //check to see if exists and set the clickCounter
    // database.ref().on('value',function(snap){
    //   if (snap.child('moodItem').exists()) {
    //     clickCount = snap.child('clickNum').val();
    //     console.log(clickCounter);
    //   }
    //   else {
    //     console.log('nope');
    //   }
    // });
    //
    // var mood = $(this).attr('data-name');
    // console.log(moodData);
    //check to see if the mood exists when value changes
    // database.on('value',function(snapshot) {
    //   //setting a moodExists varialble
    //   var moodExists = snapshot.exists();
    //   console.log(snapshot);
    //   //if mood exists get the current click count value -> update the click counter
    //   if (moodExists) {
    //     console.log('already added!');
    //   }
    //   else {
    //     console.log('adding now');
    // database.ref().push({
    //   moodItem: mood,
    //   clickNum: clickCounter
    // });
    //   }
    // });
    // var moodExists =
    // var mood = $(this).attr('data-name');
    // moodChild.push({
    //   moodBtn: mood
    //
    // //if child exists return -> else set value in database
    // if(database.child('mood').exists()) {
    //   console.log('already added!');
    // }
    // else {
    //   console.log('adding this!');
    //   moodChild.set({
    //     moodBtn: mood
    //   });
    //   clickCount++;
    //   var moodCount = moodChild.ref().child('clicksCounted');
    //   moodCount.update({
    //     clicksCounted: clickCount
    //   });
    // }

    // On Click of Button
    $("#item-buttons").on("click", ".topic-item", countClicks);

    // MAIN PROCESS + INITIAL CODE
    // --------------------------------------------------------------------------------

    // Using .on("value", function(snapshot)) syntax will retrieve the data
    // from the database (both initially and every time something changes)
    // This will then store the data inside the variable "snapshot". We could rename "snapshot" to anything.
    //value is an event from firebase
    // database.ref().on("value", function(snapshot) {
    //   if(snapshot.child().exists()) {
    //   // Then we console.log the value of snapshot
    //   console.log(snapshot.val());
    //
    //   // Then we change the html associated with the number.
    //   // $("#click-value").html(snapshot.val().clickCount);
    //
    //   // Then update the clickCounter variable with data from the database.
    //   // clickCounter = snapshot.val().clickCount;
    //
    // // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
    // // Again we could have named errorObject anything we wanted.
    // }, function(errorObject) {
    //

    //   // In case of error this will print the error
    //   console.log("The read failed: " + errorObject.code);
    // });

    tokenCheck();
});
