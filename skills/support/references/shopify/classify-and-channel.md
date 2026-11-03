# Classify, channel, and case packet

## 1. Classify before contact

Read [support-routes.md](support-routes.md), then read exactly one primary issue reference:

- [billing.md](billing.md) for invoices, subscriptions, plans, charges, credits, and billing ownership;
- [shipping.md](shipping.md) for Shopify Shipping labels, carriers, delivery failures, claims, insurance, and service refunds;
- [payments.md](payments.md) for Shopify Payments payouts, holds, reserves, and verification or document requests;
- [general.md](general.md) for storefront, checkout, orders, apps, account access, domains, technical defects, and other issues.

Identify:

- the affected store, organization, market, and timezone;
- the product area and actual owner (Shopify, Shopify Shipping, Shopify Payments, app vendor, carrier, payment gateway, or card network);
- whether there is an in-product record with a deadline (dispute, payout hold, order, billing invoice, shipping claim);
- the desired outcome: fix, refund, dispute response, trace, escalation, policy answer, or documented follow-up.

For card-network chargebacks, use the dedicated Shopify dispute-response procedure. Prepare evidence in the Shopify Admin dispute record or third-party payment provider before its deadline, and submit it only with explicit user authorization. Live support is an escalation channel, not necessarily the system of record.

## 2. Choose and preserve the support channel

Use chat unless the user specifies phone or chat is unavailable. For phone support, use an available calling tool only when each human-facing message can meet the exact-draft, destination, and approval boundary before delivery; otherwise prepare a call brief for the user. Keep the same case packet, authorization boundaries, advocacy sequence, and completion criteria across both channels.

For chat, use the browser automation available in the current host. Do not require provider-specific browser commands.

1. Inspect the current browser state and reuse an authenticated Shopify support tab when available. Otherwise open `https://help.shopify.com/` in a dedicated tab.
2. Keep Shopify Admin evidence separate from the live support tab. Never navigate an active chat away.
3. Inspect the page before each interaction and target controls by their current role, label, or visible text.
4. Sign in and verify the active organization and store before contact. Ask the user to complete MFA, identity checks, or other user-owned security steps.
5. Open human support chat and wait until an advisor has joined before sending the case.

### Recover from UI changes

Treat the UI as a state machine, not a fixed sequence of selectors: Help Center, contact menu, queue, connect, live chat, closure warning, and ended transcript. After every action, inspect the page and verify the expected state from visible text or controls.

- If the expected state is absent, inspect the page again and use its current semantic role, visible text, or accessible name. Do not rely on stale selectors or coordinates.
- If a browser action or network response is uncertain, inspect the existing tab before retrying. Never resend a message, open a second chat, or navigate away until the current state is known.
- Use browser evaluation only when ordinary page controls are insufficient. Limit it to inspecting or activating a current visible control, then verify the result.
- Recover cookie banners, menus, login redirects, and store-switcher changes in place. Stop only for user-owned MFA, identity verification, or a genuinely unavailable browser.

Do not open a replacement chat while an active one exists. If a security challenge, MFA, or owner verification appears, ask the user to complete it; never bypass it.

## 3. Prepare the case packet

Collect only evidence relevant to the issue. Default packet:

- store/organization, issue title, affected URL or feature, and timezone;
- order, payment, payout, subscription, label, tracking, invoice, or error IDs as applicable;
- dates, exact expected result, actual result, and business/customer impact;
- screenshots or a short recording, plus reproducible steps for technical defects;
- the remedy requested and any time-sensitive deadline.

Avoid exposing passwords, full payment details, API secrets, or unnecessary customer data. Use an existing Shopify support email or Support Inbox thread when it already contains the relevant history; it is usually faster than starting a new case.
