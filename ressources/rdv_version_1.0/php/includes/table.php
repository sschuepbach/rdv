<!-- Result Div -->
<div id="result">

    <!-- Insert / Insert button for search mask -->
    <div id='hide_search'><span class='search_visible'>Suchmaske ausblenden</span><span class='search_invisible'>Suchmaske einblenden</span></div>

    <!-- Pagination on top -->
    <div class="pagination">
        <div class="prev_ten clickable"
             data-dir="-10">-10</div>
        <div class="prev clickable"
             data-dir="-1">-1</div>
        <div class="currentPage">1</div>
        <div class="next clickable"
             data-dir="1">+1</div>
        <div class="next_ten clickable"
             data-dir="10">+10</div>
    </div>

    <!-- Display when there were no hits -->
    <div class='no_results'>Keine Treffer</div>

    <!-- Disable header scrolling -->
    <div class="table_header">

        <?php
        //If Label is set in Config, set this value. Otherwise default value "Info"
        $info_label = isset($configArray["info_label"]) ? $configArray["info_label"] : "Info";

        //If the additional line is not disabled
        if (!has_feature("no_more")) {

            //add info button
            echo "<div class='more'>" . $info_label . "</div>";
        }

        //Numbered CSS classes for width
        $counter = 1;

        //add header
        foreach ($configArray["table_array"] as $arr) {

            //If it is a sort field (that is, in the array, the Solr field name after which is sorted), 
            //set appropriate attributes
            $data_sort = (count($arr) > 1) ? " name='sort' data-pos='" . $counter . "' data-field='" . $arr[1] . "'" : "";

            //add header
            echo "<div" . $data_sort . " class='w" . $counter . "'>" . $arr[0] . "</div>";
            $counter++;
        }

        //Is the remember list set?
        if (has_feature("basket")) {
            echo "<div class='remember'>Merken</div>";
        }
        ?>
    </div>

    <!-- Enabling scrolling the hit list -->
    <div class="table_body"></div>
</div>