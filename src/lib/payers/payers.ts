/**
 * Registry of major Medicare Advantage payers. Powers per-payer filing
 * guidance and the programmatic SEO pages at /appeals/[slug].
 *
 * Appeal mailing addresses and fax numbers are PLAN-specific and printed on
 * each denial notice, so we deliberately do not hardcode them — `appealFax`
 * and `appealAddress` stay null until verified per plan, and all guidance
 * falls back to "use the address/fax on your denial notice."
 */

export interface Payer {
  slug: string;
  name: string;
  parentOrg: string;
  /** Public member appeals/grievances info page. */
  appealsUrl: string | null;
  appealFax: string | null;
  appealAddress: string | null;
  /** 2–3 hand-written sentences of unique page copy (avoids thin content). */
  seoBlurb: string;
  notes: string | null;
}

export const payers: Payer[] = [
  {
    slug: "unitedhealthcare",
    name: "UnitedHealthcare",
    parentOrg: "UnitedHealth Group",
    appealsUrl: "https://www.uhc.com/medicare/member-resources/medicare-appeals-grievances",
    appealFax: null,
    appealAddress: null,
    seoBlurb:
      "UnitedHealthcare is the largest Medicare Advantage insurer in the country, and its prior-authorization denials — especially for skilled nursing and post-acute care — are among the most commonly appealed. UnitedHealthcare members can file a Level 1 reconsideration by mail, fax, or through the member portal, and federal data shows most well-documented appeals against MA denials succeed.",
    notes: "High denial volume in post-acute care (naviHealth/Home & Community criteria).",
  },
  {
    slug: "humana",
    name: "Humana",
    parentOrg: "Humana Inc.",
    appealsUrl: "https://www.humana.com/exceptions-appeals/medicare-appeals",
    appealFax: null,
    appealAddress: null,
    seoBlurb:
      "Humana is the second-largest Medicare Advantage carrier, with a heavy concentration of members in HMO plans where out-of-network and prior-authorization denials are frequent. Humana accepts reconsideration requests by mail and fax, and expedited (72-hour) review when a treating physician supports it.",
    notes: null,
  },
  {
    slug: "aetna",
    name: "Aetna Medicare",
    parentOrg: "CVS Health",
    appealsUrl: "https://www.aetna.com/medicare/contact-us/complaints-grievances-appeals.html",
    appealFax: null,
    appealAddress: null,
    seoBlurb:
      "Aetna, part of CVS Health, runs one of the fastest-growing Medicare Advantage books in the country. Members commonly see denials coded as \"not medically necessary\" that rely on internal clinical-policy bulletins — criteria the plan must now disclose in the denial notice, which gives appeals a concrete target to rebut.",
    notes: null,
  },
  {
    slug: "elevance",
    name: "Elevance Health (Anthem)",
    parentOrg: "Elevance Health",
    appealsUrl: "https://www.anthem.com/medicare/member-resources",
    appealFax: null,
    appealAddress: null,
    seoBlurb:
      "Elevance Health — formerly Anthem — sells Medicare Advantage plans under Anthem Blue Cross and affiliated Blue brands in 14+ states. Because Blue-branded plans are run by state entities, the appeal address on your denial notice is the one that controls; the federal 65-day reconsideration window applies regardless of state.",
    notes: "Blue-branded; plan entity varies by state.",
  },
  {
    slug: "kaiser",
    name: "Kaiser Permanente",
    parentOrg: "Kaiser Foundation Health Plan",
    appealsUrl: "https://healthy.kaiserpermanente.org/support/medicare-appeals",
    appealFax: null,
    appealAddress: null,
    seoBlurb:
      "Kaiser Permanente has the lowest denial rate of any major Medicare Advantage carrier, but its integrated model means denials usually involve out-of-network or referral disputes. Kaiser's regional member-services offices handle reconsiderations, and the standard federal appeal timeline applies.",
    notes: "Lowest denial rate of major carriers (~6%).",
  },
  {
    slug: "centene-wellcare",
    name: "Wellcare (Centene)",
    parentOrg: "Centene Corporation",
    appealsUrl: "https://www.wellcare.com/en/members/medicare/appeals-grievances",
    appealFax: null,
    appealAddress: null,
    seoBlurb:
      "Wellcare, Centene's Medicare brand, has historically posted some of the highest claim-denial rates among large carriers — which also means a large share of its denials are overturnable on appeal. Wellcare accepts Level 1 reconsiderations by mail and fax with the standard 65-day window.",
    notes: "Centene's marketplace denial rate ~21%, highest of major carriers.",
  },
  {
    slug: "cigna",
    name: "Cigna Healthcare Medicare",
    parentOrg: "The Cigna Group (HCSC pending/completed transition)",
    appealsUrl: "https://www.cigna.com/medicare/member-resources/customer-appeals-process",
    appealFax: null,
    appealAddress: null,
    seoBlurb:
      "Cigna's Medicare Advantage plans (in transition to HCSC ownership) frequently issue prior-authorization denials for imaging, DME, and home health. Cigna offers a peer-to-peer review for providers, but members retain the independent right to file a reconsideration within 65 days.",
    notes: null,
  },
  {
    slug: "bcbs",
    name: "Blue Cross Blue Shield plans",
    parentOrg: "Independent BCBS licensees",
    appealsUrl: "https://www.bcbs.com/member-services",
    appealFax: null,
    appealAddress: null,
    seoBlurb:
      "Dozens of independent Blue Cross Blue Shield licensees sell Medicare Advantage plans, each with its own appeals mailbox — the address on your denial notice is the one that matters. All of them are bound by the same federal Medicare Advantage rules: 65 days to file, 30-day standard decisions, and automatic escalation to an independent reviewer if the plan upholds its denial.",
    notes: "Per-state licensee; address must come from the member's notice.",
  },
  {
    slug: "devoted",
    name: "Devoted Health",
    parentOrg: "Devoted Health, Inc.",
    appealsUrl: "https://www.devoted.com/members/appeals-and-grievances/",
    appealFax: null,
    appealAddress: null,
    seoBlurb:
      "Devoted Health is a fast-growing Medicare Advantage startup known for service quality, but its prior-authorization program still produces denials — particularly for home health and DME. Devoted publishes a clear appeals process and accepts expedited requests when delay would jeopardize health.",
    notes: null,
  },
  {
    slug: "scan",
    name: "SCAN Health Plan",
    parentOrg: "SCAN Group",
    appealsUrl: "https://www.scanhealthplan.com/members/appeals-and-grievances",
    appealFax: null,
    appealAddress: null,
    seoBlurb:
      "SCAN Health Plan is a senior-focused nonprofit Medicare Advantage carrier concentrated in the western US. SCAN denials are commonly tied to step-therapy and site-of-care rules; its appeals unit accepts reconsiderations by mail and fax within the standard federal window.",
    notes: null,
  },
];

export function getPayer(slug: string): Payer | undefined {
  return payers.find((p) => p.slug === slug);
}

/** Best-effort match from an extracted payer name to a registry entry. */
export function matchPayer(name: string | null | undefined): Payer | undefined {
  if (!name) return undefined;
  const n = name.toLowerCase();
  if (n.includes("united")) return getPayer("unitedhealthcare");
  if (n.includes("humana")) return getPayer("humana");
  if (n.includes("aetna")) return getPayer("aetna");
  if (n.includes("anthem") || n.includes("elevance")) return getPayer("elevance");
  if (n.includes("kaiser")) return getPayer("kaiser");
  if (n.includes("wellcare") || n.includes("centene")) return getPayer("centene-wellcare");
  if (n.includes("cigna")) return getPayer("cigna");
  if (n.includes("blue cross") || n.includes("bcbs") || n.includes("blue shield"))
    return getPayer("bcbs");
  if (n.includes("devoted")) return getPayer("devoted");
  if (n.includes("scan")) return getPayer("scan");
  return undefined;
}
