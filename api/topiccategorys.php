<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
header("Access-Control-Allow-Origin: *");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");

$jsondata=json_decode($postdata);

function countTodayTopics($type){
	$start = strtotime(date('Y-m-d 00:00:00'));
	$end = strtotime(date('Y-m-d H:i:s'));

	$db = getDb();
	$sql = "select count(id) from ".getTablePrefix()."_articles where `type`=$type and createdate>=$start and createdate<=$end and deleted=0";
	$res=mysqli_query($db, $sql) or die(mysqli_error($db));
	$row=mysqli_fetch_row($res);
	return $row[0];
}

function countAllTopics($type){
	$db = getDb();
	$sql = "select count(id) from ".getTablePrefix()."_articles where `type`=$type  and deleted=0";
	$res=mysqli_query($db, $sql) or die(mysqli_error($db));
	$row=mysqli_fetch_row($res);
	return $row[0];
}


$category=array();
$imagePrefix = "";
$category[]=array("title"=>"生活杂谈","type"=>0,"subtitle"=>"分享你所关心的大事小情","icon"=> $imagePrefix . "banner0.jpg");
$category[]=array("title"=>"匿名曝光台","type"=>8,"subtitle"=>"随手拍匿名曝光学城不文明现象","icon"=> $imagePrefix . "banner8.jpg");
$category[]=array("title"=>"摄影分享","type"=>1,"subtitle"=>"用镜头探索光影变幻大学家园","icon"=> $imagePrefix . "banner1.jpg");
//$category[]=array("title"=>"汽车之家","type"=>7,"subtitle"=>"分享选车购车养车行车安全心得","icon"=>"../../images/banner7.jpg");
//$category[]=array("title"=>"家有萌宠","type"=>2,"subtitle"=>"猫猫狗狗花鸟鱼虫萌翻天","icon"=>"../../images/banner2.jpg");
$category[]=array("title"=>"运动健康","type"=>5,"subtitle"=>"绕湖慢跑散步遛弯身心健康比什么都重要","icon"=> $imagePrefix . "banner5.jpg");
$category[]=array("title"=>"美食烹饪","type"=>6,"subtitle"=>"煎炸炒蒸烘焙分享周边美食","icon"=> $imagePrefix . "banner6.jpg");
$category[]=array("title"=>"宿舍租赁","type"=>3,"subtitle"=>"大学城宿舍出租寻租资讯","icon"=> $imagePrefix . "banner3.jpg");
$category[]=array("title"=>"实习招聘","type"=>4,"subtitle"=>"为大学生提供优质工作招聘信息","icon"=>"");
$category[]=array("title"=>"版务区","type"=>9,"subtitle"=>"欢迎同学提建议帮助我们做得更好","icon"=>"");

if(!isDitributionMode($jsondata->bv)){
	$category=array();
}


exitjson(0,"",$category);



?>
