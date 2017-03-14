$(document).ready(function() {


    $("#moodDiv").hide();
    // $(window).scroll(function() {

    //     var previousScroll = 0;
    //     var currentScroll = $(this).scrollTop();
    //     if (currentScroll > previousScroll) {
    //         document.getElementById("body").style.backgroundColor = "SlateGray";

    //     } else {
    //         document.getElementById("body").style.backgroundColor = "LightGray";

    //     }
    //     previousScroll = currentScroll;
    // });

    //gradient

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



    $(".btn-warning").on("click", function() {
        $("#emotions").effect("clip", 300, callback);
        $("#moodDiv").delay(1250).show("clip", 505);

        function callback() {

            setTimeout(function() {

                $("#emotions").removeAttr("style").hide().fadeIn();
            }, 1000);
        };



        $("html,body").delay(500).animate({ scrollTop: $("#page2").offset().top }, 1400);
        $("#moodDiv").empty();
        $("#moodDiv").append(this.getAttribute("data-emo"));

        switch (this.getAttribute("data-emo")) {


            case "Puzzled":
            case "Overwhelmed":
            case "Frustrated":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/16/18/58/texture-2072133_960_720.png')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/16/18/34/desktop-2072063_960_720.png')");
                $("#playerLayer").css("backgroundColor", "SandyBrown");
                $("#suggestionsLayer").css("backgroundColor", "midnightBlue");
                $("#suggestions").css("borderColor","#330000");
                $("#player").css("borderColor","##330000");
                $("#page2").css("backgroundColor", "#4d0000");
                console.log("working");


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

                console.log("working");


                console.log("working");

                break;


            case "Determined":
            case "Productive":
            case "Studious":
            case "Accomplished":

                console.log("working!!");
                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2016/11/22/23/49/bright-1851267__340.jpg')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2016/11/23/13/46/abstract-1852931__340.jpg')");
                $("#page2").css("backgroundColor", "beige");
                break;


            case "Zen":
            case "Uplifted":
            case "Dreamy":
                console.log("working");

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2016/12/17/19/05/background-1914145_960_720.jpg')");
                $("#playerLayer").css("backgroundColor", "Violet");
                $("#suggestionsLayer").css("backgroundColor", "YellowGreen");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2016/11/29/04/42/color-1867371_960_720.jpg')");
                $("#page2").css("backgroundColor", "#d1e0b8");
                break;

            case "Morose":
            case "Emo":

                console.log("working");

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
                console.log("working!");
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

                console.log("working");

                break;

            case "Blissful":
            case "Jubilant":
            case "Playful":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2012/03/02/11/06/abstract-21118__340.jpg')");
                // $("#playerLayer").css("backgroundColor", "lightGray");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2016/11/06/10/05/wood-1802625__340.jpg')");
                $("#page2").css("backgroundColor", "#fff4b3");
                console.log("working");

                break;

            case "Political":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2017/03/01/16/43/fabric-2109038__340.jpg')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2017/03/01/16/43/fabric-2109038__340.jpg')");
                $("#page2").css("backgroundColor", "lightGray");
                console.log("working");

                break;

            case "Possessed":

                console.log("working");

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/26/00/24/colorful-2099189_960_720.png')");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2017/02/26/00/24/colorful-2099189_960_720.png'");
                $("#playerLayer").css("backgroundColor", "lightGray");
                $("#suggestionsLayer").css("backgroundColor", "lightGray");
                $("#playerLayer").css("borderColor", "black");
                $("#suggestionsLayer").css("borderColor", "black");
                $("#page2").css("backgroundColor", "beige");


                break;

            case "Lit":

                console.log("working");

                break;

            case "Swole":
            case "Pumped":

                $("#player").css("background-image", "url('https://cdn.pixabay.com/photo/2016/05/16/15/38/texture-1395979__340.jpg')");
                $("#playerLayer").css("backgroundColor", "peru");
                $("#suggestionsLayer").css("backgroundColor", "lightGray");
                $("#suggestions").css("background-image", "url('https://cdn.pixabay.com/photo/2015/06/30/21/06/grid-826831__340.jpg')");
                $("#page2").css("backgroundColor", "beige");
                console.log("working");

                break;




        };

    });






    $(".btn-primary").on("click", function() {

        $("html,body").animate({ scrollTop: $("#welcome").offset().top }, 500);
        $("#moodDiv").hide();



    });

});




//document on ready
