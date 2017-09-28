// Assign elements with functions when the DOM tree is set up
$(document).ready(function () {

    //Load parameters from URL
    getUrlVars();

    //call up special functions at the beginning of this instance (e.g., click events for filters)
    special_init(true);

    //If there are additional sites
    if (has_feature("site")) {

        //Prepare site links
        prepareSites();
    }

    //Prepare search area
    prepareSearchForm();

    //If chart exists
    if (has_feature("diagram")) {

        //Prepare the year facet
        prepareYearFacet();
    }

    //If there are text facets
    if (has_feature("facet")) {

        //Prepare text facets
        prepareFacets();
    }

    //If there are filters
    if (has_feature("filter") || has_feature("additional_search")) {

        //Prepare the filter
        prepareFilters();
    }

    //Prepare display tables
    prepareTables();

    //Prepare tabs
    prepareTabs();

    //If there is a tree search
    if (has_feature("tree")) {

        //Prepare tree search -> there also the second call of special_init takes place
        prepareTrees();
    }

    //no tree search
    else {

        //call special functions at the END of this instance (e.g., sendQuery)
        special_init(false);
    }

    //Only display the page when everything is set up
    $("#site_content_search").removeClass("v_hi");
});

//Read out values from GET parameters
function getUrlVars() {
    $_GET = {};

    //Read the URL
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
        function decode(s) {
            return decodeURIComponent(s.split("+").join(" "));
        }

        //Values in asso. Write arrayv
        $_GET[decode(arguments[1])] = decode(arguments[2]);
    });
}

//check whether a feature exists (for example tree search, or no hit display in tree search)
function has_feature(feature) {

    //check if the value is stored in it
    return ($.inArray(feature, config_array["features"]) > -1);
}