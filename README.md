![repo banner](./public/repo-banner.png)

<div align="center"><strong>Lost & Found HQ</strong></div>
<div align="center">Easily reunite your customers with their lost items.<br />A platform to streamline lost and found management with ease.</div>
<br />
<div align="center">
<a href="https://www.lostandfoundhq.com">Website</a> 
<span> · </span>
<a href="https://github.com/internetdrew/lost-and-found-hq">GitHub</a> 
</div>

## Introduction

Lost & Found HQ is a platform that helps businesses streamline their lost and found operations, making reuniting customers with their missing items effortless.

## Why

After losing my wallet, I thought it might be great if the process was a little more transparent. It would be great if instead of hoping staff saved a phone number and passed it on to other coworkers, perpetually keeping an eye out for a lost item, that I could visit a business' lost and found page and see if my item popped up at some point.

## Roadmap

- Log into your dashboard to manage lost and found items at your place of business. ([#12](https://github.com/internetdrew/lost-and-found-hq/pull/12))
- Add your business location to your dashboard. ([#15](https://github.com/internetdrew/lost-and-found-hq/pull/15))
- Users should be able to toggle public viewability on items, as well as edit and delete them. ([#21](https://github.com/internetdrew/lost-and-found-hq/pull/21))
- Add testing to the frontend code ([#22](https://github.com/internetdrew/lost-and-found-hq/pull/22)).
- Visitors can sign up to get launch updates. ([#23](https://github.com/internetdrew/lost-and-found-hq/pull/23))
- Make test account available for visitors to play with. ([#23](https://github.com/internetdrew/lost-and-found-hq/pull/23))
  - Visitors can get the full dashboard experience (test drive).
  - Add a cron job to purge the test user items at midnight.
- Allow users to create a public portal for customers to view items.
- Limit input lengths on dashboard.
- Add input validation to API layer.
- Customers claim items with a form describing their the item in greater detail.
- Notifications of new claims get sent via email and show in app.
- Staff review claims and can approve or request more information.
- When a claim is approved, the system generates a unique code for the customer to communicate at pickup.
- Staff can easily mark items as returned in the system.
- Companies can view analytics on lost item trends and return rates.
- API access for companies to integrate the system with their existing customer service platforms.

## Extended Roadmap

We only go here if the product takes off.

- Multi-location support
- Inter-company item transfer for multi-tenant buildings or shopping centers
