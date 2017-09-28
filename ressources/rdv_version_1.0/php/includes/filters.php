<div id="filters" class=blue_border>

    <?php
   // Is there only one filter? Then one comes out with a heading (= heading of the single filter)
    $one_filter = count($configArray["filter_array"]) === 1;

   // heading for filter area
    $filter_label = "Filter";

    if ($one_filter) {
        $filter_label = $configArray["filter_array"][0]["name"];
    }

    echo '<h3 class = "blue_header">' . $filter_label . '</h3>';

    //Content of the filters with values from Config
    foreach ($configArray["filter_array"] as $filter) {

        //Include enclosing block so search field is clear
        echo "<div data-filter_field='" . $filter["field"] . "'>";

        //Only if there are several filters
        if (!$one_filter) {

            //Output this filter
            echo "<h3>" . $filter["name"] . "</h3>";
        }

        foreach ($filter["values"] as $display_value => $search_value) {
            echo "<div data-selected='false' data-func='filter_search' title='" . $display_value . "' data-search_value='" . $search_value . "'>" . $display_value . "</div>";
        }
        
        echo "</div>";
    }
    ?>
</div>