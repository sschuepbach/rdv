//data records (store IDs)
var basketArray = [];

//Check whether session storage is supported
var sessionStorageSupport = ((typeof (sessionStorage) !== undefined) && (typeof (sessionStorage) !== 'unknown'));

/**
 * Prepares basket
 * @returns {undefined}
 */
function prepareBasket() {

    //Export file for formats with Textexport (txt, bibtex)
    $('#basket div[data-format]').click(function () {

        //Use the name to get the file end of the file to be created and save it to input
        var file_type = $(this).data("format");
        $('#basket input[name="file_type"]').val(file_type);

        //output content
        var contentArray = [];

        //Get data via Ajax and convert to suitable export format
        $.ajax({
            type: 'POST',
            url: 'php/utils/solr_proxy.php',
            data: {
                query: encodeURI("id:(" + basketArray.join(" OR ") + ")"),
                mode: 'export'
            },
            dataType: 'json',
            async: false,
            success: function (responseData) {

                //iterate over all hits
                $.each(responseData.response.docs, function (i, doc) {

                    //create output format
                    contentArray.push(create_export_format(file_type, doc));
                });
            }
        });

        //Write the contents of the file in hidden field
        $('#basket input[name="file_content"]').val(contentArray.join("<br />"));

        //File and offer it for download, Ihhalt is given over input fields
        $('#basket form[name="basket_form"]').submit();
    });

    //create pdf export file
    $('#pdf_export').click(function () {

        //Save IDs in hidden field
        $('#basket input[name="id_array"]').val(basketArray);

        //create pdf file using the pdf submitted pdf form
        $('#basket form[name="pdf_form"]').submit();
    });

    //Reset basket
    $('#reset_basket').click(function () {

        //iterate over IDs of selecet by user
        $.each(basketArray, function (i, docID) {

            //Remove title from Merkliste
            removeFromBasket(docID);
        });

        basketArray = [];
        disableBasketFunctions();
    });

    reloadBasket();

    // leaving the site ...
    $(window).on('beforeunload', function () {
        saveBasket();
    });
}

/**
 * Removes hits from basket
 * @param {integer} docID
 * @returns {undefined}
 */
function removeFromBasket(docID) {

    //In results list green deposit away
    $('#result div[data-id=' + docID + ']').removeClass("remembered");

    //Remove Haekchen bei Box from the results list
    $('#result div[data-id=' + docID + '] div[data-func=remember]').addClass("closed");

    // Remove entry from basket
    $('#basket div[data-id=' + docID + ']').remove();
}

/**
 * Memorizes or delete a title
 * @param {type} div
 * @returns {undefined}
 */
function rememberTitle(div) {
    
    var docID = $(div).parent().attr("data-id");

    //If title is not already in Merkliste (tr so not the class has remembered)
    if (!$(div).parent().hasClass("remembered")) {

        //Add to array
        basketArray.push(docID);
        
        //set tr to green
        $(div).parent().addClass("remembered");

        //Mark the record as attached
        $(div).removeClass("closed");

        //Clone element and paste into Merkliste, thereby additional information folds again
        $(div).parent().clone().appendTo($('#basket .table_body')).find("div[data-func='more']").addClass("closed");
    }

    //Element is in list and needs to be removed
    else {
        removeFromBasket(docID);
        basketArray.remove(docID);
    }
    
    //Adjust heading and show / hide functions
    updateBasketHeaderAndFunctions();
}

/**
 * Customizes Basketheader and hide features
 * @returns {undefined}
 */
function updateBasketHeaderAndFunctions() {

    var results = basketArray.length;

    if (results > 0) {

        //Update the display label
        $('#small_basket').text("(" + results + ")");

        //Match background color in overview
        $('#small_basket').attr("class", "items_selected");

        //Display result table
        $('#func_basket').add('#basket .table_header').add('#basket .table_body').show();

        //Hide "No Matches"
        $('#basket .no_results').hide();
    }

    //no hits
    else {
        disableBasketFunctions();
    }
}

/**
 * No table and no functions to display if there are no hits in the merge list
 * @returns {undefined}
 */
function disableBasketFunctions() {

    // update display label = 0 matches
    $('#small_basket').text("(0)");

    //No color at overview
    $('#small_basket').removeClass("items_selected");

    //Hide results table
    $('#func_basket').add('#basket .table_header').add('#basket .table_body').hide();

    //Show "No matches"
    $('#basket .no_results').show();
}

//Reestablish contents of the merge field from sessionStorage
function reloadBasket() {

    //Only when session storage is supported
    if (sessionStorageSupport) {
        
        //Read session data from this RDV
        var session_data = JSON.parse(sessionStorage.getItem(appVar));

        //Insert the saved merge list of this RDV in the merge field of the surface, create a blank empty array
        basketArray = session_data === null ? [] : session_data;

        //If there were noted tracks in the session
        if (basketArray.length > 0) {
            
            //Get data via Ajax and paste into Merkliste
            $.ajax({
                type: 'POST',
                url: 'php/utils/solr_proxy.php',
                data: {
                    query: encodeURI("id:(" + basketArray.join(" OR ") + ")"),
                    mode: 'basket'
                },
                dataType: 'json',
                success: function (responseData) {

                    //Go over all hits
                    $.each(responseData.response.docs, function (i, doc) {

                        //For display, write values in array
                        var valueArray = get_table_values(doc);
                        
                        //Create empty row
                        var row = "";

                        //If the additional line is not disabled
                        if (!has_feature("no_more")) {

                            //Cell for additional attachments
                            row += "<div class='closed more' data-func='more'></div>";
                        }

                        //Add values from config to tds
                        $.each(config_array["table_array"], function (i, key) {

                            //Enter values
                            row += "<div class='w" + (i + 1) + "'>" + valueArray[key] + "</div>";
                        });

                        //Insert buttons
                        row += "<div class='remember' data-func='remember'></div>";
                        
                        //Green row
                        row = "<div class='remembered' data-id='" + doc.id + "'>" + row + "</div>";

                        //Insert the pre-configured line in the merge window
                        $('#basket .table_body').append(row);
                    });
                }
            });
        }

        //Customize header header and show or hide functions
        updateBasketHeaderAndFunctions();

        //Session storage of this RDV will be reset when the page is left
        sessionStorage.removeItem(appVar);
    }
}

//Save the contents of the merge list in the session session
function saveBasket() {

    //Only when session storage is supported
    if (sessionStorageSupport) {
        
        //Write the merge of this RDV in storage
        sessionStorage.setItem(appVar, JSON.stringify(basketArray));
    }
}