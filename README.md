<p align="center">
<img width="200" src="public/images/dotta_960.png">
<br>
Website:
<a href="https://dotta.vrixe.com">https://dotta.vrixe.com</a>
<br>
<b>A subscription management and tracking webapp</b>
</p>

## About Dotta

Dotta is a `NodeJS` app that give you a visual presentation and log of all your recurring subcriptions.

- Dotta is a [Vrixe](https://github.com/chrisenitan/vrixe) tool

## What it does in details

- Create, edit subscriptions
- List subscriptions created
- Coolate information and statistics amount subscriptions (individual and cummulative)
- Work in progress
  - Notify users of upcomiing of billed subscriptions
  - Other managements: disable, cancel and group subscriptions

## Product image

<img width="100%" src="public/images/product.png">

## Code Setup

**This document assumes you have some knowledge of npm and javascript**<br>

- Clone repo
- Install dependencies via npm `npm install`
- Setup env file to connect to database
  - Env and database schema is limited to contributors
- Start the app with the script `npm start`

## Feedbacks and feature requests

- Please use this <a target="_blank" href="https://forms.gle/nNLY7e6ET1GQBwyN6">Google Form</a>

## Deployment

- Hosting and DNS is via Namecheap
- Cpanel handles both Node App engine and Git version control
- Git account is connected to the Git version control in the Cpanel account which pulls latest changes from `main` branch into a seperate folder
- Deploy `.panel.yml` used in Node App Setup contains script to copy latest files from pulled repo folder into hosting root dir
- After which you need to restart the node app via the Cpanel

**Cron Jobs**

- `ledger.php` handles logging all subscription according to their frequeicny and is ran once per day
