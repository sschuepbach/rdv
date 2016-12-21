<?php

function has_feature($feature) {
    global $configArray;
    return in_array($feature, $configArray["features"]);
}
