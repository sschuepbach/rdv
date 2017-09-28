//To Begin no column for sorting in color
var sortPos = 0;

//Save additional information, which was once brought by Ajax
var addInfoArray = new Object;

//current page
var currentPage = 1;

//last page
var maxPage;

//Prepare display tables
function prepareTables() {

    //Hide search mask
    $('#hide_search').click(function () {

        //Hide search and facet area
        $('#search').toggle();

        //Customize CSS classes so that correct font is displayed and the hit list is displayed larger
        $('#hide_search').toggleClass("invisible");
        $('#results').toggleClass("invisible_search_block");
    });

    //pagination with function
    $('.pagination').on("click", " .clickable", function () {

        //Leaf direction -1 / + 1
        var dir = $(this).data("dir");

        //Load the next or previous page
        currentPage += dir;

        //Calculate the offset
        startAt = (currentPage - 1) * displayRows;

        //pager request, so the current startAt value is taken
        sendQuery("page");

        //Scroll to the top of the table after scrolling
        $(window).scrollTop(0);
    });

    //Sorting by clicking on heading in result table
    $('#result .table_header div[data-field]').click(function () {

        //Is sorting already sorted by this column?
        if ($(this).hasClass("sort_asc")) {

            //Change sorting sequence
            sortDirection = "desc";

            //Customize CSS classes
            $(this).removeClass("sort_asc");
            $(this).addClass("sort_desc");
        }

        // Change sorting sequence
        else {

            // Read out the sort field and set the sort order
            sortField = $(this).data("field");
            sortDirection = "asc";

            //Remove CSS classes from other neighbors
            $(this).parent().children().removeClass('sort_asc');
            $(this).parent().children().removeClass('sort_desc');

            //Set CSS class for heading again
            $(this).addClass("sort_asc");
        }

        //If there is no cell for displaying additional information, the number of the column is different 
        //(important for sorting the sort)
        var sort_display_offset = has_feature("no_more") ? 0 : 1;

        //after rebuilding the table divs in sorting columns color
        sortPos = $(this).data("pos") + sort_display_offset;

        //Set the sort field
        sortBy = sortField + " " + sortDirection;

        //If further sorting criteria is set in the Config
        if (config_array["second_sort"] !== undefined) {

            // use these criteria
            sortBy += "," + (config_array["second_sort"]).join(",");
        }

        //Send search request
        sendQuery("sort");
    });

    //Click on More button
    $('.table_body').on("click", "div[data-func='more']", function () {

        // Set the color for the border of the table
        if (config_array["table_border"] === undefined) {
            // Default value
            table_border = "1px solid grey";
        } else {
            // Otherwise from the configuration
            table_border = config_array["table_border"];
        }

        // When info is closed
        if ($(this).hasClass("closed")) {

            //Customize the CSS image
            $(this).removeClass("closed");

            //Read the document ID (via .attr, because .data leading zeros removed
            var docID = $(this).parent().attr("data-id");

            //If data has already been buffered
            if (addInfoArray[docID] !== undefined) {

                //insert intermediate content
                $(this).parent().after("<div class='addInfo'><div class='no_border more'></div><div class='add_content'>" + addInfoArray[docID] + "</div></div>");
            }

            //Data not yet saved
            else {

                //Get data by Ajax request
                $.ajax({
                    type: 'POST',
                    url: 'php/utils/solr_proxy.php',
                    beforeSend: function () {

                        //Show load image
                        $(this).addClass('loadingData');
                    },
                    context: this,
                    data: {
                        query: "id:" + docID,
                        mode: 'extra_data'
                    },
                    dataType: 'json',
                    success: function (responseData) {

                        //Prepare data in the appropriate format
                        var prep = prepare_extra_data(responseData.response.docs[0]);

                        //Insert content
                        $(this).parent().after("<div class='addInfo'><div class='no_border more'></div><div class='add_content'>" + prep + "</div></div>");

                        //Save the value so that it does not need to be retrieved the next time
                        addInfoArray[docID] = prep;

                        //Remove the charge image
                        $(this).removeClass('loadingData');
                    }
                });
            }

            //Set the border blue to blue so that the line looks like an integrated line
            $(this).css("border-bottom", "1px solid #D7EAF7");
        }

        //line is opened
        else {

            //Customize the CSS image
            $(this).addClass("closed");

            //emove the info line
            $(this).parent().next('.addInfo').remove();

            //Border down gray again
            $(this).css("border-bottom", table_border);
        }
    });

    //Close additional line by clicking on the lower, left area of ​​the new line
    $(".table_body").on("click", "div.no_border", function () {

        //Table up to the div climb, previous div take, 1st child take and click trigger execute
        $(this).parent().prev().children().eq(0).trigger("click");
    });

    //Is the Merkliste active?
    if (has_feature("basket")) {

        //Prepare the Merkliste
        prepareBasket();

        //Assign function to the function key
        $('.table_body').on("click", "div[data-func='remember']", function () {

            //Memorize or delete the title
            rememberTitle(this);
        });
    }
}

