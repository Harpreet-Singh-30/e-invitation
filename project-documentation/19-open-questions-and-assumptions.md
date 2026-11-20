# 19. Open Questions, Strategic Hypotheses & Business Assumptions

> **Document Version:** 1.0.0  
> **Author:** Senior Project Manager & Lead Product Strategist  
> **Status:** Open for Executive Review  
> **Review Cycle:** Bi-Weekly Product Council

---

## 1. Key Business Hypotheses & Validation Experiments

### Hypothesis 1: Pay-Per-Event Price Sensitivity (₹299 vs ₹499 vs ₹999)
* **The Assumption:** Indian event hosts are willing to pay ₹299–₹499 spontaneously via UPI for an invitation that saves them ₹15,000+ on physical printed cards, but demand drops sharply above ₹500.
* **Validation Test:** Run an A/B test on 500 new host signups:
  * Variant A: Standard tier at ₹299, Premium at ₹499.
  * Variant B: Standard tier at ₹499, Premium at ₹999 (with included physical printable PDF export).
* **Success Metric:** Total Gross Merchandise Value (GMV) and checkout conversion rate.

### Hypothesis 2: Organic Viral Loop via Public Invitations
* **The Assumption:** Every published invitation viewed by 100+ wedding or party guests serves as a free customer acquisition channel if an elegant "Design your own invitation on InviteHub" badge is visible on free tier invites.
* **Validation Test:** Track referral UTM parameters on the footer badge: `?ref=invitation_footer&slug=:slug`.
* **Success Metric:** Viral K-factor > 0.35 (meaning every 3 events generate 1 new host signup organically).

---

## 3. Open Architectural & Product Questions

### Question 1: WhatsApp Business Cloud API vs Native Web Links
* **Current Implementation:** Native web links (`https://wa.me/?text=...`) which open the user's local WhatsApp client at zero cost.
* **Strategic Alternative:** Integrate official Meta WhatsApp Business Cloud API to send automated RSVP confirmations, reminder broadcasts, and location pins directly to guest phone numbers.
* **Open Decision:** Does the operational overhead of Meta Business Verification and per-message template fees (₹0.70 per utility message in India) justify the automated delivery experience?
* **Recommendation:** Keep native share links for M3; pilot WhatsApp Cloud API as a paid add-on feature in M4.

### Question 2: Custom Vanity Domains (`rohanandpriya.com`)
* **Current Implementation:** Path-based routing (`invitehub.in/i/rohan-priya-wedding`).
* **Open Decision:** Should InviteHub offer automated DNS domain purchasing and SSL provisioning via Vercel / Cloudflare for high-end Platinum tier events?
* **Technical Complexity:** High. Requires automated CNAME verification and SSL certificate issuance.
* **Recommendation:** Scope for Milestone M5 (Platinum tier exclusive).

### Question 3: Media & Video Asset Storage Provider
* **Current Implementation:** External image URLs and local asset mocks.
* **Production Decision:** Need an enterprise object storage and image optimization pipeline for host photo uploads (pre-wedding shoots, baby photos).
* **Options:**
  1. **Cloudinary:** Automatic mobile compression and responsive face-cropping, but expensive bandwidth tiers.
  2. **Supabase Storage (AWS S3):** Generous free tier, unified under current Supabase billing, predictable pricing.
* **Recommendation:** Standardize on Supabase Storage with client-side image compression before upload.

