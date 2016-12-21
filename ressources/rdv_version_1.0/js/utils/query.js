//variable to abort Ajax request prematurely
var xhr;

//Number of hits: Default value 200
var displayRows = 30;

//variable to SolRReplay
var data;

//q parameters for solr request
var query = "";

//Request sent when query is too short -> does not return any hits
var standardQuery = "*:*";

//Variable for filterquery and year filterquery
var filterQueryString = "";
var yearQueryString = "";

//Start at record 1 (offset 0)
var startAt = 0;

//Compare current answer with previous. Rebuild table only if hit amount is different
var fingerPrint = "";

//Send request and process result
function sendQuery(mode) {

    //Ignore previous search query, if it is not finished yet, send new one instead
    (xhr !== undefined) ? xhr.abort() : null;

    //Querystring for facet and filter queries
    filterQueryString = '';

    //Calculate the search query
    setMainQuery();

    //If there is a filter search via Selectboxt
    if (has_feature("selectbox_filter")) {

        //Set filter
        setSelectboxFilterQuery();
    }

    //If Digramm is present 
    if (has_feature("diagram")) {

        //Calculate timeslider
        setYearQuery();
    }

    //If there are facets
    if (has_feature("facet")) {

        //Calculate facet request
        setFacetQuery();
    }

    //If there are filters
    if (has_feature("filter")) {

        //Create filter search
        setFilterQuery();
    }

    //If there is a tree search
    if (has_feature("tree")) {

        //Create filter search
        setTreeQuery();
    }

    //If there is a fixed filter query
    if (has_feature("fixed_filter")) {

        //install a fixed filterquery
        query += config_array["fixed_filter"];
    }

    //If it is not a leaf request (search field, facet or sort)
    if (mode !== 'page') {

        //Start on page 1 with record 1
        startAt = 0;
        currentPage = 1;
    }

    //Configure the request
    var ajax_query = query + filterQueryString + yearQueryString + "&sort=" + sortBy + "&start=" + startAt + "&rows=" + displayRows;

    //Convert to the appropriate format
    ajax_query = encodeURI(ajax_query);

    //MH: 27.09.16 at the URI-encode converts the percent sign from% 26 (= &) to% 25. The expression% 2526 must be changed to% 26
    ajax_query = ajax_query.replace(/%2526/g, "%26");

    //Send an Ajax request, store the xhr variable so that Request can be canceled
    xhr = $.ajax({
        beforeSend: function () {

            //Show load image
            $('#loading_img').css("visibility", "visible");
        },
        type: 'POST',
        url: 'php/utils/solr_proxy.php',
        data: {
            query: ajax_query,
            mode: 'search'
        },
        dataType: 'json',
        success: function (responseData) {

            //Save the response
            data = responseData;

            //Rebuild the hit list only if there are other hits than before (different IDs), not all hits will be delivered
            if (resultsAreDifferent()) {

                //Create table for hit list
                createResultTable();
            }

            //Update the display label in any case
            $('#small_result').text("(" + getResultCount() + ")");

            //Remove background color at td (equates to matching tds)
            $("#result div").removeClass("sort_td");

            //Div in sorting column in color (heading + cells in table)
            $("#result .table_header > div:nth-child(" + sortPos + ")").addClass("sort_td");
            $("#result div[data-id] > div:nth-child(" + sortPos + ")").addClass("sort_td");

            //If there are facets
            if (has_feature("facet") || has_feature("diagram")) {

                //Create facets
                createFacets(mode);
            }

            //If there is a tree search and the hit number is to be displayed
            if (has_feature("tree") && !has_feature("tree_no_count")) {

                //Adjust the count values ​​for nodes
                updateTreeCount();
            }

            //Hide the load image
            $('#loading_img').css("visibility", "hidden");
        }
    });
}

