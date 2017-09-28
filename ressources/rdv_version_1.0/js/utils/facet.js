// SelectArray, in which for individual facets an array is located in which the currently selected facet values ​​are stored
var selectArray = [];

// If there are facets
if (config_array["facet_array"] !== undefined) {

    // Associate array for facet values, first no facet value selected
    $.each(config_array["facet_array"], function (i, facetName) {
        selectArray[facetName] = [];
    });
}

// Prepare facets
function prepareFacets() {

    // Click on "Select facet value" (left)
    $('div.unselected_facets').on("click", "div.addFacet", function () {

        // Prevent multiple execution
        $(this).off("click");

        // Retrieve facet name and facet value (display and search)
        var facetName = $(this).closest(".unselected_facets").attr("id");
        var facetValueSearch = $(this).find("span[name='facetValue']").attr("data-value");
        var facetValueDisplay = $(this).find("span[name='facetValue']").text();

        // store the value in the array from which the search string is generated
        selectArray[facetName].push(facetValueSearch);

        // Send search request
        sendQuery("facet_click");

        // Update filter overview
        addToFilterSummary(facetName, facetValueDisplay, facetValueSearch);

      
        $(this).fadeOut(700, function () {
            $(this).remove();
        });

        // Update the display label
        updateLabel(facetName);
    });

    //If you click on "Remove facet value" (right)
    $('.summary').on("click", "div.removeFacet", function () {

        //Prevent multiple execution
        $(this).off("click");

        //Get facet name and facet value
        var facetName = $(this).closest("div[data-facetname]").attr("data-facetname");
        var facetValueSearch = $(this).find("span.facet_value").attr("data-value");

        //Remove the value from the facet array
        selectArray[facetName].remove(facetValueSearch);

        //Send search request
        sendQuery("remove_facet");

        //Update the display
        updateLabel(facetName);

        //Hide the element and then remove it from the filter overview
        $(this).fadeOut(700, function () {

            //Remove element from DOM
            $(this).remove();
        });
    });
}

//Create active facet
function createFacets(mode) {

    //Get active facet (= visible facet = active facet tab)
    var activeFacet = $('#facets div[data-tab].tab_active');

    //Get facet names
    var facetName = $(activeFacet).attr("data-facetname");

    // If not only sorted, blotched or another facet selection has been selected
    if (mode !== 'sort' && mode !== 'page' && mode !== 'tab_click') {

        //Rebuild facets
        $('#facets div[data-tab]').removeClass("content_created");
    }

    //Handelt es sich um die Jahresfacette?
    if (facetName === 'year') {

        //Jahresfacette anlegen
        createYearFacet();
    }

    //Textfacette
    else {

        //Nur einmal aufbauen (Klasse content_created existiert nicht) und nur wenn data vorhanden ist (bei erstem Start der Seite noch nicht da)
        if (!$(activeFacet).hasClass("content_created") && data !== undefined) {

            //Flag content_created speichern
            $(activeFacet).addClass("content_created");

            //Linken Bereich (fuer Auswahl der Facettenwerte) leeren
            $('#' + facetName).empty();

            //Pro Facette einzelne Werte ausgeben
            $.each(getFacetValues(facetName), function (facetValueSearch, count) {

                //Nur Werte einfuegen, die noch nicht ausgewaehlt wurden und damit in Filteruebersicht rechts stehen
                if ($.inArray(facetValueSearch, selectArray[facetName]) === -1) {

                    //Datensaetze bei denen die Facette nicht gesetzt ist Wert durch CSS-Klasse (z.B. "ohne") steuern
                    var empty = (facetValueSearch === "") ? "empty" : "";

                    //davon ausgehen, dass angezeigter und gesuchter Wert gleich sind
                    var facetValueDisplay = facetValueSearch;

                    //Wenn laut config ein anderer Wert angezeigt werden soll, statt dem der tatsaechlich gesucht wird
                    if (has_feature("facet_display_value")) {

                        //Die Darstellungsform des Wertes berechnen
                        facetValueDisplay = get_facet_value_display(facetValueSearch, facetName);
                    }

                    //Facettenwertname und Facettenwertanzahl in einer Auswahlzeile einfuegen
                    $('#' + facetName).append("<div class='addFacet'><span class='" + empty + "' name='facetValue' data-value='" + facetValueSearch + "'>" + facetValueDisplay + "</span><span name='facetCount'>(" + count + ")</span></div>");
                }
            });
        }
    }
}

