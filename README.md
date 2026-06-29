# Next.js 3D Page Transitions

A Next.js portfolio template featuring smooth WebGL-powered page transitions. When you click a project card, the image seamlessly scales up to fullscreen using a custom Three.js shader, then fades out to reveal the destination page.

## Features

- **WebGL Image Transitions** — Custom Three.js shader transitions that take an image from its card bounds and animate it to fullscreen
- **Smooth Scrolling** — Lenis smooth scroll integration with GSAP ticker
- **GSAP Animations** — Timeline-based animations for page transitions and content reveals
- **Static Export** — Configured for static site generation (`output: "export"`)
- **Tailwind CSS v4** — Utility-first styling with CSS imports
- **TypeScript** — Full type safety throughout the project

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Three.js](https://threejs.org/) — WebGL rendering
- [GSAP](https://greensock.com/gsap/) — Animation engine
- [Lenis](https://lenis.darkroom.engineering/) — Smooth scrolling
- [Tailwind CSS v4](https://tailwindcss.com/) — Styling

## Project Structure

```
next-app-3d/
├── app/
│   ├── globals.css          # Global styles & Tailwind imports
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page with project grid
│   └── project/
│       ├── podium-case/     # Project detail page 01
│       └── running-story/   # Project detail page 02
├── components/
│   ├── SmoothScroll.tsx     # Lenis smooth scroll wrapper
│   └── WebGLTransition.tsx  # Three.js transition overlay
├── context/
│   └── TransitionContext.tsx # Shared transition state
├── next.config.ts           # Next.js config (static export)
└── postcss.config.mjs       # PostCSS with Tailwind v4
```

## How It Works

### Transition Flow

1. **Trigger** — Clicking a project card captures the image element and its bounding rectangle
2. **WebGL Overlay** — A fixed Three.js canvas renders the source image using a custom shader with cover-fit UV mapping
3. **Animation** — GSAP animates the mesh from card bounds to fullscreen (`power4.inOut` easing)
4. **Navigation** — At peak scale, Next.js router pushes the destination route
5. **Fade Out** — The WebGL overlay fades to transparent, revealing the new page underneath
6. **Cleanup** — Transition state resets for the next interaction

### Shader Features

The fragment shader handles aspect-ratio-correct texture mapping (cover fit) so images scale without distortion during the transition:

```glsl
// Cover-fit UV calculation
float meshAspect = uMeshScale.x / uMeshScale.y;
float textureAspect = uTextureScale.x / uTextureScale.y;

vec2 scale = vec2(1.0);
if (meshAspect > textureAspect) {
  scale.y = textureAspect / meshAspect;
} else {
  scale.x = meshAspect / textureAspect;
}
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd next-app-3d

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
pnpm build
```

The static site is output to the `out/` directory.

## Configuration

### Static Export

The project is configured for static export in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};
```

### Dev Origins

For local network testing, `allowedDevOrigins` is set to `192.168.100.9`. Update this to match your local IP if needed.

## Adding Projects

To add a new project:

1. Create a new route under `app/project/<slug>/page.tsx`
2. Add a card to `app/page.tsx` with the matching `href`
3. Place the cover image in the `public/` folder
4. Update the transition handler with the new route

## License

MIT

---

Built by [sarwanazhar](https://github.com/sarwanazhar)
