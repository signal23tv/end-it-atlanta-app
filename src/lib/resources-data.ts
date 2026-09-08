/**
 * END IT ATLANTA — Get Connected resource data.
 * Ported verbatim from the original static site's
 * js/resources-data.js. Real, sourced clinic data (Fulton
 * County Board of Health) — not invented. Verify against the
 * official source pages before relying on it for launch.
 */

export const LAST_VERIFIED = "2026-07-13"; // TODO: update after manual re-verification

export const TODD_CONTACT = {
  name: "Todd Hall",
  role: "Public Health Point of Contact",
  phoneTel: "+17708297845",
  phoneDisplay: "770-829-7845",
  email: "todd.hall4@dph.ga.gov",
  emailSubject: "END IT ATLANTA Connection Request",
  emailBody:
    "Hi Todd, I'm reaching out through END IT ATLANTA and would like help connecting with a resource. Please let me know the best next step. Thank you.",
};

export const CDC_PEP_URL = "https://www.cdc.gov/hiv/prevention/pep.html";

export const CDC_LOCATOR = {
  id: "cdc_locator",
  name: "Find Testing Near You",
  url: "https://gettested.cdc.gov/",
  copy: "Search for confidential free or low-cost HIV, STI, and related testing services by ZIP code.",
};

export const FULTON_BOARD_OF_HEALTH = {
  name: "Fulton County Board of Health",
  generalPhone: "770-520-7500",
  prepPhone: "404-613-4708",
  officialPage:
    "https://fultoncountyga.gov/inside-fulton-county/fulton-county-departments/board-of-health",
  locationsPage: "https://fultoncountyboh.com/locations/",
  hivPage:
    "https://fultoncountyboh.com/services/adult-health/hiv/hiv-testing-and-prevention/",
  sexualHealthPage:
    "https://fultoncountyboh.com/services/adult-health/sexual-health/",
  costNote:
    "Testing and prevention services may be free or reduced-cost depending on the service and the visitor's circumstances. Uninsured visitors may qualify for a sliding-fee scale. Call the clinic to confirm current costs, eligibility, documents, and appointment requirements.",
};

export type ServiceTag = "testing" | "prep" | "pep" | "sti" | "unsure";

export type FultonLocation = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  servicesLabel: string;
  services: ServiceTag[];
  note: string;
  officialUrl: string;
};

export const FULTON_LOCATIONS: FultonLocation[] = [
  {
    id: "park_place",
    name: "10 Park Place Health Center",
    address: "10 Park Place SE, 5th Floor, Atlanta, GA 30303",
    phone: "770-520-7500",
    hours:
      "Monday–Friday, 8:00 AM–12:00 PM and 1:00 PM–4:30 PM. Last listed walk-in appointment: 3:00 PM.",
    servicesLabel: "HIV/STI screening and treatment, PrEP, and DoxyPEP",
    services: ["testing", "prep", "sti"],
    note: "Services may be walk-in or appointment-only. Calling before visiting and making an appointment are recommended.",
    officialUrl:
      "https://fultoncountyboh.com/services/adult-health/hiv/hiv-testing-and-prevention/",
  },
  {
    id: "adamsville",
    name: "Adamsville Regional Health Center",
    address: "3700 Martin Luther King Jr. Drive SW, Atlanta, GA 30331",
    phone: "770-520-7323",
    hours: "Monday–Friday, 8:00 AM–12:00 PM and 1:00 PM–4:30 PM",
    servicesLabel: "Sexual-health services and PrEP",
    services: ["prep", "unsure"],
    note: "Call before visiting to confirm service availability and appointment requirements.",
    officialUrl: "https://fultoncountyboh.com/services/adult-health/sexual-health/",
  },
  {
    id: "college_park",
    name: "College Park Regional Health Center",
    address: "1920 John Wesley Avenue, College Park, GA 30337",
    phone: "770-520-7201",
    hours: "Monday–Friday, 8:00 AM–12:00 PM and 1:00 PM–4:30 PM",
    servicesLabel: "HIV testing and STI services",
    services: ["testing", "sti"],
    note: "Call before visiting to confirm service availability and appointment requirements.",
    officialUrl:
      "https://fultoncountyboh.com/services/adult-health/hiv/hiv-testing-and-prevention/",
  },
  {
    id: "neighborhood_union",
    name: "Neighborhood Union Health Center",
    address: "186 Sunset Avenue NW, Atlanta, GA 30314",
    phone: "770-520-7351",
    hours:
      "Sexual-health services: Wednesday–Friday, 8:00 AM–4:30 PM. General building hours and individual clinic hours may differ.",
    servicesLabel: "Sexual-health services and PrEP",
    services: ["prep", "unsure"],
    note: "General building hours and individual clinic hours may differ. Call before visiting.",
    officialUrl: "https://fultoncountyboh.com/services/adult-health/sexual-health/",
  },
];

export type MoreResource = {
  id: string;
  name: string;
  address: string;
  phone: string;
  prepPhone?: string;
  servicesLabel: string;
  services: ServiceTag[];
  note: string;
  officialUrl: string;
  officialUrl2?: string;
};

export const MORE_RESOURCES: MoreResource[] = [
  {
    id: "positive_impact",
    name: "Positive Impact Health Centers — Decatur",
    address: "523 Church Street, Decatur, GA 30030",
    phone: "404-589-9040",
    prepPhone: "678-365-4300",
    servicesLabel:
      "Free HIV testing and prevention counseling; PrEP, PEP, and STI services",
    services: ["testing", "prep", "pep", "sti", "unsure"],
    note: "Call or review the official site to confirm current hours, enrollment, costs, and appointment availability.",
    officialUrl: "https://www.positiveimpacthealthcenters.org/hiv-testing/",
    officialUrl2:
      "https://www.positiveimpacthealthcenters.org/sexual-health-prep-pep-stis/",
  },
];

export function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function telHref(phone: string) {
  return `tel:+1${phone.replace(/[^0-9]/g, "")}`;
}
