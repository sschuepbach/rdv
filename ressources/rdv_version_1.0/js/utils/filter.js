//Assign the filter to the function
function prepareFilters() {

    //Click on Filter value
    $('div[data-selected]').click(function () {

        //Toggle current status
        var newState = ($(this).attr("data-selected") === "false");

        //Set new status
        $(this).attr("data-selected", newState);

        //Send the request
        sendQuery();
    });
}