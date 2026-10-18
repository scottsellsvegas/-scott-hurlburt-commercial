# Scott Hurlburt Commercial Real Estate — Phase 2

Premium responsive static marketing website with Vercel serverless lead delivery. Existing repository: https://github.com/scottsellsvegas/-scott-hurlburt-commercial. No framework installation or build step required. Vercel Framework Preset: Other; root: repository root; leave build command and output directory unset.

## Pages
Home, Sell Your Property, Properties (RealNex site 7895), Services, About, Contact, Privacy, and 404.

## Validation
Requires Node 22+: `npm test` and `npm run check`. Tests exercise validation and email service success/failure, with the email provider mocked. They do not send email.

## Lead delivery setup
Configure Vercel environment variables for Preview and Production using the dashboard. Never commit secrets.
- `RESEND_API_KEY`: create through Resend.
- `LEAD_FROM_EMAIL`: approved sender on your verified Resend domain, e.g. Website <website@yourdomain.com>.
- `LEAD_TO_EMAIL`: Scott@SimplyVegasCRE.com (confirm preferred destination).

Without all three, the form explicitly states delivery failed and offers a prefilled email draft and direct call/email. It never reports a successful delivery for an unconfigured form. A honeypot and origin check reduce basic spam; configure Vercel rate limiting before a public campaign.

## Final domain / SEO
Set `SITE_URL` to the approved HTTPS production origin and run `node scripts/finalize-seo.js` to generate canonical URLs, absolute social image URLs, sitemap.xml and robots.txt, then commit those changes. Canonicals deliberately omitted before the production domain is approved. Submit the sitemap to Google Search Console after launch. Confirm brokerage compliance, license display, contact destination, photo approval and final copy before production promotion. No invented statistics or testimonials.

## Accounts / deployment
Connect GitHub in Vercel Account Settings → Authentication → Login Connections, then install/authorize the Vercel GitHub app for this exact repository. Connect the existing Vercel project `scott-hurlburt-commercial` to `scottsellsvegas/-scott-hurlburt-commercial`. Do not create another repository or another Vercel project. Branch pushes can then create previews automatically. Preview deployments may require Vercel sign-in under the account's existing protection settings.

## Assets / verified contact information
- Las Vegas skyline: Quintin Gellar / Pexels, https://www.pexels.com/photo/high-angle-view-of-city-scape-833916/ (Pexels free-use photo).
- Scott portrait: existing brokerage agent profile, https://simplyvegasrealestate.com/agent/scott-hurlburt (user's existing professional portrait; confirm approval for publication).
- Phone, address, license: same brokerage profile.
- Email: public Simply Vegas Commercial offering memorandum: https://s3.amazonaws.com/realnex.production/ListingAttachment/639856/3329497.pdf
- Co-founder role: https://realnex.com/agents/7895/scott-hurlburt
- RealNex embed supplied by Scott: https://mpdirect.realnex.com/?site=7895

Market imagery is illustrative, not a specific available listing. RealNex contents and availability are controlled externally. Google Fonts are loaded remotely with system fallbacks. No analytics added.
