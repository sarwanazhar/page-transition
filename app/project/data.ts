export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  effectType: number;
  caseLabel: string;
  backLabel: string;
  meta: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    slug: "podium-case",
    title: "Podium Storytelling",
    subtitle: "Case Study 01",
    description:
      "This full-screen view seamlessly replaces the moving WebGL canvas component because the layout geometries and background values matched up exactly.",
    image: "/image.jpg",
    effectType: 0,
    caseLabel: "Case Study 01",
    backLabel: "← Back to Projects",
    meta: [
      { label: "Role", value: "Development" },
      { label: "Year", value: "2026" },
    ],
  },
  {
    slug: "running-story",
    title: "Velocity Track",
    subtitle: "Case Study 02",
    description:
      "The Three.js image texture scaled fluidly up to full-bleed dimensions before cleanly turning off visibility to showcase this underlying DOM layer.",
    image: "/red.jpg",
    effectType: 0,
    caseLabel: "Case Study 02",
    backLabel: "← Return to Grid",
    meta: [
      { label: "Engine", value: "WebGL / Next.js" },
      { label: "Year", value: "2026" },
    ],
  },
  {
    slug: "liquid-form",
    title: "Liquid Form",
    subtitle: "Case Study 03",
    description:
      "Organic fluid displacement renders the image as molten glass, warping through procedural noise fields before settling into its final fullscreen state.",
    image: "/image.jpg",
    effectType: 1,
    caseLabel: "Case Study 03",
    backLabel: "← Back",
    meta: [
      { label: "Effect", value: "Liquid Warp" },
      { label: "Year", value: "2026" },
    ],
  },
  {
    slug: "chromatic-lens",
    title: "Chromatic Lens",
    subtitle: "Case Study 04",
    description:
      "Cinematic RGB channel separation splits the color spectrum along the motion axis, producing a high-velocity, multi-layered optical effect during transition.",
    image: "/red.jpg",
    effectType: 2,
    caseLabel: "Case Study 04",
    backLabel: "← Back",
    meta: [
      { label: "Effect", value: "RGB Split" },
      { label: "Year", value: "2026" },
    ],
  },
  {
    slug: "sonic-ripple",
    title: "Sonic Ripple",
    subtitle: "Case Study 05",
    description:
      "A high-density vertex grid transforms the plane into a flexible 3D membrane, propagating a tactile shockwave outward from the click origin.",
    image: "/image.jpg",
    effectType: 3,
    caseLabel: "Case Study 05",
    backLabel: "← Back",
    meta: [
      { label: "Effect", value: "Depth Ripple" },
      { label: "Year", value: "2026" },
    ],
  },
  {
    slug: "motion-trace",
    title: "Motion Trace",
    subtitle: "Case Study 06",
    description:
      "Directional pixel sampling creates an aggressive horizontal motion blur that stretches along the axis of movement, snapping crisp at fullscreen.",
    image: "/red.jpg",
    effectType: 4,
    caseLabel: "Case Study 06",
    backLabel: "← Back",
    meta: [
      { label: "Effect", value: "Motion Blur" },
      { label: "Year", value: "2026" },
    ],
  },
  {
    slug: "paper-turn",
    title: "Paper Turn",
    subtitle: "Case Study 07",
    description:
      "A segmented plane geometry curls along its edge like a physical book page, rolling through a cylindrical projection before revealing the layout beneath.",
    image: "/image.jpg",
    effectType: 5,
    caseLabel: "Case Study 07",
    backLabel: "← Back",
    meta: [
      { label: "Effect", value: "Page Flip" },
      { label: "Year", value: "2026" },
    ],
  },
  {
    slug: "pixel-matrix",
    title: "Pixel Matrix",
    subtitle: "Case Study 08",
    description:
      "Dynamic pixelation dissolves the image into stylized mosaic blocks during expansion, re-assembling into pin-sharp resolution as the new page emerges.",
    image: "/red.jpg",
    effectType: 6,
    caseLabel: "Case Study 08",
    backLabel: "← Back",
    meta: [
      { label: "Effect", value: "Mosaic Morph" },
      { label: "Year", value: "2026" },
    ],
  },
  {
    slug: "ember-dust",
    title: "Ember Dust",
    subtitle: "Case Study 09",
    description:
      "Instead of a uniform fade, the image evaporates outward through a procedural noise field, disintegrating with a glowing ember edge at the dissolution boundary.",
    image: "/image.jpg",
    effectType: 7,
    caseLabel: "Case Study 09",
    backLabel: "← Back",
    meta: [
      { label: "Effect", value: "Noise Dissolve" },
      { label: "Year", value: "2026" },
    ],
  },
  {
    slug: "light-burst",
    title: "Light Burst",
    subtitle: "Case Study 10",
    description:
      "Radial zoom blur rushes the image toward the camera lens with an exposure-driven white bleed, smoothly settling into its final position.",
    image: "/red.jpg",
    effectType: 8,
    caseLabel: "Case Study 10",
    backLabel: "← Back",
    meta: [
      { label: "Effect", value: "Radial Flare" },
      { label: "Year", value: "2026" },
    ],
  },
  {
    slug: "slice-grid",
    title: "Slice Grid",
    subtitle: "Case Study 11",
    description:
      "The image fractures into twelve vertical strips that expand at staggered intervals, producing a structured architectural rhythm during the layout change.",
    image: "/image.jpg",
    effectType: 9,
    caseLabel: "Case Study 11",
    backLabel: "← Back",
    meta: [
      { label: "Effect", value: "Venetian Blind" },
      { label: "Year", value: "2026" },
    ],
  },
  {
    slug: "mirror-prism",
    title: "Mirror Prism",
    subtitle: "Case Study 12",
    description:
      "The image mirrors symmetrically across quadrants and rotates through a kaleidoscopic pattern before unfolding into the standard fullscreen composition.",
    image: "/red.jpg",
    effectType: 10,
    caseLabel: "Case Study 12",
    backLabel: "← Back",
    meta: [
      { label: "Effect", value: "Kaleidoscope" },
      { label: "Year", value: "2026" },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
