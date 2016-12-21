<!-- Tree -->
<div id="trees">

    <?php
    // Content of the other facets with values from Config
    foreach ($configArray["tree_array"] as $tree_id => $tree_header) {

        //Include enclosing block so search field is clear
        echo "<div class='tree_block blue_border' data-tree_facet_field='" . $tree_id . "'>";

        // Header
        if ($tree_header !== "") {

            //Assume that the number of nodes selected should not be displayed in the tree
            $tree_count = "";

            //If number of selected nodes should be displayed in the tree
            if (has_feature("show_tree_select_count")) {

                //Show number in parentheses (CSS)
                $tree_count = '<span class="tree_select_count" id="tree_select_count_' . $tree_id . '">0</span>';
            }

            // print Header
            echo '<h3 class = "blue_header">' . $tree_header . $tree_count . '</h3>';
        }

        //Label for opening and closing buttons
        $open_all_label = isset($configArray["tree_open_all_label"]) ? $configArray["tree_open_all_label"] : "alle Optionen anzeigen";
        $close_all_label = isset($configArray["tree_close_all_label"]) ? $configArray["tree_close_all_label"] : "alle Optionen zuklappen";

        //Buttons for opening and closing the tree
        echo '<span class="open_tree" id="open_' . $tree_id . '">' . $open_all_label . '</span>';
        echo '<span class="close_tree" id="close_' . $tree_id . '">' . $close_all_label . '</span>';

        //Placeholder for category search
        $search_tree_label = isset($configArray["tree_search_placeholder"]) ? $configArray["tree_search_placeholder"] : "Kategorien durchsuchen";

        //search field for tree filter
        echo "<input class='tree_search_input' placeholder='" . $search_tree_label . "' id='search_" . $tree_id . "' type='search' />";

        //Div in which the tree will be placed
        echo "<div id='tree_" . $tree_id . "'></div>";

        //close filter block
        echo "</div>";
    }
    ?>
</div>