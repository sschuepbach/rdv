<!-- Footer -->
<div id="footer">
    <?php
    //Print RDV version
    echo '<span id="rdv_version">RDV version ' . $version . '</span>';
    ?>
    <div id="copyright">&copy; <span id="currentYear"><?php echo date("Y"); ?></span> University of Freiburg, Basel and Strassbourg</div>
    <a href="http://www.ub.uni-freiburg.de/index.php?id=impressum" class="contact">Impressum</a>

    <!-- Pagination at bottom -->
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
</div>