//Assemble the main request
function setMainQuery() {

    //Array that stores the individual values ​​of the text fields
    var queryArray = [];

    // Collect the values ​​of the special search
    if (has_feature("special_search")) {

        // Collect the values ​​of the special search
        queryArray = special_search();
    }

    //Get values ​​from input fields
    $.each($('#searchfields input'), function () {

        //Get value
        var val = $.trim($(this).val());

        // solr-special characters escapen
        val = val.replace(/([\/\+\-\|\!\(\)\{\}\[\]^\"\~\*?:\\])/g, "\\$1");

       //MH:27.09.16: & url-escape as% 26
        val = val.replace(/&/g, "%26");

       // Which field is it?
        var name = $(this).attr("name");

        // If it is a field whose solr search field depends on a select field
        if (name === "select_search") {

            //the solr search field is in the value of the selected Select o
            name = $(this).prev().val();
        }

        //Is there something in the field?
        if (val.length > 0) {

            //It's a normal field, expert search comes down
            if (name !== "expert") {

                //at edgy Search
                if (name.match(/edgy$/)) {

                    //also search in text field -> name_edgy -> name_text
                    var text_field_name = name.replace(/edgy/, 'text');

                    //also search in string field -> name_edgy -> name_string
                    var string_field_name = name.replace(/edgy/, 'string');

                    //"" to use with edgy
                    queryArray.push('(' + string_field_name + ':"' + val + '" OR ' + name + ':"' + val + '" OR ' + text_field_name + ':(' + val + '*))');
                }

                //for text searches
                else {

                    //With all_text there is the possibility to look for further fields (for example, abstract, fulltext)
                    if (name === "all_text") {

                        //First, create the all_text request
                        var all_text_search_string = 'all_text:(' + val + '*)';

                        //Now go over other fields, which are searched with OR with the same value as the all_text field
                        $.each($('.po_r.all div[data-selected="true"]'), function () {

                            //Collect the Solr fields
                            var field = $(this).attr("data-search_value");

                            //Add OR query to all_text search query
                            all_text_search_string += ' OR ' + field + ':(' + val + '*)';
                        });

                        //Insert the query in queryArray, making sure that the all_text requests are kept together
                        queryArray.push("(" + all_text_search_string + ")");
                    }

                    //Other text field
                    else {

                        //() and search for the righ
                        queryArray.push(name + ':(' + val + '*)');
                    }
                }
            }

            //Expert search
            else {

                //field + name is completely in the input: e.g. Period_all_facet: "18th century"
                queryArray.push(val);
            }
        }
    });

    //connect individual terms with + (= AND)
    var queryTerms = queryArray.join('+');

    //Send default request when the request is empty
    if (queryTerms.length === 0) {
        query = standardQuery;
    }

    //otherwise assemble the query
    else {

        //Inquiry
        query = queryTerms;
    }
}

//Get facets for the search query and build filterquery
function setFacetQuery() {

    //Go through all facets and build querystring
    $.each(config_array["facet_array"], function (i, facetName) {

        // If no facet values ​​are selected -> search for *
        if (selectArray[facetName].length === 0) {

            //If * is searched for, no tag and ex since no multiselect
            var facetFieldString = '&facet.field=' + facetName;

            //set fq with tag
            var fqPrefix = '&fq=' + facetName + ':(';
            var fqString = '*)';
        }

        //assemble facets from array values
        else {

            //facet.field exclusion insert -> Facet are displayed even if they are not clicked -> Multiselect possible
            facetFieldString = '&facet.field={!ex=' + facetName + '}' + facetName;

            //If values ​​within a facet are to be linked to AND
            if (has_feature("facet_and")) {

                //fq
                fqPrefix = '&fq=' + facetName + ':("';

                //Join elements from array with operator
                fqString = selectArray[facetName].join('" AND "');
                fqString += '")';
            }

            //fq by OR
            else {

                //set fq with tag
                fqPrefix = '&fq={!tag=' + facetName + '}' + facetName + ':("';

                //Join elements from array with operator
                fqString = selectArray[facetName].join('" OR "');
                fqString += '")';
            }
        }

        //Create filterquery for all facets
        filterQueryString += facetFieldString + fqPrefix + fqString;
    });
}

//Filterquery
function setFilterQuery() {

    //Go over filter block
    $.each($('div[data-filter_field]'), function (i, filter_block) {

        //Solr Field name for Fitler request
        var filter_field = $(filter_block).attr("data-filter_field");

        // Collect filter values
        var value_array = [];

        //go over checked values
        $.each($(filter_block).find(('div[data-selected="true"]')), function () {

            //Collect the value in the array
            value_array.push($(this).attr("data-search_value"));
        });

        //If there are values
        if (value_array.length > 0) {

            //Adjust the filter string
            filterQueryString += '&fq=' + filter_field + ':(' + value_array.join(" OR ") + ')';
        }
    });
}

//Selectbox filterquery
function setSelectboxFilterQuery() {

    //Go over filter block
    $.each($('select.selectbox_filter'), function (i, filter_block) {

        //Solr Field name for Fitler request
        var filter_field = $(filter_block).attr("data-field");

        //get the selected value
        var search = $(this).find("option:selected").val();

        //Adjust the filter string
        filterQueryString += '&fq=' + filter_field + ':"' + search + '"';
    });
}

//Tree-Query
function setTreeQuery() {

    // Connect values ​​within a tree to OR

    var connector = "OR";

    //If values ​​within a tree are to be connected with AND
    if (has_feature("tree_and")) {

        //Adjust the variable
        connector = "AND";
    }

    //Go to tree values
    $.each(config_array["tree_array"], function (i, tree_id) {

        //If there are selected values ​​for this tree
        if ((tree_data_selected_array[tree_id]).length > 0) {

            //merge values ​​by OR, but also get other values ​​(tag)
            filterQueryString += '&fq={!tag=' + tree_id + '}' + tree_id + ':("' + (tree_data_selected_array[tree_id]).join('" ' + connector + ' "') + '")';
        }

        //Load facet from solr, also display the unselected values ​​(ex), fetch all values ​​and also display 0 values
        filterQueryString += '&facet.field={!ex=' + tree_id + '}' + tree_id + '&f.' + tree_id + '.facet.limit=-1&f.' + tree_id + '.facet.mincount=0&';
    });
}

//Configure annual query
function setYearQuery() {

    //build range query, tag so that even hits outside the selected range are fetched and displayed
    yearQueryString = "&fq={!tag=py_all_facet}py_all_facet:[" + years[0] + " TO " + years[1] + "]";

    //Check whether the title has no years
    if ($('#noYear div.checked').length) {
        yearQueryString += ' OR py_all_facet:0';
    }
}

// SOLR-FUNCTIONS: Werte aus Antwort auslesen

//Anzahl der Treffer einer Solr-Suchanfrage liefern
function getResultCount() {
    return data.response.numFound;
}

//Alle Dokumente einer Solr-Suchanfrage holen
function getDocuments() {
    return data.response.docs;
}

//fuer eine Facette die Werte als Array holen
function getFacetValues(facetName) {
    return data.facet_counts.facet_fields[facetName];
}

//Pruefen ob 2 Anfragen unterschiedliche Ergebnisse liefern
function resultsAreDifferent() {

    //String fuer neuen Fingeradruck der Antwort
    var fingerPrintString = "";

    //Ueber Dokumente gehen und ID-String bauen
    $.each(getDocuments(), function (i, val) {

        //FingerPrint der Antwort erstellen
        fingerPrintString += "/" + val.id;
    });

    //Mit vorheriger Anfrage vergleichen
    var sameQuery = (fingerPrintString !== fingerPrint);

    //Neuen Fingeradruck speichern
    fingerPrint = fingerPrintString;

    //Ergebnis zurueckliefern
    return sameQuery;
}

//Werte fuer zusaetzliche Zeile oder Merklistenexport auslesen und formattieren (Einzelwert)
function getSingle(doc, field, header, format) {

    //Ausgabewert
    var output = "";

    //Wenn Wert vorhanden ist
    if (doc[field] !== undefined && doc[field] !== "") {

        //Welche Anzeigeform?
        switch (format) {

            //nur Wert auslesen
            case "clean":
                output = doc[field];
                break;

                //mehrere Werte zusammenfuegen
            case "pre":
                output = header + doc[field];
                break;

                //Label + Span
            case "label":
                output = "<label>" + header + ":</label><span>" + doc[field] + "</span><br/>";
                break;

                //Link erzeugen
            case "url":

                //und Werte in a schrieben
                output += "<label>" + header + ":</label><span><a class='external_link' target='_blank' href='" + doc[field] + "'>Link</a></span>";
                break;

                //Textexport
            case "text":
                output = header + ": " + doc[field] + "<br />";
                break;

                //Bibtextexport
            case "bibtex":
                output = "  " + header + " = {" + doc[field] + "},\n";
                break;

                //Coins fuer Citaviexport
            case "coins":
                output = "&rft." + header + "=" + doc[field];
                break;
        }
    }

    //Werte zurueckgeben
    return output;
}

//Werte fuer zusaetzliche Zeile oder Merklistenexport auslesen und formattieren (Multiwert mit Join)
function getMulti(doc, field, header, format) {

    //Ausgabewert
    var output = "";

    //Wenn Wert vorhanden ist
    if (doc[field] !== undefined && doc[field] !== "") {

        //Welche Anzeigeform?
        switch (format) {

            //nur Werte auslesen
            case "clear_text":
                output = doc[field];
                break;

            case "clean":
                output = doc[field].join("<br />");
                break;

                // nur ein Wert aus mehrern Werten zurückgeben:
            case "clean_one":

                //ueber einzelne Werte gehen, und nur ein Wert zurückgeben
                $.each(doc[field], function (i, val) {
                    //und Werte in spans schrieben
                    output = val;
                    return false;
                });
                break;

                //lokale Verfuegbarkeit nur ein Link bei mehreren
            case "opac_link_single":

                //Suche nach ISBN
                var index = "sb";

                //Bei ISSN
                if (header === "ISSN") {

                    //Suche im OPAC nach ISSN
                    index = "ss";
                }

                //ueber einzelne Werte gehen
                $.each(doc[field], function (i, val) {

                    //Link auf OPAC
                    output = "<label>" + header + ":</label><a class='opac_link' target='_blank' href='https://katalog.ub.uni-freiburg.de/link?" + index + "=" + val + "'>lokale Verfügbarkeit prüfen</a> " + val + "<br>";
                });
                break;

                //lokale Verfuegbarkeit
            case "opac_link":

                //Suche nach ISBN
                var index = "sb";

                //Bei ISSN
                if (header === "ISSN") {

                    //Suche im OPAC nach ISSN
                    index = "ss";
                }

                //ueber einzelne Werte gehen
                $.each(doc[field], function (i, val) {

                    //Link auf OPAC
                    output += "<label>" + header + ":</label><a class='opac_link' target='_blank' href='https://katalog.ub.uni-freiburg.de/link?" + index + "=" + val + "'>lokale Verfügbarkeit prüfen</a> " + val + "<br>";
                });
                break;

                //fuer Linkresolver aufbereiten
            case "linkresolver":
                output = "&" + header + "=" + doc[field][0];
                break;

                //Label + Span
            case "label":
                output = "<label>" + header + ":</label><span>" + doc[field].join("<br />") + "</span><br />";
                break;

                //Label + einzelne Werte in Spans
            case "single_values":

                //Label + Sammelspan
                output = "<label>" + header + ":</label><span>";

                //ueber einzelne Werte gehen
                $.each(doc[field], function (i, val) {

                    //und Werte in spans schrieben
                    output += "<span data-field='" + field + "'>" + val + "</span><br />";
                });

                //Sammelspan schliessen
                output += "</span>";
                break;

                //Link erzeugen
            case "url":

                //ueber einzelne Werte gehen
                $.each(doc[field], function (i, val) {

                    //und Werte in spans schrieben
                    output += "<label>" + header + ":</label><span class='v_m'><a class='external_link' target='_blank' href='" + val + "'>Link</a></span>";
                });
                break;


                //Textexport
            case "text":
                output = header + ": " + doc[field].join("; ") + "<br />";
                break;

                //Bibtextexport
            case "bibtex":
                output = "  " + header + " = {" + doc[field].join(" and ") + "},\n";
                break;

                //Coins fuer Citaviexport
            case "coins":

                //Ueber Felder gehen und Werte eintragen
                $.each(doc[field], function (i, val) {
                    output += "&rft." + header + "=" + val;
                });
                break;
        }
    }

    //Werte zurueckgeben
    return output;
}