<?php
date_default_timezone_set('Asia/Shanghai');

function connDB($dbConf)
{
	$conn = mysqli_connect($dbConf['host'], $dbConf['user'], $dbConf['pass');

	if ($conn) {
		mysql_query($conn, 'set names utf8;');
		return $conn;
	}
	return false;
}

function getDb()
{
	$db1 = array(
		'host' => '数据库地址',
		'user' => '用户名',
		'pass' => '密码',
		'DB_CHARSET'=> 'utf8mb4'
	);
	
	$db = connDB($db1);
	
	mysqli_select_db($db, '数据库名称');

	mysqli_query($db, 'set names utf8mb4');
	
	return $db;
}

function getTablePrefix(){
	return '表前缀';
}

function getAppId(){
	return '微信小程序appid';
}

function getAppSecret(){
	return '微信小程序appsecret';
}