//Eintrag in Filteruebersicht einfuegen
function addToFilterSummary(facetName, valueDisplay, valueSearch) {

    //Datensaetze bei denen die Facette nicht gesetzt ist Wert durch CSS-Klasse (z.B. "ohne") steuern
    var empty = (valueDisplay === "") ? "empty" : "";

    //Facettenwertname + Checkbox-Div (minus)
    var remove_row = "<div class='removeFacet include'><span class='" + empty + " facet_value' data-value='" + valueSearch + "'>" + valueDisplay + "</span><div class='facet_minus'></div></div>";

    //ganze Zeile einblenden
    $(remove_row).appendTo($("#sum_" + facetName)).hide().fadeIn(700);
}

//Einzelne Filter in Summary ausblenden
function fadeOutAndRemoveFilters(facetName) {

    //Alle einzelnen ausgewaehlten Filter rechts ausblenden
    $('#sum_' + facetName + ' div.removeFacet').fadeOut(700, function () {

        //Element entfernen
        $(this).remove();
    });
}

//Anzahl der angeklickten Facetten in Tab aktualisieren
function updateLabel(facetName) {

    //Anzahl der selektierten Werte dieser Facette
    var selectedItems = selectArray[facetName].length;

    //Label farblich hinterlegen
    (selectedItems > 0) ? $('.tabs_header div[data-facetname=' + facetName + ']').addClass("items_selected") : $('div[data-facetname=' + facetName + ']').removeClass("items_selected");
}

//Filter zureucksetzen
function reset_facet(facetName) {

    //welchen Filter zuruecksetzen?
    switch (facetName) {

        //Alle Filter zuruecksetzen
        case "all":

            //Wenn Diagramm vorhanden
            if (has_feature("diagram")) {

                //Jahresslider zuruecksetzen
                reset_facet('year');
            }

            //Wenn es Facetten gibt
            if (has_feature("facet")) {

                //Ueber andere Facetten gehen
                $.each(config_array["facet_array"], function (i, facet) {

                    //und zuruecksetzen
                    reset_facet(facet);
                });
            }
            break;

            //Jahresslider zuruecksetzen
        case 'year':

            //Jahresbereich fuer Slider zuerucksetzen
            yearsSlider[0] = config_array["diagram_min_year"];
            yearsSlider[1] = config_array["diagram_max_year"];

            //Jahresslider zuruecksetzen
            $("#year-slider").slider("values", 0, config_array["diagram_min_year"]);
            $("#year-slider").slider("values", 1, config_array["diagram_max_year"]);

            //Vorhang zuruecksetzen, kein Offset noetig
            offset[0] = 0.0;
            offset[1] = 0.0;

            //Jahresbereich fuer Suchanfrage zuerucksetzen
            years[0] = config_array["diagram_min_year"];
            years[1] = config_array["diagram_max_year"];

            //Jahresslider Label und Vorhang zuruecksetzen
            setYearRange();

            //Labelanzeige zuruecksetzen
            setTabYear();
            break;

            //Einzelnen Filter zuruecksetzen
        default:

            //Array mit Facettenwerten leeren
            selectArray[facetName] = [];

            //Labelanzeige aktualisieren
            updateLabel(facetName);

            //Filter ausblenden und entfernen
            fadeOutAndRemoveFilters(facetName);
            break;
    }
}

//Hilfefunktion: Wert aus einem Array entfernen
Array.prototype.remove = function (value) {
    var i;
    for (i = 0; i < this.length; i++) {
        if (this[i] === value) {
            this.splice(i, 1);
        }
    }
    return this;
};