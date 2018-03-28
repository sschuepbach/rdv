<?php

//CORS
header("Access-Control-Allow-Origin: *");

//Name des Solr Cores
$core = "collection1";

//Solr URL
$url = "http://localhost:8080/solr/" . $core . "/select?wt=json&facet=true&facet.mincount=1&json.nl=arrarr&omitHeader=true";

//Ueber GET-Parameter gehen
foreach ($_GET as $param => $value) {

    //facet#field -> field.field (. wuerde von php zu _ daher kommen Werte aus Angular mit #)
    $clean_param = str_replace("#", ".", $param);

    //Wenn es ein Einzelwert ist (z.B. rows)
    if (!is_array($value)) {

        //Parameter setzen: &rows=10
        $url .= "&" . $clean_param . "=" . $value;
    }

    //Wenn es ein Array ist (z.B. fq[])
    else {

        //Ueber Werte gehen (fq[])
        foreach ($value as $single_value) {

            //Parameter einzeln setzen: &fq=...
            $url .= "&" . $clean_param . "=" . $single_value;
        }
    }
}

//Daten aus Solr holen und ausgeben
echo file_get_contents($url);
