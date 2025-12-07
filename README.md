# Professional Web Resume

This is a comprehensive, modern, and competitive online resume/portfolio built with Next.js and Vanilla CSS.

## Features

- **Modern Design**: Glassmorphism, dark mode, animation support.
- **Sections**:
  - Hero (with animated entrance and profile photo)
  - About Me
  - Skills (with category organization and icons)
  - Work Experience (Timeline view)
  - Education (Cards)
  - Projects (Grid view with tech stack)
  - Contact (Form simulation and details)
  - Stats (Counters)
- **Responsive**: Fully optimized for Desktop, Tablet, and Mobile.
- **PDF Generation**: Native print styles included for "Save as PDF".

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Modules + Global Variables)
- **Animations**: Framer Motion
- **Icons**: React Icons (FontAwesome 5, Simple Icons)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Customization

- **Profile Image**: Replace `public/profile.png`.
- **Project Images**: Add images to `public/` and update `src/components/Projects.tsx`.
- **Content**: Update arrays in individual components (e.g., `src/components/Experience.tsx`).
- **Colors**: Edit variables in `src/app/globals.css`.

## Deployment

Deploy readily to **Vercel**:

```bash
npx vercel
```
