# Shopify support routes

## Select one primary reference

Classify the issue before opening live support:

| Category | Reference | Typical scope |
|---|---|---|
| Billing | [billing.md](billing.md) | Invoices, subscriptions, plans, charges, credits, refunds, and billing ownership. |
| Shipping | [shipping.md](shipping.md) | Shopify Shipping labels, carriers, delivery failures, claims, insurance, tracers, and service refunds. |
| General | [general.md](general.md) | Storefront, checkout, orders, apps, account access, domains, technical defects, and anything outside billing or shipping. |

Read exactly one primary reference unless the issue genuinely crosses categories. Keep shared conversation behavior in `SKILL.md`; use these references for domain ownership, evidence, escalation paths, and completion criteria.

## Choose the primary door

| Issue | Primary record/owner | Use live chat for |
|---|---|---|
| Card chargeback or payment dispute | Dedicated Shopify dispute-response procedure | Route out of live support unless the task is only to contact support about record access or a Shopify-side defect. |
| Shopify Payments payout, reserve, hold, or verification | Shopify Payments/payout record; see [payments](payments.md) | Eligibility, review status, account-specific escalation, and the case trail. |
| Shopify Shipping label, carrier delay, service refund, or claim | Shopify Support/Shopify Shipping when the label was bought through Shopify | Carrier trace, claim eligibility, service refund process, and label-account escalation. Use the carrier directly only when the merchant bought the label directly. |
| Order, fulfillment, refund, or inventory behavior | Shopify Admin order/fulfillment record | Product behavior, audit trail, or escalation after collecting the order/timeline. |
| Billing, plan, invoice, or app charge | Settings > Billing or the app's billing record | Billing correction, proration, ownership, and an itemized explanation. |
| Storefront, checkout, markets, tax, shipping rates, theme, or admin defect | Reproduce in the affected store and capture URL/error/context | Platform diagnosis, known incidents, escalation, or workaround. Include browser/device and exact steps. |
| Third-party app or integration | App vendor's support first, unless Shopify owns the failing surface | Platform conflict, API/platform limits, billing ownership, or vendor-routing confirmation. |
| API, webhooks, custom app, or developer issue | Shopify developer docs/status and the app/developer context | Platform bug report, API limit clarification, escalation with request IDs and reproducible payloads. Never share credentials. |
| Login, staff access, organization, domain, or verification | Shopify Admin/account owner workflow | Navigation, account escalation, and policy guidance. The user must complete MFA, recovery, or identity checks. |
| Site-wide suspected outage | Shopify status page plus affected feature evidence | Incident confirmation and merchant-specific impact only after checking status. |

## Organization and store selection

- Verify the merchant/store name at the top of Help Center and Admin before sharing any order or billing data.
- Use the Help Center account/store switcher if the wrong organization is selected. Record the intended store name in the opening message.
- Keep the support chat in one browser tab. Open Admin, order, tracking, or email in separate tabs so the chat session survives navigation and security redirects.
- If chat is unavailable and calling tools exist, use phone support. Otherwise, verify login and organization selection, then use the existing Support Inbox or email thread. Do not cold-email a generic Shopify address unless Shopify explicitly instructed it.

## Escalation questions

Use these when an advisor says they need time or the result depends on a later event:

1. What team owns the next action?
2. Is a case now open, and what is its reference number?
3. What exact trigger must occur before the next step?
4. What deadline applies, measured from which date?
5. What evidence will be required when resuming the case?
6. Will the transcript/email be the continuation thread, and who follows up?

## Stop conditions

End support work when the issue is fixed and verified, or when the case has a durable reference, owner, next action, and deadline. If Shopify cannot provide a deadline, record that explicitly along with the continuation channel. Treat a required user security step or third-party-owner handoff as a valid stop only after documenting it. Do not end with a vague instruction to "check back later."
