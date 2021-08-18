<?php
require("php_env.php");
$conne = mysqli_connect($server, $username, $password, $database); #server, username, password, database

//get today
$todayDate = date("Y-m-d");
$dateMonth = date("m");
$dateDay = date("d");

//make case for 31sts
//define 31 day months array  
$oddMonths = array("0", "1", "2", "4", "6", "7", "8", "10");

$holderMonths = mysqli_query($conne, "SELECT * FROM subs WHERE frequency != '' ");
$gotSubMonths = false;
while ($rowMonths = mysqli_fetch_array($holderMonths)) {
  $gotSubMonths = true;
  $name = $rowMonths['name'];
  $username = $rowMonths['username'];
  $ref = $rowMonths['ref'];
  $cost = $rowMonths['cost'];
  $date = $rowMonths['date'];
  $nextLog = $rowMonths['nextLog'];
  $frequency = $rowMonths['frequency'];
  $dateEntered = $rowMonths['dateEntered'];

  //monthly
  //only for months, if today is sub day or if month has more tha 30 days and today is 30 or more
  //(in_array($dateMonth, $oddMonths) and $date == 28) or 
  if ($frequency == "Every Month" and ($dateDay == $date or (in_array($dateMonth, $oddMonths) and $date > 30 and $todayDate >= 30))) {

    $logLedgerMonth = "INSERT INTO ledger (username, ref, cost, dateEntered) VALUES ('$username', '$ref', '$cost', '$todayDate')";

    echo "<span style='color:red'>Logged Month for: $name : $ref </span> <br><br>";

    $updateMonthLog = "UPDATE subs SET lastBilled='$todayDate' WHERE ref = '$ref'";

    if (!mysqli_query($conne, $logLedgerMonth) or !mysqli_query($conne, $updateMonthLog)) {
      die('Error: ' . mysqli_error($conne));
    }
  }

  //weekly
  if ($frequency == "Every Week" and ($dateDay == $nextLog)) {
    $logLedgerWeek = "INSERT INTO ledger (username, ref, cost, dateEntered) VALUES ('$username', '$ref', '$cost', '$todayDate')";

    echo "<span style='color:red'>Logged Week for: $name : $ref </span> <br>";

    //define next log within month scope
    if ($nextLog <= 28) {
      $newNextLog = $nextLog + 7;
      echo "Next log is plus six: $ref : $newNextLog <br>";
    } else {
      //reset to normal date
      $newNextLog = $date;
      echo "Next log reset to sub date for: $ref : $newNextLog <br>";
    }

    $updateWeekLog = "UPDATE subs SET nextLog='$newNextLog', lastBilled='$todayDate'  WHERE ref = '$ref'";

    if (!mysqli_query($conne, $updateWeekLog) or !mysqli_query($conne, $logLedgerWeek)) {
      die('Error: ' . mysqli_error($conne));
    }
  }
  echo "Completed log review on: $name <br><br>";
}

if ($gotSubMonths == false) {
  echo "error logging sub in ledger";
}

//close connection
mysqli_close($conne);
