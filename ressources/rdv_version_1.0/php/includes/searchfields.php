<!-- Search fields -->
<div id="searchfields" class="blue_border">

    <?php
    // Heading of the search aera
    $search_label = isset($configArray["search_label"]) ? $configArray["search_label"] : "Suche";

    // Add head
    echo '<h3 class="blue_header">' . $search_label . '</h3>';
    ?>

    <!-- load image -->
    <div id="loading_img" class="loading"><span class="loading_img"></span><span class="loading_text">Lade Daten</span></div>

    <?php
    //If the freex search has not been dimmed
    if (!has_feature("no_all_text_search")) {

        // searcg has autofocus
        echo '<div class="po_r all">';

        //If the label for the Freitextsuche is not deactivated
        if (!has_feature("no_all_text_label")) {

            //Set label
            echo '<label for="search_all">Freitext:</label>';
        }

        echo '<input id="search_all" placeholder="Freitext" name="all_text" type="search" autofocus />';

        //If necessary, Filter blocks which are also searched with the value of the all_text field (for example, abstract, fulltext)
        if (isset($configArray["additional_search_array"])) {
            foreach ($configArray["additional_search_array"] as $key => $name) {

                //Clickable block for additional fields
                echo "<div data-selected='false' data-func='filter_search' title='" . $name . "' data-search_value='" . $key . "'>" . $name . "</div>";
            }
        }

        echo '</div>';
    }

    //If there is a heading for the advanced search
    if (isset($configArray["expert_search_label"])) {

        //Insert the heading from the Config
        echo "<h3 class='blue_header m_b_10'>" . $configArray["expert_search_label"] . "</h3>";
    }

    //If there are search fields
    if (isset($configArray["search_array"])) {

        //Autofocus for first input, but only if there is no full-text search field
        $autofocus = (has_feature("no_all_text_search")) ? " autofocus" : "";

        //Use values to build search fields
        foreach ($configArray["search_array"] as $key => $name) {

            //add search field
            echo '<div class="po_r"><label for="' . $key . '">' . $name . ':</label><input title="' . $name . '" name="' . $key . '" type="search"' . $autofocus . ' /></div>';

            //Autofocus variable: set if only for the 1st input at all
            $autofocus = "";
        }
    }

    //If there is a search using a select field
    if (isset($configArray["select_search_array"])) {

        //3. show selected selects
        $i = 1;

        while ($i <= 3) {

            $options = "";

            $counter = 1;

            foreach ($configArray["select_search_array"] as $key => $name) {

                //Assume that option is not selected
                $selected = "";

                //At 1. Select, select the 1st option, the 2nd Select the 2nd Optoin ...
                if ($i === $counter) {

                    //Pre-select option
                    $selected = "selected='selected' ";
                }

                $options .= '<option ' . $selected . 'value="' . $key . '">' . $name . "</option>";

                $counter++;
            }

            //DIV line from Select with Options and Input build
            echo '<div class="select_search_line"><select class="select_search_field">' . $options . '"</select><input name="select_search" type="search" />';

            //If there is a help for select_search
            if (isset($configArray["select_search_help_array"])) {

                //Help text in a block
                echo "<div class='select_search_help'>";

                //set options
                foreach ($configArray["select_search_help_array"] as $key => $text) {

                    //Insert help text (first invisible)
                    echo "<div class='help_box' data-help_id='" . $key . "'>" . $text . "</div>";
                }

                //Close block of help texts
                echo "</div>";
            }

            echo '</div>';

            $i++;
        }
    }

    //If there is a filter using a select field
    if (isset($configArray["selectbox_filter_array"])) {

        //Go through several select filter searches (order, ownership, ...)
        foreach ($configArray["selectbox_filter_array"] as $select_filter) {

            //Counter per option (1st entry is selected)
            $counter = 1;

            $options = "";

            foreach ($select_filter["values"] as $display_value => $search_value) {

                //Assume that option is not selected
                $selected = "";

                //At 1. Select, select the 1st option, the 2nd Select the 2nd Optoin ...
                if ($counter === 1) {

                    //preselect option
                    $selected = "selected='selected' ";
                }

                $options .= '<option ' . $selected . 'value="' . $search_value . '">' . $display_value . "</option>";

                $counter++;
            }

            // Line for this selectbox filter
            echo "<div class='po_r'><label>" . $select_filter["name"] . ":</label><select class='selectbox_filter' data-field='" . $select_filter["field"] . "'>" . $options . "</select></div>";
        }

        $i++;
    }
    ?>

    <div id='reset_form'>Suchmaske zurücksetzen</div>
</div>