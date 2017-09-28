<?php

$source = __DIR__. "/../../create/fred/02 - transform_ods_2_solr_fred.php";

if ($file = fopen($source, "r")) {
    printf("File found %s",$source);
    while(!feof($file)) {
        $line = fgets($file);
        $pattern = '/(?:(?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:(?<!\:|\\\|\')\/\/.*))/';
        $output = preg_match($pattern, $line, $matches);
        foreach ($matches as $value) {
           printf("%s\n", $value);
        }
    }
    fclose($file);
} else {
    printf("File not found %s", $source);
}
