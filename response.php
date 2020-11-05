<?php
$obj = $_POST;
$jsonobj = json_encode($obj);
?>

<script src="js/formdata.js">
var json_success = '<?php echo $jsonobj ?>';
json_success = JSON.parse(json_success);
console.log(json_success);
</script>