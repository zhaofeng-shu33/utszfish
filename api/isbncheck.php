<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include_once "mysql.php";
include_once "functions.php";
$postdata=file_get_contents("php://input");
$jsondata=json_decode($postdata);

$isbn=$jsondata->isbn;
$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}




$db = getDb();
$sql="SELECT * from ISBN where isbn='$isbn' LIMIT 1";
$res=mysqli_query($db, $sql) or die(mysqli_error($db));

if(mysqli_num_rows($res)<=0){
	$opt=array('http'=>array('header'=>"Referer: https://api.douban.com"));   
   	$context=stream_context_create($opt);   
	   
	$jsonfile = file_get_contents('https://api.douban.com/v2/book/isbn/'.$isbn,false, $context); 
	$doubanjson=json_decode($jsonfile);
	if($doubanjson->title){
		$isbn=$doubanjson->isbn13;
		$title=str_replace("'","''",$doubanjson->title);
		$subtitle=str_replace("'","''",$doubanjson->subtitle);
		$author=join(",",$doubanjson->author);
		$coverurl=$doubanjson->images->large;
		$publisher=str_replace("'","''",$doubanjson->publisher);
		$pubdate=$doubanjson->pubdate;
		$pages=$doubanjson->pages;
		$price=$doubanjson->price;
		$bookdesc=str_replace("'","''",$doubanjson->summary);
		$authordesc=str_replace("'","''",$doubanjson->author_intro);

		$tags=array();
		for ($i=0; $i < count($doubanjson->tags); $i++) { 
			$tags[]=$doubanjson->tags[$i]->name;
		}
		$tagsStr=join(",",$tags);

		$coverLocalUrl="covers/".$isbn.".jpg";
		file_put_contents("/var/www/html/upload/ISBN/".$coverLocalUrl, file_get_contents($coverurl));

		$sql="INSERT into ISBN (isbn,coverurl,title,subtitle,author,publisher,pubdate,pages,price,bookdesc,authordesc,tags) values('$isbn','$coverLocalUrl','$title','$subtitle','$author','$publisher','$pubdate','$pages','$price','$bookdesc','$authordesc','$tagsStr')";
		$res=mysqli_query($db, $sql) or die(mysqli_error($db));

		exitJson(0,"",array('isbn'=>$isbn,'title'=>$title,'coverurl'=>"https://jnsii.com/ISBN/".$coverLocalUrl,'subtitle'=>$subtitle,'author'=>$author,'publisher'=>$publisher,'bookdesc'=>$bookdesc));
	}else{
		exitJson(1,"没有找到相应的书籍");
	}
}else{
	$row = mysqli_fetch_assoc($res);
	$isbn=$row['isbn'];
	$title=$row['title'];
	$subtitle=$row['subtitle'];
	$author=$row['author'];
	$coverurl=$row['coverurl'];
	$publisher=$row['publisher'];
	$bookdesc=$row['bookdesc'];
	exitJson(0,"",array('isbn'=>$isbn,'title'=>$title,'coverurl'=>"https://www.leidenschaft.cn/upload/ISBN/".$coverurl,'subtitle'=>$subtitle,'author'=>$author,'publisher'=>$publisher,'bookdesc'=>$bookdesc));
}

// echo 'http://douban.com/isbn/'.$isbn.'/';
// phpQuery::newDocumentFile('http://douban.com/isbn/'.$isbn.'/'); 
// echo pq("#wrapper")->html(); 


?>
