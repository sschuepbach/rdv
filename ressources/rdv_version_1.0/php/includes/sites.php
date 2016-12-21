<?php

// Load contents of other sites (start, category table)
foreach ($configArray["site_array"] as $site => $site_link_name) {

    // Search" does not have to be created because it is already there
    if ($site !== "search") {

        //add site content container
        echo "<div class='site_content d_n' id='site_content_" . $site . "'>";

        // load content from the configuration file
        include "config/" . $projectName . "/site_" . $site . '.php';

        echo "</div>";
    }
}
