//Year range for slider display as an array. Set default values ​​for alues ​​for curtain, this must "think" with slider "
var years = [];
years[0] = config_array["diagram_min_year"];
years[1] = config_array["diagram_max_year"];

//Year range for slider display as an array. Set default values ​​for
var yearsSlider = [];
yearsSlider[0] = config_array["diagram_min_year"];
yearsSlider[1] = config_array["diagram_max_year"];

//values ​​for curtain, this must "think" with slider "
var offset = [];
offset[0] = 0.0;
offset[1] = 0.0;

//Array for annual values
var diagramData;

//Year range for slider display as an array. Set default values ​​for
var vorhangKonstante = 420;

//Prepare the year facet
function prepareYearFacet() {

    //Create yearly lids
    $("#year-slider").slider({
        //2 Handles
        range: true,
        //rom ... to
        min: config_array["diagram_min_year"],
        max: config_array["diagram_max_year"],
        //set initial values
        values: [config_array["diagram_min_year"], config_array["diagram_max_year"]],
        //Do not start the search query until value range has been selected
        stop: function (event, ui) {

            //it will no longer be clipped, set offset values ​​to 0
            offset[0] = 0.0;
            offset[1] = 0.0;

            //set the yearly label and curtain
            setYearRange();

            // is it worth seeing a new search query?
            var resultWillBeDifferent = false;

            //Was the left value changed? Only one handler can be moved
            if (years[0] !== ui.values[0]) {

                //start with a smaller value: before: 1910, then: 1920 -> 1910-1919 test (1920 continue in it), before: 1910, afterwards: 1900 -> 1900-1909 test (1910 continue in it)
                for (var i = Math.min(years[0], ui.values[0]); i < Math.max(years[0], ui.values[0]); i++) {

                    //If there is an Arraye entry (= year, quantity), it means that hit quantity changes
                    if ($.isArray(diagramData[i - config_array["diagram_min_year"]])) {

                        // new query required
                        resultWillBeDifferent = true;

                        //other data sets do not have to be checked
                        break;
                    }
                }
            }

            //the right value has been changed
            else {

                //start with a smaller value: before: 1980, afterwards: 1990 -> 1981-1990 test (1980 still in it), before: 1980, afterwards: 1970 -> 1971-1980 test (1970 still in it)
                for (i = Math.min(years[1], ui.values[1]) + 1; i <= Math.max(years[1], ui.values[1]); i++) {

                    //If there is an Arraye entry (= year, quantity), it means that hit quantity changes
                    if ($.isArray(diagramData[i - config_array["diagram_min_year"]])) {

                        //other data sets do not have to be checked
                        resultWillBeDifferent = true;

                        //andere Datensaetze muessen nicht mehr geprueft werden
                        break;
                    }
                }
            }

            //Set the date values ​​for the request
            years[0] = ui.values[0];
            years[1] = ui.values[1];

            //request only if result set will be different
            if (resultWillBeDifferent) {

                // Send search request
                sendQuery("facet_year_slide");
            }

            //Adapt the display in tab title
            setTabYear();
        },
        //ADisplay the current value range already during the move
        slide: function (event, ui) {

            //current slider values
            var left = ui.values[0];
            var right = ui.values[1];

            //Slide always hangs behind, so the forehand has to "think"
            offset[0] = 0.0;
            offset[1] = 0.0;

            //has the left bar been changed?
            if (left !== years[0]) {

                //was he pushed to the right or left?
                offset[0] = (left > years[0]) ? 3 : -3;
            }

            //has the right bar been changed?
            if (right !== years[1]) {

                //was he pushed right or left?
                offset[1] = (right > years[1]) ? 3 : -3;
            }

            // Set the date values ​​for sliders
            yearsSlider[0] = ui.values[0];
            yearsSlider[1] = ui.values[1];

            //Set the yearly label and curtain
            setYearRange();
        }
    });

    // Create curtains
    $("#year-slider").append("<div id='block-0'></div>");
    $("#year-slider").append("<div id='block-1'></div>");

    //Set the yearly label and curtain
    setYearRange();

    //Checkbox for search for titles without year with function
    $('#noYear').click(function () {

        //Check / uncheck the checkbox div
        $(this).find("div.tristate_checkbox").toggleClass("checked");

        //Send only if the click of the result would change (= there are titles without year)
        if (getFacetValues("py_all_facet")[0] > 0) {

            //Send search request
            sendQuery();
        }
    });
}

