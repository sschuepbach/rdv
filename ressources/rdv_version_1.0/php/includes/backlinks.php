<!-- Back links area -->
<div class="backlink_div">

    <?php
    // add backlinks
    foreach ($configArray["backlink_array"] as $link) {

        // add site content container
        echo "<a class='backlink' href='" . $link[1] . "'>" . $link[0] . "</a>";
    }
    ?>
</div>