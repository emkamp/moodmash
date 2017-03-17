// Global variables
//=====================================================

var widgetWidth = "100%";
var widgetHeight = 385;
//JN: Shortening this widgetURL b/c the spotify object returns the string needed (there was some unneccessary string manipulation happening)
//This change is for launchPlayer function returning the URI in data-attr
var widgetUrl = "https://embed.spotify.com/?uri=spotify:user:";
var artists = []; //NOTE--this creates an empty array that populates with each mood click.  I'm not sure what our
var thinArr = []; //global placeholder for thinned out array of artists
var inTownEvents = [];
//end plan is for selection/displaying the actual B.I.T. info so creating this as one option
var userCity = '';

$(document).ready(function() {

    $("#moodDiv").hide();

    // ------------------------------------------------------------ FUNCTIONS ------
    //------------------------------------------------------------------------------

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

    function pickList(min, max) {
        var i = parseInt(Math.random() * (max - min) + min);
        var currentListName = results[i].name;
        var currentListID = results[i].id;
        var currentListUser = results[i].uri;
        var currentListUserId = currentListUser.match("user:(.*):playlist");
        //JN: check the building of this widget URL with global VAR
        var widgetSrc = widgetUrl + currentListUserId[1] + ":playlist:" + currentListID; // build url
        console.log("pickList(): PLAYLIST INFO  //  random list: " + i + ", name: " + currentListName + ", id: " + currentListID);
        //console.log("pickList(): PLAYLIST OWNER INFO  //  currentListUser: " + currentListUser + ", currentListUserId: " + currentListUserId[1]);

        var href = results[i].tracks.href;
        var uri = results[i].tracks.uri;

        grabArtist(href);

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
        searchShows(thinArr);
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
            for (i = 0; i < response.items.length; i++) {
                var artist = response.items[i].track.artists[0].name;
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
        console.log("thinArr from grabArtist(): - - - - - - - - -");
        console.log(thinArr);
    }

    function searchShows(arr) {
        console.log("searchShows has been called");
        console.log("What's the array in searchShows? -->");
        console.log(arr);
        $('#artist-events').empty();
        $('#artist-events').append('<h3>Upcoming Shows in ' + userCity + '</h3>');
        console.log("searchShows i is: " + arr[i]);

        //looping over thinned out artist array
        for (i = 0; i < arr.length; i++) {
            console.log("We are inside searchShows for loop on item #" + i);
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

    // ------------------------------------------------------------ CLICK EVENTS -----
    //--------------------------------------------------------------------------------

    $('#add-city').on('click', cityLaunch);

    $(".btn-warning").on("click", function() {

        $("#playlist-items").empty();
        artists = [];
        topic = $(this).attr("data-name");
        var listArr = [];
        // leaving this as playlist instead of artist because jason got the spotify authorization
        var queryUrl = "https://api.spotify.com/v1/search?q=" + topic + "&type=playlist";

        $.ajax({
            url: queryUrl,
            //headers: { "Authorization": "Bearer " + "BQBVgnFxqm_8fUIR3uRjY5KZTL85HDbuM34jCM8_Sr7W51L8DphLMCNP76c4h_z294Tez3Iz6OerYYbxigMOBDRcOhS5arxkXjxm7j8xEtKrEiMFjHQMPL7GmvBP__JwLyoIuouUD6_0o66TvAb1Upkt7tV4HCwL-C9k"},
            method: "GET"
        }).done(function(response) {
            results = response.playlists.items;
            console.log("SPOTIFY SEARCH, BTN-WARNING ONCLICK - - - - - - - - - - - - - - - - - - -");
            console.log(results);
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");

            var listMin = 0;
            var listMax = results.length;

            pickList(listMin, listMax); // select a playlist at random from the search results
        }); // end of done function response

        $("#moodDiv").empty();
        $("#moodDiv").append(this.getAttribute("data-emo"));
        $("#playlist-items").empty();
    });

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
