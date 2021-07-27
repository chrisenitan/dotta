
<p style="text-align:center;">
<img  width="100" height="100" src="/public/images/logo_b.png">
<br>
Website:
<a href="https://subs.vrixe.com">subs.vrixe.com</a>
<br>
<b>A webapp to track subscriptions</b>
</p>

## About Subs
Subs is a simple `nodeJs` app that helps you keep a simple visual presentation and log of all your recurring subcriptions.
 - Subs is a [Vrixe](https://github.com/chrisenitan/vrixe) project

## What it does in details
 - Create, edit subscriptions
 - List subscriptions created
 - Coolate information amount subscriptions (individual and cummulative)
 - Other features are work in progress 
    - Working off board https://trello.com/b/EmsTM56q/qboard 

## Code Setup
**This document assumes you have some knowledge of npm and javascript**
**Databse setup is a limitation, will publish sample sql file here**
 - Clone repo
 - Install dependencies via npm `npm install`
 - Setup env file to connect to database
 - Start the app with the script `npm start`

## Cron for ledger? script or cronjob
**Monthly**
- Get all month frequency subs
- For all that date matches (today date)
    - If date is 31 or 30 and (today date) is 30 also
- Action: Get sub data and log into ledger.
    - Update last billed in subs table

**Weekly**
- Get all week frequency subs
- Add 7 to each and for all date matches (today date)
- Action: Get sub data and log into ledger.
    - Update last billed in subs table
