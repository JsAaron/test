<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2015/4/1
 * Time: 21:01
 */

require("main.php");




//echo phpinfo();

//打开sqlite数据库
//$db = @sqlite_open("MM.sqlite", 0666, $error); // 不支持
$db = new PDO('sqlite:xxtebook.db');
//添加一个叫做foo的数据库
//@sqlite_query($db, "CREATE TABLE foo (bar varchar(10))");
//插入一条记录
//@sqlite_query($db, "INSERT INTO foo VALUES ('fnord')");
//检索所有记录
$result = $db->query('select * from setting');
//打印获取的结果
foreach($result as $row){
    echo $row[1];
    echo "<br>";
}