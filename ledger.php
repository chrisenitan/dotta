<?php

$conne=mysqli_connect("subsdb.c9xrrfeu2tdc.us-east-2.rds.amazonaws.com","admin","hA8!cB3%","subsdb"); #server, username, password, database
  
//get today 
$todayDate = date("Y-m-d");
$dateMonth = date("m");
$dateDay = date("d");


//make case for 31sts
//define 31 day months array  
$oddMonths = array("0", "1", "2", "4", "6", "7", "8", "10");

$holderMonths = mysqli_query($conne,"SELECT * FROM subs WHERE frequency != '' "); 
$gotSubMonths = false;
while($rowMonths = mysqli_fetch_array($holderMonths))
{
$gotSubMonths = true;
$name = $rowMonths['name'];
$username = $rowMonths['username'];
$ref = $rowMonths['ref'];
$cost = $rowMonths['cost'];
$date = $rowMonths['date'];
$nextlog = $rowMonths['nextlog'];
$frequency = $rowMonths['frequency'];
$dateEntered = $rowMonths['dateEntered'];

//monthly
//if date is today or month is oddmonth and date is 28(all februaries) or month is oddmonth and date is more than 30(31: oddies)
if($frequency == "Every Month" and ($dateDay == $date or (in_array($dateMonth, $oddMonths) and $date == 28) or (in_array($dateMonth, $oddMonths) and $date > 30))){

  $logLedgerMonth = "INSERT INTO ledger (username, ref, cost, dateEntered) VALUES ('$username', '$ref', '$cost', '$todayDate')";

    echo"Logged Month for: $name <br><br>";

    if (!mysqli_query($conne,$logLedgerMonth)) { #after doing all that then close connection
      die('Error: ' . mysqli_error($conne));
    }

}

//weekly
if($frequency == "Every Week" and ($dateDay == $nextlog)){
  $logLedgerWeek = "INSERT INTO ledger (username, ref, cost, dateEntered) VALUES ('$username', '$ref', '$cost', '$todayDate')";

  echo"Logged Week for: $name <br><br>";

  //define next log within month scope
  if($nextlog <= 28){
    $newNextLog = $nextlog + 7;
    echo"Next log is plus six: $ref : $newNextLog <br>";
  }
  else{
    //reset to normal date
    $newNextLog = $date;
    echo"Next log reset to sub date for: $ref : $newNextLog <br>";
  }
  
  $updateWeekLog = "UPDATE subs SET nextlog='$newNextLog' WHERE ref = '$ref'";

  if (!mysqli_query($conne,$updateWeekLog) or !mysqli_query($conne,$logLedgerWeek)){ 
    die('Error: ' . mysqli_error($conne));
  }

}


echo"Completed log review on: $name <br><br>";

}

if($gotSubMonths == false){
    echo "error logging sub in ledger";
}

//close
mysqli_close($conne);

?>