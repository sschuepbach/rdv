<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Text</title>
        <style>
            body {
                white-space: pre-line;
            }
        </style>
    </head>
    <body>
        <?php
        $docid = $_GET["docid"];

        $url = "../../files/fred/text/" . $docid . ".txt";

        $text = file_get_contents($url);

        echo htmlspecialchars($text);
        ?>
    </body>
</html>