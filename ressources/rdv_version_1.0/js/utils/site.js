//If a start page is specified in the config, use this, otherwise the "search"
start_site = ("site_start" in config_array) ? config_array["site_start"] : "search";

//Prepare site functionality
function prepareSites() {

    //Show matching page
    load_site_content();

    //Clicking Site Link
    $('.site_link').click(function () {

        //Read out the site
        var site = $(this).attr("data-site");

        //make this site link optically active and display site content
        set_site_active(site);

        //Home runs under /, the other pages under index.php? Site = site -> is evaluated at Reload
        var location = (site === start_site) ? "." : "index.php?site=" + site;

        //Insert new state in JS history, remember current active page
        history.pushState({site: site}, site, location);
    });

    //When JS history is traversed
    window.onpopstate = function (event) {

        //If it is not the startup site marked with "." Is deposited
        if (event.state !== null) {

            //Read the site from History
            var site = event.state.site;
        }

        //it is the start site
        else {

            //Sart-Site should be loaded
            site = start_site;
        }

        //make this site link optically active and display site content
        set_site_active(site);
    };
}

//Activate the site link and site content
function set_site_active(site) {

    //other site links optically reset
    $('.site_link').removeClass('site_link_active');

    //Switch this site link optically active
    $('#site_link_' + site).addClass('site_link_active');

    //Hide other site content
    $('.site_content').hide();

    $('#site_content_' + site).show();

    //On the search page
    if (site === "search") {

        //Show Pagination in Footer
        $('#footer .pagination').css("visibility", "visible");
    }

    //on other pages
    else {

        //Hide paging in footer
        $('#footer .pagination').css("visibility", "hidden");
    }
}

//load the corresponding page at the beginning
function load_site_content() {

    //If site is passed by parameter
    if ($_GET["site"] !== undefined) {

        //make this site link optically active and display site content
        set_site_active($_GET["site"]);
    }

    //No site was passed by parameter
    else {

        //make the default site link optically active and display site content
        set_site_active(start_site);
    }
}