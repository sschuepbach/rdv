// initialisation script

// Special settings for this instance
function special_init(early_init) {

    // On the first call of the inits
    if (early_init) {

        // Remove the Bibtext export button
        $('div[data-format="bib"]').remove();

        // Set fields to english
        $('#searchfields .blue_header').text("Search");
        $('label[for="search_all"]').text("Full text:");
        $('#search_all').attr("placeholder", "Full text");
        $('#titles_without_year').text("speakers without age information");
        $('#result_label').text("Results");
        $('#reset_form').html("New search");
        $('#basket_label').text("Saved items");
        $('.no_results').text("No results");
        $('.remember').text("Save");
        $('#reset_basket').text("Clear list");
        $('div[data-format=txt]').text("Save as text file");
        $('#pdf_export').text("Save as pdf file");
        $('#hide_search span:eq(0)').html("Hide search form");
        $('#hide_search span:eq(1)').html("Show search form");

        // Select all filters
        $("div[data-filter_field] div[data-func='filter_search']").attr("data-selected", true);
    } else {

        //Create a table sorted by year by 2 clicks on column heading
        $('#result div[data-field="py_sort_string"]').trigger("click");
        $('#result div[data-field="py_sort_string"]').trigger("click");

        //Insert event listener to stop current audio when other audio is started
        window.addEventListener("play", function (evt) {

            //if there is a running audio and it is not the current playing
            if (window.$_currentlyPlaying && window.$_currentlyPlaying !== evt.target) {

                // stop
                window.$_currentlyPlaying.pause();
            }

            // remember stared audio file
            window.$_currentlyPlaying = evt.target;
        }, true);

        // Insert the filter area content in the search area
        $('#searchfields').append($('#filters').children());

        //Hide the empty filter area
        $('#filters').hide();

        //Click on "show text" Button
        $('#results').on("click", "span.show_text", function () {

            //Get the DOC-ID
            var docid = $(this).attr("data-docid");

            //Create pop-up window
            window.open("config/fred/show_text.php?docid=" + docid, docid, "width=400, height=700, scrollbars=yes");
        });
    }
}

//TABLE FUNCTIONS

//Transform output values ​​for search
function get_table_values(doc) {

    //Get values
    doc["loc"] = getMulti(doc, "LOC_CLEAN_all_string", "", "clean");
    doc["sex"] = getMulti(doc, "SPEAKER_SEX_CLEAN_all_string", "", "clean");
    doc["file_name"] = getMulti(doc, "file_all_string", "", "clean");

    //Create empty fields
    doc["file"] = "";
    doc["show_text"] = "";
    doc["download"] = "";

    //Only FRED-S currently
    if (doc["mode_string"] === "FRED-S") {

        //There may be multiple files entry
        var filesname_array = [];
        var files_array = [];

        $.each(doc["TEXTS_all_string"], function (i, file_name) {

            //Remember the file name
            filesname_array.push(file_name);

            //name + build audio element, not pre-load audio
            var content = "<audio controls preload='none'><source src='files/fred/audio/" + file_name + ".mp3' type='audio/mpeg'></audio>";

            //Button "showtext" for popup
            doc["show_text"] += "<span class='show_text' data-docid='" + file_name + "'>show text</span>";

            //file download for audio, text and text_tagged
            doc["download"] += "<div class='download_block'>";
            doc["download"] += "<a download href='files/fred/audio/" + file_name + ".mp3" + "' class='file_download'>audio</a>";
            doc["download"] += "<a download href='files/fred/text/" + file_name + ".txt" + "' class='file_download'>text</a>";
            doc["download"] += "<a download href='files/fred/text_tagged/" + file_name + "_clean_htagged.txt' class='file_download'>tagged</a>";
            doc["download"] += "</div>";

            //Save in array
            files_array.push(content);
        });

        //(multiple) file (s) for output
        doc["file"] = files_array.join("<br>");
    }

    //If no year is set
    if (doc["py_sort_string"] === 0) {

        //unknown
        doc["py_sort_string"] = "unknown";
    }

    //Online status
    doc["online"] = "";

    $.each(doc["online_all_string"], function (i, state) {

        //Display status DIV (s)
        doc["online"] += "<div class='online_state online_" + state + "'></div>";
    });

    return doc;
}

//Display data in additional line
function prepare_extra_data(doc) {

    var add = "";

    add += getMulti(doc, "TEXTS_all_string", "File", "label");
    add += getMulti(doc, "SPEAKER_ID_all_string", "Speaker ID", "label");
    add += getMulti(doc, "AREA_CLEAN_all_string", "Area", "label");
    add += getMulti(doc, "COUNTY_CLEAN_all_string", "County", "label");
    add += getMulti(doc, "SPEAKER_DOB_CLEAN_all_string", "Speaker Date of Birth", "label");
    add += getMulti(doc, "SPEAKER_DECADE_CLEAN_all_string", "Speaker Decade", "label");
    add += getMulti(doc, "REC_DATE_CLEAN_all_string", "Record Date", "label");
    add += getMulti(doc, "REC_DECADE_CLEAN_all_string", "Record Decade", "label");
    add += getMulti(doc, "EEXTENT_all_string", "Word Count", "label");

    return add;
}

function create_export_format(file_type, doc) {

    var output = "";

    switch (file_type) {

        case "txt":
            output += getMulti(doc, "AREA_CLEAN_all_string", "Area", "text");
            break;
    }

    return output;
}