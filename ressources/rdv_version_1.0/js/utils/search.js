// Last button pressed (e.g., no new search for space)
var pressedKey = 0;

// Keys where no Ajax request should be sent (e.g., Space)
var keysWithoutAction = new Array(9, 16, 17, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 116, 123);

// Assign search fields to function
function prepareSearchForm() {

    // When searching in input or enter or click on input empty (otherwise double search)
    $('#searchfields input').on("search keyup", function (event) {

        // remember the last pressed key
        pressedKey = event.keyCode;

        // Enter over search control, not via keyup
        if (pressedKey !== 13) {

            // For certain keys, no Ajax request (e.g., Space)
            if ($.inArray(pressedKey, keysWithoutAction) === -1) {

                // Send search request
                sendQuery("search");
            }
        }
    });

   // Click on Reset Button
    $('.selectbox_filter').change(function () {

        // Send search request
        sendQuery();
    });

    // Click on Reset Button
    $('#reset_form').click(function () {

        // Clear search fields, filters and facets
        reset_form();

        //unfiltered *: * Send search requesten
        sendQuery();

        //ocus the first input in the search mask
        $("#searchfields input:first").focus();
    });

    //When hovering an info icon in the Select-Search
    $('.select_search_help').hover(function () {

        //Select currently selected Select field
        var field = $(this).parent().find("select").val();

        //Show associated help
        $(this).find("div[data-help_id='" + field + "']").show();
    }, //leaving the Hover
            function () {

                //Hide all help text
                $(this).children().hide();
            }
    );

    //If there is the automcomplete feature
    if (has_feature("autocomplete")) {

        //Load Autocomplete
        activeSearchAutoComplete();
    }
}

//Activate Autocomplete
function activeSearchAutoComplete() {

    //Create Autocomplete for the configured fields (all single fields, no Select-Search fields)
    $.each(config_array["autocomplete_array"], function (i, field) {

        //_ edgy and _text fields still need a _string field for the automcomplete
        var fieldCheck = field.replace(/_edgy/g, "_facet");
        fieldCheck = fieldCheck.replace(/_text/g, "_facet");

        //Autocomplete via proxy
        $('input[name^="' + field + '"]').autocomplete({
            source: "php/utils/solr_proxy_suggestions.php?type=" + fieldCheck + "&limit=10",
            minLength: 1,
            focus: function (event, ui) {

                //Set the value to the currently hovered value so that validation works correctly
                $(this).val(ui.item["value"]);

                //Send search request
                sendQuery();
            }
        });
    });

    //For changes to a select-search selection
    $('select.select_search_field').change(function () {

        //get the selected value
        var field = $(this).find("option:selected").val();

        //if it is an Automcomplete value
        if ($.inArray(field, config_array["autocomplete_array"]) > -1) {

            //_ edgy and _text fields still need a _string field for the automcomplete
            var fieldCheck = field.replace(/_edgy/g, "_facet");
            fieldCheck = fieldCheck.replace(/_text/g, "_facet");

            //Create Autocomplete for adjacent input with this field
            $(this).next().autocomplete({
                source: "php/utils/solr_proxy_suggestions.php?type=" + fieldCheck + "&limit=10",
                minLength: 1,
                focus: function (event, ui) {

                    //Set the value to the currently hovered value so that validation works correctly
                    $(this).val(ui.item["value"]);

                    //Send search request
                    sendQuery();
                }
            });
        }

        //no autocomplete value
        else {

            //disable Autocomplete for adjacent input
            $(this).next().autocomplete("destroy");
        }
    });

    // Go to Select-Search Inputs at the beginning
    $.each($('input[name="select_search"]'), function () {

        //Select the selected neighboring Select
        var field = $(this).prev().find("option:selected").val();

        //If it is an Autocomplete field
        if ($.inArray(field, config_array["autocomplete_array"]) > -1) {

            // edgy and _text fields still need a _string field for the automcomplete
            var fieldCheck = field.replace(/_edgy/g, "_facet");
            fieldCheck = fieldCheck.replace(/_text/g, "_facet");

            //Create Autocomplete for this input with the appropriate field
            $(this).autocomplete({
                source: "php/utils/solr_proxy_suggestions.php?type=" + fieldCheck + "&limit=10",
                minLength: 1,
                focus: function (event, ui) {

                    //Set the value to the currently hovered value so that validation works correctly
                    $(this).val(ui.item["value"]);

                    //Send search request
                    sendQuery();
                }
            });
        }
    });
}

//Reset the complete form (search fields, filters and facets)
function reset_form() {

    //If there are Selectfilerboxes (Ordenseuche St. Peter), reset this to 1. value
    $('#searchfields select.selectbox_filter').prop('selectedIndex', 0);

    //If there is a chart
    if (has_feature("diagram")) {

        //If the titles without year are currently not displayed
        if (!$(".tristate_checkbox").hasClass("checked")) {

            //Show all titles again (also without year)
            $(".tristate_checkbox").addClass("checked");
        }
    }

    //If there is a diagram or facets
    if (has_feature("diagram") || has_feature("facet")) {

        //Facets + Reset the diagram
        reset_facet("all");
    }

    // if there are filters
    if (has_feature("filter")) {

        //Reset all filters to "not selected"
        $("div[data-selected]").attr("data-selected", "false");
    }

    //If there are Treesuche
    if (has_feature("tree")) {

        //go over all trees
        $.each(config_array["tree_array"], function (i, tree_id) {

            //deselect all nodes in the tree and close the tree
            $('#tree_' + tree_id).jstree("deselect_all");
            $('#tree_' + tree_id).jstree("close_all");

            //Reset search fields for tree filter
            $('.tree_search_input').val("");
        });
    }

    // Clear all text fields
    $('#site_content_search input').val("");
}