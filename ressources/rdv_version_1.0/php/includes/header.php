<!-- Header -->
<div id="header">

    <!-- Branding as link -->
    <a id="ubfr_logo" href="http://www.uni-freiburg.de"></a>

    <!-- blue area  -->
    <div id="banner_blue" class="uni_blue">
        <div id="banner_title"><?php echo $configArray["banner_label"] ?></div>

        <?php
        //Link in banner, value from Config or default value
        $banner_name = isset($configArray["banner_link"]["name"]) ? $configArray["banner_link"]["name"] : "Universitätsbibliothek Freiburg";
        $banner_link = isset($configArray["banner_link"]["link"]) ? $configArray["banner_link"]["link"] : "http://www.ub.uni-freiburg.de";

        echo "<a id='banner_uni' href='{$banner_link}'>{$banner_name}</a>";
        ?>
    </div>

    <!-- grey raw -->
    <div id="banner_grey" class="uni_grey">

        <?php
        //If there are additional sites (start, category table)
        if (has_feature("site")) {

            //Collect links in a DIV
            echo '<div id="site_link_block">';

            //Publish links to each site
            foreach ($configArray["site_array"] as $site => $site_link_name) {
                echo '<div class="site_link" id="site_link_' . $site . '" data-site="' . $site . '">' . $site_link_name . '</div>';
            }

            echo '</div>';
        }
        ?>
    </div>
</div>
