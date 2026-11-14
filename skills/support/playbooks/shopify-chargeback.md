### Shopify chargeback

**You own a truthful, complete response and the merchant owns the decision to submit it.** Inspect the current dispute before deciding what evidence it needs. Never invent facts, overstate what evidence proves, or submit without explicit approval.

1. Confirm the store and the owner. Find or create the owning task through `tasks` when this is accepted work. Ask for the store if the request does not name it; never switch stores silently.
2. Inspect the live dispute: connected account data through the host's Shopify integration for order, customer, payment, and fulfillment facts; the browser only for the dispute record and response form shown in Shopify Admin. Capture reason, code, amount, deadline, status, identifiers, required fields, formats, and limits exactly as shown.
3. Gather the case against the dispute reason from real sources only, through `investigate` where a claim needs confirming (tracking actually shows delivery, the address matches, the customer wrote what the merchant says).
4. Build one self-contained file per live upload field and the complete text-field answers, in the merchant's plain voice through `write`.
5. Check every file: readable, ordered, complete, within limits, free of secrets and unrelated personal data. Show the merchant the response reason, the field-to-file mapping, and the full text answers.
6. Obtain explicit approval for that exact response. Re-read the live dispute immediately before acting; stop if anything changed.
7. Upload and submit exactly what was approved, then verify through `verify` that the dispute shows submitted and save the confirmation with the task.
8. Deliver through `deliver` when closure is authorized. Any customer-facing message is a separate draft with its own send approval.

The sections below carry the detail for each step.

## Inspect the live dispute

Use the browser available in the current host. Continue from an existing authenticated Shopify tab when possible. Otherwise open Shopify Admin, select the intended store, and ask the user to complete login, MFA, identity checks, or other user-owned security steps.

Find the order and open its dispute. Read the complete live record and response form. Capture the dispute reason and code, amount and currency, deadline and timezone, status, customer and order identifiers, transaction details, Shopify risk findings, requested response fields, accepted formats, size limits, and any saved draft. Treat the live form as the source for submission requirements because they may differ by dispute type or change over time.

Use an authenticated Shopify API or connected account for reliable read-only order, customer, payment, fulfillment, or activity data when it is available and useful. Use the browser for requirements or state shown only in Shopify Admin. Do not switch stores, accounts, or sources silently.

## Gather the case

Match evidence to the dispute reason. Inspect every source before citing it. Gather only real evidence that helps the reviewer decide, including when available:

- the dispute notice and order record;
- payment and fraud analysis, including AVS, CVV, risk level, payment attempts, and IP evidence;
- fulfillment, tracking, delivery confirmation, signature, and delivery photos;
- product, packaging, shipping-label, service, contract, or accepted-policy evidence;
- complete relevant customer communication from email, chat, messaging, social, or phone notes;
- prior undisputed orders, account history, logins, and verified transactional or marketing engagement;
- refunds, cancellations, replacements, acknowledgements, or other events that change the case.

Follow connected sources when they contain relevant evidence. Keep unrelated private information out of the case. Never expose passwords, credentials, full payment details, or unnecessary customer data. Translate relevant non-English evidence into the response language and preserve the original beside it.

Ask one focused question at a time for evidence that is missing and could materially strengthen or change the response. Explain what it would prove. Do not delay a complete case for weak or unavailable evidence.

## Build the response

Create the case in the active work location or a directory confirmed by the user. Preserve originals. Use available document and PDF capabilities. Produce one self-contained file for each live upload field. Use the exact field names when naming files so their destination is obvious.

Each document should open with a short case summary, then present the strongest evidence first. Include only facts relevant to that field. Add clear captions, readable dates, identifiers, and short explanations of what each item proves. Reuse evidence across files when the live form calls for it.

Write every narrative, caption, translation, and form response as the merchant in plain, natural language. Lead with the strongest verified fact. Avoid legal theater, generic claims, repetition, em dashes, and unsupported conclusions.

Check every generated file. Confirm the pages are readable, correctly ordered, complete, within the live upload limit, and free of accidental secrets or unrelated personal data. Show the user the proposed response reason, field-to-file mapping, and complete text-field answers.

## Upload and submit

Preparing the case does not authorize uploading or submission. Obtain explicit approval for the exact final response. Refresh the dispute immediately before acting and stop if its status, deadline, requirements, or saved response changed.

After approval, upload each file to its verified field and confirm the form retained it. Review the final reason, text, files, order, store, amount, and deadline before submitting. Before any customer-facing message, show its exact draft and destination and obtain separate approval to send. Never refund, cancel, edit the order, contact the customer, or make another Shopify change unless separately authorized.

After submission, verify the dispute status and save the confirmation or reference available in Shopify. Report what was submitted, the deadline or next review state, and any item Shopify did not accept.
