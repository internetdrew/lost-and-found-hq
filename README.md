# Welcome to Lost and Found HQ

We will build the fuck out of this app in record time.

## How It Works

- A visitor lands on the main page and they see the feed of everything reported lost or found.
- They can then filter by state, allowing them to see everything reported lost in that state.
- In the navbar are two buttons: login and join

## Authentication

- There should be a login and join page for simplicity.
- Usual email and password flow, with confirmation sent to their email address.
- Once the user has confirmed their email address, they get back to the main screen, but this time, they can see the button to add a post in the navbar.
- The user is now logged in.

## Credits and Payments

- Users can purchase credits using Stripe Checkout
- Credits are used to create posts (1 credit = 1 post)
- Users can view their credit balance in their account dashboard.

## Posting Lost Items

- Once the user has purchased a credit, they should be able to add a post with an enabled button in the navbar.
- Posts cost 1 credit ($2 value)
- The user is sent to the /create route.
- Here, they have a form where they can fill out the information.
- Before submission, users must acknowledge that post creation is non-refundable.
- After completing the form, users are prompted to use a credit or purchase credits if needed
- If credits are needed, users are redirected to Stripe Checkout
- Upon successful payment or credit use, the post is created and published
- Once published, the post cannot be refunded or deleted

## Reporting an Item Found

- Users can report found items without using credits.
- A "Report Found" button is available on the post, which then prompts the user claiming to have found it to join.
- The user goes through authentication flow, returning to the /report-found/{postId} route to fill out the form.
- They fill out the form with the following required information:
  - Date and approximate time the item was found
  - Location where the item was found (as specific as possible)
  - Brief description of the item
  - Condition of the item
  - Any identifying marks or features
  - At least one clear photo of the item (MANDATORY)
  - Contact information for the finder (email and/or phone number)
  - Optional: Any additional notes or comments
- A "Mark as Returned" option is available once the item has been claimed by its owner

## Recovery Tracking

- When an owner identifies their lost item, they can initiate a recovery process
- A public "Recovery Log" is created for each item recovery attempt
- The Recovery Log includes:
  - Anonymized identifiers for both the finder and the owner
  - Date and time of the recovery initiation
  - General location of the proposed meetup (city/area, not exact address)
  - Current status of the recovery (e.g., "Initiated", "In Progress", "Completed", "Cancelled")
- Users can update the status of the recovery as it progresses
- The community can view all active Recovery Logs
- Users are encouraged to meet in safe, public locations for item exchanges
- After a successful recovery, both parties can confirm the transaction and leave feedback
- The Recovery Log remains public as a record of successful returns and community trust-building

## Community Features

- Featured stories highlight successful reunions between owners and their lost items
- Local community boards for specific areas or events (e.g., music festivals, airports)
