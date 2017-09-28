<?php

// load config und FPDF plugin with HTML2PDF
include '../../config/main.php';
include '../../config/' . $projectName . '/' . $projectName . '_main.php';
include '../../config/' . $projectName . '/' . $projectName . '_data.php';
include 'utils.php';
require('../plugins/fpdf/html2pdf.php');

// create new file
$pdf = new PDF_HTML();
$pdf->SetFont('Arial', '', 12);

// If not for each data record anyway down its own page is created only if Term is long enough
if (!has_feature("export_pdf_new_page")) {

    //create a new page in the PDF
    $pdf->AddPage();
}

$id_string = $_POST["id_array"];

$ids = explode(",", $id_string);

foreach ($ids as $id) {

    //If a new page is to be created for each export item (for example, for poems)
    if (has_feature("export_pdf_new_page")) {

        //create a new page in the PDF
        $pdf->AddPage();
    }

    //search url
    $url = "http://localhost:" . $solrPort . "/solr/" . $projectName . "/select?q=id:" . $id . "&wt=phps&omitHeader=true";

    // remember answer
    $serialized_response = file_get_contents($url);

    // unserialise answer
    $respone = unserialize($serialized_response);

    // extract document
    $doc = $respone["response"]["docs"][0];

    // add entry in pdf
    create_pdf_entry($pdf, $id, $doc);
}

// create pdf and save
$pdf->Output('export.pdf', 'D');

// Get values and print
function get_value($doc, $field, $label = null, $default_to_ignore = null) {
    $output = "";
    if (isset($doc[$field])) {

        $value = $doc[$field];

        //Do not insert default values (for example 0 for title without year) 
        if ($value !== $default_to_ignore) {

            if ($label !== null) {
                $output = $label . ": ";
            }

            if (is_array($value)) {
                $output .= implode("; ", $value);
            } else {
                $output .= $value;
            }

            // add break
            $output .= "\n";
        }
    }

    return $output;
}

/**
 * Adapts data for PDF export
 * @param String $data
 * @return String UTF8 encoded
 */
function clean_data($data) {

    //Adjust space and apostrophe Customize PDF export
    $data = str_replace("&nbsp;", " ", $data);
    $data = str_replace("’", "'", $data);
    $data = str_replace("‘", "'", $data);
    $data = str_replace("“", "\"", $data);
    $data = str_replace("”", "\"", $data);
    $data = str_replace("—", "---", $data);

    return utf8_decode($data);
}
