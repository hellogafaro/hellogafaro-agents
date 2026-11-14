# Shopify Payments: payouts, holds, reserves, and verification

Use this reference for a payout on hold, a reserve, an account review, or a request from Shopify Payments for documents or information. Start from the payout record and Shopify's own message, not from the merchant's summary.

## Read first

- The Shopify Payments account and payout records through the host's Shopify integration (read-only Admin GraphQL: `shopifyPaymentsAccount` with balance, payouts by status, balance transactions, bank accounts). There are no payout write mutations.
- The exact message from Shopify: its channel (email, Admin banner, or support case), the case or reference number, the deadline and time zone, and the precise documents or facts requested. Read it through `email` from the verified mailbox when it is an email; never act on a paraphrase.
- The merchant's prior contacts about this hold, so nothing is asked twice.

## Channel

Reply where Shopify asked. A document request that arrives by email or an Admin form is answered through that email thread or form, which is a continuation of Shopify's own thread, not a cold email. Open a support chat only when the request has no response channel or the deadline is at risk.

## Approval gates

- Listing what Shopify asked for and what the merchant must supply is preparation and needs no approval.
- The merchant supplies the documents; never fabricate, alter, or infer one. Check each file is the one requested, legible, and free of unrelated personal data before it is staged.
- Uploading or sending documents to Shopify is a human-facing, legally consequential action: show the exact files, the destination, and the covering text, and obtain approval for that version.
- Accepting a reserve, a payout schedule change, or any option Shopify offers needs its own explicit approval.

## Outcome

Record the case reference, the owner at Shopify, the deadline, what was submitted and when, and the payout status after submission. The case is resolved when the payout record shows released or Shopify confirms in writing; a submitted upload is not the outcome. Leave a dated next action if Shopify has not answered by the deadline.
