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

$uid=$jsondata->uid;
$keyword=$jsondata->keyword;

$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}

$page=0;
if($jsondata->page!=""){
	$page=$jsondata->page;
}
$limit=6;

$db = getDb();
$sql = "select * from ".getTablePrefix()."_articles where `type` = 101 and deleted=0 order by updatetime desc LIMIT ".$limit*$page.",$limit";
if($uid!=""){
	$sql = "select * from ".getTablePrefix()."_articles where `type` = 101 and deleted=0 and authorid='$uid' order by updatetime desc LIMIT ".$limit*$page.",$limit";
}else if($keyword=="积分"){
	$sql = "select * from ".getTablePrefix()."_articles where `type` = 101 and deleted=0 and exchangecoin>0 order by updatetime desc LIMIT ".$limit*$page.",$limit";
}else if($keyword!=""){
	$sql = "select * from ".getTablePrefix()."_articles where `type` = 101 and deleted=0 and `title` like '%$keyword%' order by updatetime desc LIMIT ".$limit*$page.",$limit";
}
$res=mysqli_query($db, $sql) or die(mysqli_error($db));

$filterType = $jsondata->search_type;
$shouldFilter = ($filterType != null && $filterType != '0');
if($shouldFilter){
   $talent_type = intval($filterType) - 1;
}
$list = array();
while ($row = mysqli_fetch_assoc($res)) {
    $talent_id = $row['id'];
    $sql2 = "select talent_type from ".getTablePrefix()."_talent_id_type where talent_id = $talent_id";
    $res2 = mysqli_query($db, $sql2) or die(mysqli_error($db));
    $row2 = mysqli_fetch_assoc($res2);
    if( $shouldFilter && $row2['talent_type'] != $talent_type){
        continue;
    } 
    $list[]=parseMarketItem($row, $row2);
}
if(!isDitributionMode($jsondata->bv)){
	$list = array();
}

exitJson(0,"",$list);