// Set the yearly label and curtain
function setYearRange() {

    //Always set the value and curtain for both handlers
    $.each($('#year-slider .ui-slider-handle'), function (i, val) {

        //Set the year
        $(this).html("<span id='year-" + i + "' class='showYear'>" + yearsSlider[i] + "</span>");

        //Move the distance from the handle from the left
        var value = $(this).css("left");

        //for Chrome, converts the value as a percentage -> to a pixel
        if (value.indexOf('%') > -1) {
            value = (parseFloat(value) * vorhangKonstante) / 100;
        }
        //else take the pixel value directly
        else {
            value = parseFloat(value);
        }

        //Distance from the left (1st slider = 0)
        var left = 0.0;

        //Width depends on offset (movement from left to right or right to left, curtain must "think")
        var width = value + offset[i];

        //different adaptations for the second curtain
        if (i === 1) {

            //Distance from left = latitude + offset
            left = width;

            //Width = Right outside - Distance from the left
            width = vorhangKonstante - left;
        }

        //Adjust the curtains
        $('#block-' + i).css("width", width);
        $('#block-' + i).css("left", left);
    });
}

//Write the time span in the tab header
function setTabYear() {

    //Label in color
    (years[0] !== config_array["diagram_min_year"] || years[1] !== config_array["diagram_max_year"]) ? $('div[data-facetname=year]').addClass("items_selected") : $('div[data-facetname=year]').removeClass("items_selected");
}

// Draw bar graph for year display and adjust title without year
function createYearFacet() {

    //Create diagram only if Tab is active, facet has not yet been created, and data are available (data undefined is the first structure)
    if (!$("div[data-tab='year_tab']").hasClass("content_created") && data !== undefined) {

        //save the content
        $("div[data-tab='year_tab']").addClass("content_created");

        //Array for annual values ​​and frequency
        diagramData = [];

        //How high does Digramm have to be?
        var maxCount = 0;

        //repeat the field over the field and read out the values
        $.each(getFacetValues("py_all_facet"), function (year, count) {

            //Collect values ​​and write in array, minyear as offset
            diagramData[year - config_array["diagram_min_year"]] = [year, count];

            //Calculate the graph height: However, do not depend on the "without" values
            if (count > maxCount && year !== "0") {
                maxCount = count;
            }
        });

        //Determine the number of ticks. Not more than 5
        var tickCount = Math.min(maxCount, 5);

        //v
        $.plot($("#diagram"),
                [{
                        data: diagramData
                    }], {
            series: {
                bars: {
                    show: true
                }
            },
            xaxis: {
                //allotment every x years
                ticks: (config_array["diagram_max_year"] - config_array["diagram_min_year"]) / config_array["diagram_every_x_years"],
                // Year from
                min: config_array["diagram_min_year"],
                // Year is always greater than the current year, so that Bar is displayed completely
                max: config_array["diagram_max_year"] + 1

            },
            yaxis: {
                //Number of strokes
                ticks: tickCount,
                //0 to 5 strokes
                min: 0,
                max: maxCount,
                //display only whole numbers
                tickDecimals: 0,
                //height and width of label
                labelWidth: 30,
                labelHeight: 15,
                //Increase speed on the left
                position: "left"
            },
            grid: {
                //Background: Color gradient from top to bottom
                backgroundColor: {
                    colors: ["#fff", '#fff']
                },
                //external framework
                borderWidth: 1
            }
        });

        //Update title without year
        setTitlesWithoutYearDisplay();
    }
}

//Update title without year
function setTitlesWithoutYearDisplay() {

    //How many titles have no year, if there is none (value = undefined) to 0.
    var count = (getFacetValues("py_all_facet")[0] !== undefined) ? getFacetValues("py_all_facet")[0] : 0;

    //Update display of hits without year
    $('#countYears').text(count);
}