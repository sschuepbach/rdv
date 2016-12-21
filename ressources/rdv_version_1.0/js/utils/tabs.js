// Create tab functionality
function prepareTabs() {

    //Click on Tab
    $('.tabs_header div').click(function () {

        //Remove CSS class for sibling tabs
        $(this).siblings().removeClass("tab_active");

        //CSS-Klasse bei geklicktem Tab setzen
        $(this).addClass("tab_active");

        //Which tab should be displayed?
        var activeTab = $(this).data("tab");

        //Show siblings divs
        $('#' + activeTab).siblings().addClass("tab_invisible");

        //Show tab
        $('#' + activeTab).removeClass("tab_invisible");

        //If the active tab is the search
        if (activeTab === "result") {

            //Show Pagination in Footer
            $('#footer .pagination').css("visibility", "visible");
        }

        //for Merkliste
        if (activeTab === "basket") {

            //Hide paging in footer
            $('#footer .pagination').css("visibility", "hidden");
        }

        //When a different facet tab is selected
        if ($(this).attr("data-facetname") !== undefined) {

            //Activate the activated facet (if not already done)
            createFacets("tab_click");
        }
    });

    //Activate the first tab of the Tabgroup
    $('.tabs_header div:nth-child(1)').trigger("click");
}