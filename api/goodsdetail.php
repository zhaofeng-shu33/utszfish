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

$goodsid=$jsondata->goodsid;
$type=$jsondata->type;

$token=$jsondata->token;

session_start();

$db = getDb();
$sql = "select * from ".getTablePrefix()."_articles where `type` = '$type' and `id`='$goodsid' LIMIT 1";
$res=mysqli_query($db, $sql) or die(mysqli_error($db));
$row = mysqli_fetch_assoc($res);

if($row['id']){
	$sql2="update `".getTablePrefix()."_articles` set viewcount=viewcount+1 where `id`='$goodsid' LIMIT 1";
	mysqli_query($db, $sql2) or die(mysqli_error($db));
    $sql3 = "select talent_type from `".getTablePrefix()."_talent_id_type` where talent_id = '$goodsid'";
    $res = mysqli_query($db, $sql3) or die(mysqli_error($db));
    $row2 = mysqli_fetch_assoc($res);
    $talent_type = $row2['talent_type'];
}

$uid=$_SESSION['openid'];

$item=parseMarketItem($row);
$item['text']=$row['text'];
$item['telephone']=$row['telephone'];
$item['viewcount']=intval($item['viewcount'])+1;
$item['authorInfo']=getUserSimpleInfo($row['authorid']);
$item['commentcount']=getCommentCount($row['id']);
//$item['commentlist']=getCommentList($row['id'],0,20,'desc');
$item['isliked']=isLiked($uid,$row['id']);
$item['likelist']=getLikeList($row['id'],0,50,'desc');
$item['disablecomment']=intval($row['disablecomment']);

$item['talent_type'] = intval($talent_type);

if(!isDitributionMode($jsondata->bv)){
	$item['disablecomment']=1;
}

exitJson(0,"",$item);


?>
