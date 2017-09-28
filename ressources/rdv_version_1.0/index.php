<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>

    <?php
    //Configuration files
    require_once __DIR__ . '/config/main.php';
    require_once __DIR__ . '/config/' . $projectName . '/' . $projectName . '_main.php';
    require_once __DIR__ . '/php/utils/utils.php'; ?>

    <script type="text/javascript">
        var appVar = "<?php echo $projectName; ?>";
    </script>

    <?php
    echo "<title>" . $configArray["banner_label"] . "</title>";
    ?>

    <link rel="stylesheet" href="css/jquery-ui.css"/>
    <link rel="stylesheet" href="css/styles_ubfr.css"/>
    <link rel="stylesheet" href="css/site.css"/>
    <link rel="stylesheet" href="css/header.css"/>
    <link rel="stylesheet" href="css/searchfields.css"/>
    <link rel="stylesheet" href="css/font-awesome.min.css">

    <?php
    if (has_feature("diagram")) {
        echo '<link rel="stylesheet" href="css/facet_year.css" />';
    }

    if (has_feature("facet") || has_feature("diagram")) {
        echo '<link rel="stylesheet" href="css/facet.css" />';
    }

    if (has_feature("filter") || has_feature("additional_search")) {
        echo '<link rel="stylesheet" href="css/filter.css" />';
    }

    if (has_feature("tree")) {
        echo '<link rel="stylesheet" href="css/tree.css" />';
    }
    ?>

    <link rel="stylesheet" href="css/table.css"/>
    <link rel="stylesheet" href="css/tabs.css"/>

    <?php
    if (has_feature("basket")) {
        echo '<link rel="stylesheet" href="css/basket.css" />';
    }
    ?>

    <link rel="stylesheet" href="css/footer.css"/>
    <link rel="shortcut icon" href="css/images/favicon_ubfr.ico"/>

    <script src="js/plugins/jquery.min.js"></script>
    <script src="js/plugins/jquery-ui.min.js"></script>

    <?php
    // Load project specific scripts
    echo '<link rel="stylesheet" type="text/css" href="config/' . $projectName . '/' . $projectName . '_styles.css" />';
    echo '<script src="config/' . $projectName . '/' . $projectName . '_main.js"></script>';
    echo '<script src="config/' . $projectName . '/' . $projectName . '_data.js"></script>';

    if (has_feature("diagram")) {
        echo '<script src="js/plugins/jquery.flot.min.js"></script>';
    }

    if (has_feature("tree")) {
        echo '<script src="js/plugins/jstree.min.js"></script>';
    }
    ?>

    <script src="js/utils/search.js"></script>
    <script src="js/utils/query.js"></script>
    <script src="js/utils/tabs.js"></script>

    <?php
    if (has_feature("site")) {
        echo '<script src="js/utils/site.js"></script>';
    }

    if (has_feature("diagram")) {
        echo '<script src="js/utils/facet_year.js"></script>';
    }

    if (has_feature("facet") || has_feature("diagram")) {
        echo '<script src="js/utils/facet.js"></script>';
    }

    if (has_feature("filter") || has_feature("additional_search")) {
        echo '<script src="js/utils/filter.js"></script>';
    }

    if (has_feature("tree")) {
        echo '<script src="config/' . $projectName . '/' . $projectName . '_tree.js"></script>';
        echo '<script src="js/utils/tree.js"></script>';
    }
    ?>

    <script src="js/utils/table.js"></script>

    <?php
    if (has_feature("basket")) {
        echo '<script src="js/utils/basket.js"></script>';
    }
    ?>

    <!-- Initialisation script ... -->
    <script src="js/utils/init.js"></script>

    <!-- Piwik -->
    <script type="text/javascript">
        var _paq = _paq || [];
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function () {
            var u = (("https:" == document.location.protocol) ? "https" : "http") +
                "://analytics.ub.uni-freiburg.de/";
            _paq.push(['setTrackerUrl', u + 'piwik.php']);

            //Get Piwik ID from php...
            var piwik_id = "<?php echo $configArray["piwik_id"]; ?>";
            _paq.push(['setSiteId', piwik_id]);
            var d = document, g = d.createElement('script'),
                s = d.getElementsByTagName('script')[0];
            g.type = 'text/javascript';
            g.defer = true;
            g.async = true;
            g.src = u + 'piwik.js';
            s.parentNode.insertBefore(g, s);
        })();
    </script>
    <!-- End Piwik Code -->
</head>

<body>
<!-- Piwik no Script Code -->
<noscript>
    <p><img src="http://analytics.ub.uni-freiburg.de/piwik.php?idsite=<?php echo $configArray["piwik_id"]; ?>"
            style="border:0;" alt=""/></p>
</noscript>
<!-- End Piwik Code -->

<noscript>
    <div class="noscriptmsg">
        <h3 class="m_0 blue_header"><?php echo $configArray["banner_label"] ?> - Fehler</h3>
        <div class="m_t_10 m_b_10 t_c">In Ihrem Browser ist derzeit JavaScript deaktiviert.<br/>Bitte aktivieren Sie
            JavaScript um diese Seite nutzen zu können.
        </div>
    </div>
</noscript>

<div class="pagecontainer">

    <?php
    require_once __DIR__ . '/php/includes/header.php';
    ?>

    <div class="site_content v_hi" id="site_content_search">

        <?php
        if (has_feature("backlinks")) {
            require_once __DIR__ . '/php/includes/backlinks.php';
        }

        if (has_feature("filter")) {
            require_once __DIR__ . '/php/includes/filters.php';
        }

        if (has_feature("tree")) {
            require_once __DIR__ . '/php/includes/trees.php';
        }
        ?>

        <div id="search">
            <?php
            require_once __DIR__ . '/php/includes/searchfields.php';

            if (has_feature("facet") || has_feature("diagram")) {
                require_once __DIR__ . '/php/includes/facets.php';
            }
            ?>
        </div>

        <div id="results" class="blue_border">

            <div class="tabs_header">
                <?php
                $result_label = isset($configArray["result_label"]) ? $configArray["result_label"] : "Ergebnisse";

                echo '<div data-tab="result"><span id="result_label">' . $result_label .
                    '</span><small id="small_result">(0)</small></div>';

                if (has_feature("basket")) {
                    echo '<div data-tab="basket" class="m_l_5">
                          <span id="basket_label">Merkliste</span>
                          <small id="small_basket">(0)</small>
                          </div>';
                }
                ?>
            </div>

            <!-- Tabs: content -->
            <div class="tabs_body p_t_10 p_l_10">

                <?php
                // Facets
                require_once __DIR__ . '/php/includes/table.php';

                if (has_feature("basket")) {
                    require_once __DIR__ . '/php/includes/basket.php';
                }
                ?>
            </div>
        </div>
    </div>

    <?php
    if (has_feature("site")) {
        // load additional pages (start, category overview)
        require_once __DIR__ . '/php/includes/sites.php';
    }
    require_once __DIR__ . '/php/includes/footer.php';
    ?>
</div>
</body>
</html>