// Display results in table
function createResultTable() {

    //Number of hits
    var results = getResultCount();

    //if there were more than 0 matches
    if (results > 0) {

        //Customize background color in overview
        $('#small_result').attr("class", "items_selected");

        //Display the result table
        $('#result .table_header').add('#result .table_body').show();

        //Hide display "No matches"
        $('#result .no_results').hide();
    }

    //No matches
    else {

        //no color at overview
        $('#small_result').removeClass("items_selected");

        //Hide result table
        $('#result .table_header').add('#result .table_body').hide();

        // Display "No matches"
        $('#result .no_results').show();
    }

    //Empty the table
    $('#result .table_body').empty();

    //Go over all documents and insert values
    $.each(getDocuments(), function (i, val) {

        //FWrite required values ​​in array for search
        var valueArray = get_table_values(val);

        //Create an empty row
        var row = "";

        //If the additional line is not disabled
        if (!has_feature("no_more")) {

            //cell for additional attachments
            row += "<div class='closed more' data-func='more'></div>";
        }

        //Insert values ​​from config into div
        $.each(config_array["table_array"], function (i, key) {

            //Enter values
            row += "<div class='w" + (i + 1) + "'>" + valueArray[key] + "</div>";
        });

        //ID of the record
        var docID = valueArray["id"];

        //If the title is in Merkliste, place line green
        var remembered = "";

        //Is the Merkliste active?
        if (has_feature("basket")) {

            //Is the title already in the merge list? Then line green deposit and checkbox anhaken
            if ($.inArray(docID, basketArray) > -1) {
                remembered = "class='remembered'";
                var closed = "";
            }

            //Title not in Merkliste
            else {
                closed = "closed";
            }

            //Insert the button
            row += "<div class='" + closed + " remember' data-func='remember'></div>";
        }

        //If the subordinate DIV is to be given a class
        var row_class = valueArray["row_class"] !== undefined ? " class='" + valueArray["row_class"] + "'" : "";

        //Row row build with possibly class
        row = "<div " + remembered + " data-id='" + docID + "'" + row_class + ">" + row + "</div>";

        //Insert the pre-configured line
        $('#result .table_body').append(row);
    });

    //Adjust Pagination: Determine the total number of the page
    maxPage = Math.ceil((results / displayRows));

    //If there were no hits
    if (results === 0) {

        //Are we on page 0/0
        currentPage = 0;
    }

    //If we are within the first 10 page, no leafing -10 possible
    (currentPage <= 10) ? $(".prev_ten").removeClass("clickable").addClass("op_50") : $(".prev_ten").addClass("clickable").removeClass("op_50");

    //If we are on the first page, left navigation (-1) is no longer possible
    (currentPage <= 1) ? $(".prev").removeClass("clickable").addClass("op_50") : $(".prev").addClass("clickable").removeClass("op_50");

    //If we are on the last page, Navigatoin to the right (+1) is no longer possible
    (currentPage === maxPage) ? $(".next").removeClass("clickable").addClass("op_50") : $(".next").addClass("clickable").removeClass("op_50");

    //If it is less than 10 pages to the end, no leaves + 10 more possible
    (currentPage > maxPage - 10) ? $(".next_ten").removeClass("clickable").addClass("op_50") : $(".next_ten").addClass("clickable").removeClass("op_50");

    //Set display for current page
    $('.currentPage').html(currentPage + " / " + maxPage);
}