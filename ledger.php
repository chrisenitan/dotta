<?php

$conne=mysqli_connect("subsdb.c9xrrfeu2tdc.us-east-2.rds.amazonaws.com","admin","hA8!cB3%","subsdb"); #server, username, password, database
  
//get today 
$todayDate = date("Y-m-d");
$dateMonth = date("m");

//log monthlys
$holder = mysqli_query($conne,"SELECT * FROM subs WHERE `date` = '12' AND  frequency = 'Every Month'"); 
$gotSub = false;
while($row2 = mysqli_fetch_array($holder))
{
$gotSub = true;
$name = $row2['name'];
$username = $row2['username'];
$ref = $row2['ref'];
$cost = $row2['cost'];
$dateEntered = $row2['dateEntered'];
//$gotSuRef = $row2['gotSuRef'];

$logLedger = "INSERT INTO ledger (username, ref, cost, dateEntered) VALUES ('$username', '$ref', '$cost', '$todayDate')";

if (!mysqli_query($conne,$logLedger))
  {
  die('Error: ' . mysqli_error($conne));
  }
  
  
echo"welcome $name <br>";

} 
if($gotSub == false){
    echo "user not found";
}

//make case for 31sts


//weekly case
$holderWeek = mysqli_query($conne,"SELECT * FROM subs WHERE `date` = '12' AND  frequency = 'Every Week'"); 
$gotWeeklySub = false;
while($row3 = mysqli_fetch_array($holderWeek))
{
$gotWeeklySub = true;
$wname = $row3['name'];
$wusername = $row3['username'];
$wref = $row3['ref'];
$wcost = $row3['cost'];
$wdateEntered = $row3['dateEntered'];
//$gotSuRef = $row2['gotSuRef'];

$logWeeklyLedger = "INSERT INTO ledger (username, ref, cost, dateEntered) VALUES ('$wusername', '$wref', '$wcost', '$wtodayDate')";

if (!mysqli_query($conne,$logWeeklyLedger))
  {
  die('Error: ' . mysqli_error($conne));
  }
  
  
echo"welcome $wname <br>";

} 
if($gotWeeklySub == false){
    echo "No weekly found";
}

?>