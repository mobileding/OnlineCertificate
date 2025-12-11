// This is your SEO content strategy database.
// Add as many as you want here to create new landing pages instantly.

export interface Template {
  slug: string;           // The URL part (e.g. /create/best-dad)
  title: string;          // The H1 title on the page
  description: string;    // SEO Meta description
  prompt: string;         // The AI Prompt to pre-fill
  color: string;          // Default color
  design: string;         // Default theme
}

export const TEMPLATES: Template[] = [
  {
    slug: "employee-of-the-month",
    title: "Free Employee of the Month Certificate Generator",
    description: "Instantly create a professional Employee of the Month award. Download PDF or verify online.",
    prompt: "A professional corporate award for 'Employee of the Month'. Recognizing outstanding dedication, hard work, and contribution to company success. Formal tone.",
    color: "#1e40af", // Blue
    design: "Modern"
  },
  {
    slug: "best-dad-award",
    title: "World's Best Dad Certificate Maker",
    description: "Funny and heartwarming award for Father's Day or birthdays.",
    prompt: "A fun, heartwarming certificate for 'World's Best Dad'. Awarded for terrible jokes, great hugs, and fixing everything. Playful but sentimental tone.",
    color: "#b45309", // Amber/Gold
    design: "Playful"
  },
  {
    slug: "course-completion",
    title: "Course Completion Certificate Generator",
    description: "Create certificates for your online course, webinar, or workshop.",
    prompt: "A formal academic certificate of completion. Certifying that the recipient has successfully completed the training course with distinction. Standard university style.",
    color: "#0f172a", // Slate
    design: "Ivy"
  },
  {
    slug: "volunteer-appreciation",
    title: "Volunteer Appreciation Certificate",
    description: "Thank your volunteers with a beautiful verified certificate.",
    prompt: "A warm certificate of appreciation for a volunteer. Thanking them for their selfless service and community impact. Grateful and inspiring tone.",
    color: "#15803d", // Green
    design: "Minimal"
  }
];

export function getTemplate(slug: string) {
  return TEMPLATES.find(t => t.slug === slug);
}