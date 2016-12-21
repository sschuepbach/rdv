<?php

function create_pdf_entry($pdf, $id, $doc) {

    $entry = "";

    $entry .= get_value($doc, "AREA_CLEAN_all_string", "Area");
    $entry .= get_value($doc, "COUNTY_CLEAN_all_string", "County");
    $entry .= get_value($doc, "LOC_CLEAN_all_string", "Location");
    $entry .= get_value($doc, "SPEAKER_AGE_CLEAN_all_string", "Speaker Age");
    $entry .= get_value($doc, "SPEAKER_SEX_CLEAN_all_facet", "Speaker Sex");
    $entry .= get_value($doc, "TEXTS_all_string", "Filename");

    $entry = clean_data($entry);

    $pdf->MultiCell(0, 5, $entry, 1);

    $pdf->Ln();
}
