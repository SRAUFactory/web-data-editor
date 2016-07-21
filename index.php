<?php
require('classes/WDEController.php');
$controller = new WDEController();
if (isset($_POST["download"])) {
    $response = $controller->download();
    foreach ($response["header"] as $header) {
        header($header);
    }
    $result = $response["body"];
} elseif (isset($_POST["addRow"]) || isset($_POST["addCol"])) {
    $result = $controller->addRowCol();
} elseif (isset($_FILES["uploadFile"])) {
    $result = $controller->upload();
} else {
    $result = $controller->index();
}
echo $result;
