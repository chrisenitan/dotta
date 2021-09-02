<?php
require("php_env.php");
$conne = mysqli_connect($server, $username, $password, $database); #server, username, password, database

//send mail reuse
function sendMail($period)
{
  //send any email
  $subject = "Cpanel ran dotta cron";
  $feed = 'feedback@vrixe.com';
  $from = 'events@vrixe.com'; //or could be a name
  $Mailemail = "enitanchris@gmail.com";
  $headers = 'MIME-Version: 1.0' . "\r\n";
  $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
  $headers .= "Organization: Vrixe\r\n";
  $headers .= "X-Priority: 3\r\n";
  $headers .= "Return-Path: $feed\r\n";

  $headers .= 'From: Dotta ' . $from . "\r\n" .
    'Reply-To: ' . $feed . "\r\n" .
    'X-Mailer: PHP/' . phpversion();
  $message = "<html><body style='margin:auto;max-width:500px;font-family:Titillium Web, Roboto, sans serif;padding:1%'>
Your cron ran today $period
";
  $message .= "</body></html>";
  if (mail($Mailemail, $subject, $message, $headers)) {
    echo "sent mail";
  } else {
    echo "email not sent";
  }
}

//get today
$todayDate = date("Y-m-d");
$dateMonth = date("m");
$dateDay = date("d");

//make case for 31sts
//define 31 day months array  
$oddMonths = array("0", "1", "2", "4", "6", "7", "8", "10");

//cron log
$serve = $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
$time = date("G:i:s");
$insertCronLog = "INSERT INTO ledger (username, ref, cost, dateEntered) VALUES ('$serve', '$time', 'admin', '0', '$todayDate')";
if (!mysqli_query($conne, $insertCronLog)) {
  die('Error: ' . mysqli_error($conne));
}

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
    $logLedgerMonth = "INSERT INTO ledger (username, ref, cost, dateEntered) VALUES ('$username', '$ref', '$name', '$cost', '$todayDate')";
    $updateMonthLog = "UPDATE subs SET lastBilled='$todayDate' WHERE ref = '$ref'";
    echo "<span style='color:red'>Logged Month for: $name : $ref </span> <br><br>";

    if (!mysqli_query($conne, $logLedgerMonth) or !mysqli_query($conne, $updateMonthLog)) {
      die('Error: ' . mysqli_error($conne));
    }
  }

  //weekly
  else if ($frequency == "Every Week" and ($dateDay == $nextLog)) {
    $logLedgerWeek = "INSERT INTO ledger (username, ref, cost, dateEntered) VALUES ('$username', '$ref', '$name', '$cost', '$todayDate')";
    //define next log within current month scope
    if ($nextLog <= 28) {
      $newNextLog = $nextLog + 7;
    } else {
      $newNextLog = $date;
    }
    $updateWeekLog = "UPDATE subs SET nextLog='$newNextLog', lastBilled='$todayDate'  WHERE ref = '$ref'";
    echo "<span style='color:red'>Logged Week for: $name : $ref </span> <br> Next log re-set to sub date for: $ref : $newNextLog <br>";

    if (!mysqli_query($conne, $updateWeekLog) or !mysqli_query($conne, $logLedgerWeek)) {
      die('Error: ' . mysqli_error($conne));
    }
  } else {
    echo "No week or month sub found!";
  }

  echo "Completed log review on: $name <br><br>";
}

if ($gotSubMonths == false) {
  echo "error logging sub in ledger";
}

//close connection
mysqli_close($conne);
