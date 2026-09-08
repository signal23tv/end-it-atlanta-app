/**
 * END IT ATLANTA — HIV & PrEP Learning Lab content.
 * Ported verbatim from the original static site's
 * js/education-data.js. Every fact here is sourced from
 * HIV.gov or the CDC (see each board's `sources`).
 *
 * IMPORTANT: LAST_MEDICALLY_REVIEWED below is a placeholder.
 * This copy has NOT yet been approved by a qualified
 * public-health/clinical reviewer. Do not change this string
 * to claim a real review happened until it actually has.
 */

export const LAST_MEDICALLY_REVIEWED =
  "Pending clinical review by Todd Hall / Fulton County Board of Health";

export type Source = { label: string; url: string };

export type EducationBoard = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  visualType: string;
  paragraphs?: string[];
  diagram?: {
    mainSteps: string[];
    branchLabel: string;
    branchSteps: string[];
  };
  columns?: {
    can: { heading: string; items: string[]; note?: string };
    cannot: { heading: string; items: string[] };
  };
  framing?: string;
  timeline?: { year: string; text: string }[];
  wordBreakdown?: { part: string; meaning: string }[];
  diagramSteps?: string[];
  disclaimer?: string;
  note?: string;
  comparison?: {
    name: string;
    color: string;
    points: string[];
    urgent?: boolean;
  }[];
  urgentLinkLabel?: string;
  urgentLinkHref?: string;
  flowSteps?: string[];
  branches?: { label: string; text: string }[];
  facts?: string[];
  takeaway?: string;
  sources: Source[];
};

