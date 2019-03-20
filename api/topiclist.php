<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");

$jsondata=json_decode($postdata);
$disabled_type=$jsondata->disabled_type;
$type=$jsondata->type;
$token=$jsondata->token;
$keyword=$jsondata->keyword;

session_start();

$list = array();
if(!isDitributionMode($jsondata->bv)){
	exitJson(0,"",$list);
}

$uid=$_SESSION['openid'];

$page=0;
if($jsondata->page!=""){
	$page=$jsondata->page;
}
$limit=9;

$db = getDb();
//判断uid和keyword是否为空
if($jsondata->uid!=""){
	$uid=$jsondata->uid;
	$uid_string=' and authorid='$uid'' ;
	//$sql = "select * from ".getTablePrefix()."_articles where `type` = $type_i and authorid='$uid' and `title` like '%$keyword%' and deleted=0 order by updatetime desc,createdate desc LIMIT ".$limit*$page_i.",$limit";
}
else{
	$uid_string='' ;
}
if($keyword!=""){
	$keyword_string=' and `title` like '%$keyword%''; 
}
else{
	$keyword_string='';
}
		

if(is_array($type)){
// for array type, only type < 99 is supported, becuase their format is uniform
    if(!is_array($page) || count($type) != count($page)){
        exitJson(0, "", $list);
    }
	
    // use a forloop to query the database and extend $list
    for($x = 0; $x < count($type); $x++){
        $type_i = $type[$x];
        $page_i = $page[$x];
		
		$sql = "select * from ".getTablePrefix()."_articles where `type` = $type_i".$uid_string.$keyword_string." and deleted=0 order by updatetime desc,createdate desc LIMIT ".$limit*$page_i.",$limit";
		/*elseif($jsondata->uid==""&&$keyword!=""){
			$sql = "select * from ".getTablePrefix()."_articles where `type` = $type_i and `title` like '%$keyword%' and deleted=0 order by updatetime desc,createdate desc LIMIT ".$limit*$page_i.",$limit";
		}
		else{
			$sql = "select * from ".getTablePrefix()."_articles where `type` = $type_i and deleted=0 order by updatetime desc,createdate desc LIMIT ".$limit*$page_i.",$limit";
		}*/
        $res=mysqli_query($db, $sql) or die(mysqli_error($db));

        while ($row = mysqli_fetch_assoc($res)) {

	    $item=parseArticleSimpleItem($row);
            $item['text']=mb_substr($item['text'], 0,60,"UTF-8");
            if(mb_strlen($item['text'],"UTF-8")>=60)$item['text']=$item['text']."...";
            $list[] = $item;
           
        }
	
    }
}
else{
if($type!=""){
	$type_string='`type` = $type';
}
else($type==""){
	$type_string='';
}

$sql = "select * from ".getTablePrefix()."_articles where `type` <99 and".$type_string..$uid_string.$keyword_string." deleted=0 order by updatetime desc,createdate desc LIMIT ".$limit*$page.",$limit";


$res=mysqli_query($db, $sql) or die(mysqli_error($db));


while ($row = mysqli_fetch_assoc($res)) {

	$item=parseArticleSimpleItem($row);

    if(count($item['vids'])>0)$item['text']='[视频]'.$item['text'];

    $item['text']=mb_substr($item['text'], 0,60,"UTF-8");
    if(mb_strlen($item['text'],"UTF-8")>=60)$item['text']=$item['text']."...";

    $list[]=$item;
}
}
exitJson(0,"",$list);


?>
