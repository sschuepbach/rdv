<!-- Basket Div -->
<div id="basket">

    <!-- Remember list functionalities: export, empty, etc. -->
    <div id="func_basket" class="d_n">

        <?php
        // list of the export formats,file extension + description of the download button
        $export_array = array(
            "bib" => "Als Bibtex speichern",
            "txt" => "Als Text speichern"
        );

        //Create export filter with values from configuration file
        foreach ($export_array as $key => $name) {
            echo "<div class='export file' data-format=" . $key . ">" . $name . "</div>";
        }
        ?><!-- PDF export extra, because it works with a different from 
        --><div id="pdf_export" class="export file">Als pdf speichern</div>

        <!-- Empty remember list -->
        <div id="reset_basket" class="export clean">Merkliste leeren</div>

        <!-- Form for creating downloadable files in text format (txt, bibtex) -->
        <form name="basket_form" method="POST" action="php/utils/create_basket_file.php">
            <input type="hidden" name="file_content" value="" />
            <input type="hidden" name="file_type" value="" />
        </form>

        <!-- Form to create the downloadable PDF file -->
        <form id="pdf_form" name="pdf_form" method="POST" action="php/utils/create_pdf_file.php">
            <input type="hidden" name="id_array" value="" />
        </form>
    </div>

    <!-- Display when there were no hits -->
    <div class='no_results'>Keine Einträge in der Merkliste</div>

    <!-- Header does not scroll with -->
    <div class="table_header d_n">

        <?php
        //If label is set in Config, take this value. Otherwise default value "Info"
        $info_label = isset($configArray["info_label"]) ? $configArray["info_label"] : "Info";

        //If the additional line is not disabled
        if (!has_feature("no_more")) {

            //Set info button
            echo "<div class='more'>" . $info_label . "</div>";
        }

        // Numbered CSS classes for width
        $counter = 1;

        // Add Table head 
        foreach ($configArray["table_array"] as $arr) {

            echo "<div class='w" . $counter . "'>" . $arr[0] . "</div>";
            $counter++;
        }

        // remember button
        echo "<div class='remember'>Merken</div>";
        ?>
    </div>

    <!-- Let the result list scrolling  -->
    <div class="table_body d_n"></div>
</div>