export const EDUCATION_BOARDS: EducationBoard[] = [
  {
    id: "what-is-hiv-aids",
    number: "01",
    eyebrow: "LEARNING BOARD 1",
    title: "HIV AND AIDS ARE NOT THE SAME THING.",
    visualType: "diagram-branch",
    paragraphs: [
      "HIV stands for human immunodeficiency virus. It is a virus that attacks cells that help the body fight infections.",
      "AIDS is the most advanced stage of untreated HIV. A person can have HIV without having AIDS. Today's HIV medicine can help people with HIV live long, healthy lives and prevent HIV from progressing to AIDS.",
    ],
    diagram: {
      mainSteps: [
        "HIV virus",
        "targets immune-system cells",
        "without treatment, the immune system can become badly damaged",
      ],
      branchLabel: "With HIV medicine (ART):",
      branchSteps: [
        "HIV medicine (ART)",
        "reduces the amount of virus",
        "protects the immune system",
        "supports a long, healthy life",
      ],
    },
    takeaway: "HIV is treatable. AIDS is not an automatic outcome.",
    sources: [
      {
        label: "HIV.gov: What Are HIV and AIDS?",
        url: "https://www.hiv.gov/hiv-basics/overview/about-hiv-and-aids/what-are-hiv-and-aids",
      },
    ],
  },
  {
    id: "how-transmitted",
    number: "02",
    eyebrow: "LEARNING BOARD 2",
    title: "KNOW THE FACTS. DROP THE STIGMA.",
    visualType: "two-column",
    columns: {
      can: {
        heading:
          "HIV can be transmitted when certain body fluids containing HIV enter another person's bloodstream",
        items: [
          "Blood",
          "Semen and pre-seminal fluid",
          "Rectal fluids",
          "Vaginal fluids",
          "Breast milk",
        ],
        note: "In the United States, the most common routes are anal or vaginal sex without an effective prevention method and sharing injection equipment.",
      },
      cannot: {
        heading: "HIV is not spread by",
        items: [
          "Hugging or shaking hands",
          "Sharing food, dishes, toilets, or drinking glasses",
          "Air or water",
          "Mosquitoes or other insects",
          "Saliva, sweat, or tears that are not mixed with blood",
          "Healthy, unbroken skin",
        ],
      },
    },
    takeaway: "You cannot tell whether someone has HIV by looking at them.",
    sources: [
      {
        label: "HIV.gov: How Is HIV Transmitted?",
        url: "https://www.hiv.gov/hiv-basics/overview/about-hiv-and-aids/how-is-hiv-transmitted",
      },
    ],
  },
  {
    id: "history-timeline",
    number: "03",
    eyebrow: "LEARNING BOARD 3",
    title: "FROM CRISIS TO PREVENTION AND POWER.",
    visualType: "timeline",
    framing:
      "1981 marks the first official U.S. reports of what would later be called AIDS. It is not the year HIV first existed. Scientists identified the virus that causes AIDS in the years that followed.",
    timeline: [
      {
        year: "1981",
        text: "CDC publishes the first official report describing rare infections in five previously healthy gay men in Los Angeles.",
      },
      { year: "1982", text: "CDC uses the term AIDS for the first time." },
      {
        year: "1983",
        text: "Researchers at the Pasteur Institute report the discovery of a retrovirus linked to AIDS.",
      },
      {
        year: "1985",
        text: "The first commercial blood test to detect HIV is licensed, allowing blood-supply screening.",
      },
      { year: "1987", text: "FDA approves AZT, the first medication for AIDS." },
      {
        year: "1995–1997",
        text: "Combination antiretroviral therapy changes HIV treatment; AIDS deaths begin to decline substantially in the United States.",
      },
      {
        year: "2012",
        text: "FDA approves Truvada for PrEP, allowing people without HIV to use medicine to reduce their chance of acquiring HIV.",
      },
      {
        year: "2016–2022",
        text: "The evidence-based U=U message becomes widely affirmed: people who take HIV medicine and maintain an undetectable viral load do not transmit HIV through sex.",
      },
      {
        year: "2021",
        text: "FDA approves the first long-acting injectable PrEP option, expanding prevention beyond daily pills.",
      },
      {
        year: "Today",
        text: "HIV can be prevented and treated, and people with HIV who receive effective care can live long, healthy lives.",
      },
    ],
    sources: [
      {
        label: "HIV.gov: Full Timeline of the HIV and AIDS Epidemic",
        url: "https://www.hiv.gov/hiv-basics/overview/history/hiv-and-aids-timeline",
      },
    ],
  },
  {
    id: "what-is-prep",
    number: "04",
    eyebrow: "LEARNING BOARD 4",
    title: "PrEP IS HIV PREVENTION YOU CONTROL.",
    visualType: "word-breakdown",
    paragraphs: [
      "PrEP stands for pre-exposure prophylaxis. It is medicine for people without HIV that greatly reduces their chance of getting HIV through sex or injection drug use.",
      "PrEP can be taken as pills or shots. A healthcare provider can help you choose an option, complete the needed HIV testing, and plan follow-up care.",
    ],
    wordBreakdown: [
      { part: "PRE", meaning: "before" },
      { part: "EXPOSURE", meaning: "possible contact with HIV" },
      { part: "PROPHYLAXIS", meaning: "medicine used to prevent infection" },
    ],
    takeaway:
      "PrEP is prevention—not HIV treatment and not a sign that someone has HIV.",
    facts: [
      "A person must have an HIV test before starting PrEP.",
      "PrEP must be taken or received as prescribed to work.",
      "PrEP does not prevent other sexually transmitted infections or pregnancy.",
      "Cost and assistance programs vary — connect with the local resources on this page rather than assuming universal free care.",
    ],
    sources: [{ label: "CDC: PrEP", url: "https://www.cdc.gov/hiv/prevention/prep.html" }],
  },
  {
    id: "how-prep-works",
    number: "05",
    eyebrow: "LEARNING BOARD 5",
    title: "PrEP HELPS STOP HIV BEFORE IT TAKES HOLD.",
    visualType: "diagram-steps",
    diagramSteps: [
      "PrEP medicine builds protective levels in the body.",
      "If HIV enters the body, the medicine interferes with the virus's ability to make copies.",
      "This helps stop HIV from establishing a lasting infection.",
      "PrEP works best when taken or received exactly as prescribed.",
    ],
    disclaimer:
      "This is a simplified explanation, not a medical guarantee. PrEP is not a vaccine, a cure, or 100% protection.",
    note: "Different PrEP options have different schedules and times to reach maximum protection. A healthcare provider can explain the option that fits you.",
    sources: [{ label: "CDC: PrEP", url: "https://www.cdc.gov/hiv/prevention/prep.html" }],
  },
  {
    id: "prep-pep-art",
    number: "06",
    eyebrow: "LEARNING BOARD 6",
    title: "THREE TOOLS. THREE DIFFERENT JOBS.",
    visualType: "comparison-table",
    comparison: [
      {
        name: "PrEP",
        color: "red",
        points: [
          "Before a possible exposure",
          "For people without HIV",
          "Ongoing HIV prevention medicine",
        ],
      },
      {
        name: "PEP",
        color: "black",
        points: [
          "After a possible exposure",
          "For emergency situations",
          "Must be started as soon as possible and within 72 hours",
        ],
        urgent: true,
      },
      {
        name: "ART",
        color: "gold",
        points: [
          "For people living with HIV",
          "Treats HIV by reducing the amount of virus in the body",
          "Helps protect health and can lead to an undetectable viral load",
        ],
      },
    ],
    urgentLinkLabel: "POSSIBLE EXPOSURE WITHIN 72 HOURS? GET HELP NOW.",
    urgentLinkHref: "/get-connected#pep-heading",
    sources: [
      {
        label: "HIV.gov: Pre-Exposure Prophylaxis (PrEP)",
        url: "https://www.hiv.gov/hiv-basics/hiv-prevention/using-hiv-medication-to-reduce-risk/pre-exposure-prophylaxis",
      },
      {
        label: "HIV.gov: Post-Exposure Prophylaxis (PEP)",
        url: "https://www.hiv.gov/hiv-basics/hiv-prevention/using-hiv-medication-to-reduce-risk/post-exposure-prophylaxis",
      },
      {
        label: "HIV.gov: HIV Treatment Overview",
        url: "https://www.hiv.gov/hiv-basics/staying-in-hiv-care/hiv-treatment/hiv-treatment-overview",
      },
    ],
  },
  {
    id: "u-equals-u",
    number: "07",
    eyebrow: "LEARNING BOARD 7",
    title: "UNDETECTABLE = UNTRANSMITTABLE.",
    visualType: "flow-simple",
    paragraphs: [
      "People living with HIV who take HIV medicine as prescribed and get and keep an undetectable viral load will not transmit HIV to their HIV-negative partners through sex.",
    ],
    flowSteps: [
      "HIV treatment",
      "viral load becomes and stays undetectable",
      "no sexual transmission of HIV",
    ],
    facts: [
      "Undetectable does not mean cured.",
      "Staying undetectable requires ongoing treatment and viral-load monitoring with a healthcare provider.",
      "People living with HIV deserve accurate information, dignity, love, and respect.",
    ],
    sources: [
      {
        label: "HIV.gov: Viral Suppression and Undetectable Viral Load",
        url: "https://www.hiv.gov/hiv-basics/staying-in-hiv-care/hiv-treatment/viral-suppression",
      },
      {
        label: "CDC: HIV Treatment as Prevention",
        url: "https://www.cdc.gov/hivpartners/php/hiv-treatment/",
      },
    ],
  },
  {
    id: "testing",
    number: "08",
    eyebrow: "LEARNING BOARD 8",
    title: "YOU CANNOT KNOW YOUR HIV STATUS FROM SYMPTOMS.",
    visualType: "flow-branch",
    paragraphs: [
      "The only way to know your HIV status is to get tested. HIV tests look for different signs of HIV, and no test can detect HIV immediately after exposure.",
      "If a possible exposure was recent, a testing provider can help you understand which test is appropriate and whether you should test again later.",
    ],
    flowSteps: ["Get tested", "understand your result", "connect to prevention or treatment"],
    branches: [
      {
        label: "Negative result",
        text: "discuss PrEP and other prevention options if they may benefit you.",
      },
      {
        label: "Positive result",
        text: "confirm the result and connect to HIV care and treatment as soon as possible.",
      },
    ],
    sources: [
      {
        label: "HIV.gov: HIV Testing Overview",
        url: "https://www.hiv.gov/hiv-basics/hiv-testing/learn-about-hiv-testing/hiv-testing-overview",
      },
    ],
  },
];

export const MYTH_FACTS: { myth: string; fact: string }[] = [
  {
    myth: "HIV and AIDS are the same.",
    fact: "HIV is a virus. AIDS is the most advanced stage of untreated HIV.",
  },
  {
    myth: "You can get HIV from hugging, sharing food, or using the same toilet.",
    fact: "HIV is not spread through ordinary day-to-day contact.",
  },
  {
    myth: "PrEP is only for one kind of person.",
    fact: "PrEP is an HIV-prevention option for adults and adolescents without HIV who may benefit from it.",
  },
  {
    myth: "A person with HIV will eventually transmit it to a partner.",
    fact: "A person who maintains an undetectable viral load will not transmit HIV through sex.",
  },
  {
    myth: "A negative test means you never need to think about HIV again.",
    fact: "Testing needs depend on exposure, timing, and ongoing prevention needs. A provider can help you make a testing plan.",
  },
];
