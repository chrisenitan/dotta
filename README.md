# Subs
Subs helps you keep a simple log of all your recurring subcriptions.
 - Subs is a Vrixe sub-project

## Main
**A Node Js based web app**
 - Still work in progress 
 - Working off board https://trello.com/b/EmsTM56q/qboard 

## Setup
**This document assumes you have some knowledge of npm**
 - Clone repo
 - Install dependencies via npm `npm install`
 - Setup env file to connect to database with below values:
```
    gcpserver = your server
    gcpuser = root
    gcppass = password
    gcpdb = test database
```

## Cron for ledger? script or cronjob
**Monthly**
- Get all month frequency subs
- For all that date matches (today date)
    - If date is 31 or 30 and (today date) is 30 also
- Action: Get sub data and log into ledger.

**Weekly**
- Get all week frequency subs
- Add 7 to each and for all date matches (today date)
- Action: Get sub data and log into ledger.
