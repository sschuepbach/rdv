<div id="facets" class="blue_border">

    <!-- Tabs: selected -->
    <div class="tabs_header">

        <?php
        if (has_feature("diagram")) {

            //If label is set to config, take this value, otherwise default value "year"
            $diagram_label = isset($configArray["diagram_label"]) ? $configArray["diagram_label"] : "Jahr";
            echo '<div data-facetname="year" data-tab="year_tab">' . $diagram_label . '</div>';
        }

        if (has_feature("facet")) {
            foreach ($configArray["facet_array"] as $key => $name) {
                echo " <div data-facetname='" . $key . "' data-tab='" . $key . "_tab'>" . $name . "</div>";
            }
        }
        ?>
    </div>

    <div class="tabs_body">

        <?php
        if ((has_feature("diagram"))) {
            ?>

            <div id="year_tab" class="po_r">

                <div id="noYear">
                    <div class="tristate_checkbox checked"></div>
                    <span id="countYears"></span><span id="titles_without_year">Titel ohne Jahr anzeigen</span>
                </div>

                <!-- Area for yearly and co, easier to move as a whole -->
                <div id="diagram_slide">

                    <div id="diagram"></div>

                    <div id="year-slider"></div>
                </div>
            </div>

            <?php
        }

        //Content of the other facets with values from Config
        foreach ($configArray["facet_array"] as $key => $name) {

            //Facet Div in whole
            $facetDiv = "<div id='" . $key . "_tab'>";

            //links: List with seletable values
            $facetDiv .= "<div class='unselected_facets' id='" . $key . "'></div>";

            //on bottom right with selected values
            $facetDiv .= "<div class='summary' data-facetname='" . $key . "' class='summary' id='sum_" . $key . "'></div>";

            $facetDiv .= "</div>";

            echo $facetDiv;
        }
        ?>
    </div>
</div>