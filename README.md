# Serif

A modern, typography-first blogging platform built with Next.js and Supabase. Serif provides a distraction-free writing experience with instant publishing, scheduled posts, and a beautiful reading experience.

## Overview

Serif is a full-featured blogging platform that combines elegant design with powerful functionality. It's built for writers who want a clean, focused environment to create and share their stories without the clutter of traditional blogging platforms.

## Features

### Writing & Editing

- **Rich Text Editor**: Powered by TipTap with support for:
  - Bold, italic, and heading formatting
  - Lists (ordered and unordered)
  - Links
  - Image uploads with drag-and-drop support
  - Placeholder text for better UX
- **Auto-generated Slugs**: Automatically creates URL-friendly slugs from post titles
- **Read Time Calculation**: Automatically estimates reading time for posts
- **Cover Images**: Upload and manage cover images for posts
- **Summary/Excerpt**: Add summaries for better previews in blog listings

### Post Management

- **Status Management**: Three post statuses:
  - **Draft**: Work in progress, not visible publicly
  - **Published**: Live and visible on the public blog
  - **Scheduled**: Set a future publish date and time
- **Post Filtering**: Filter posts by status (All, Drafts, Published) in the dashboard
- **Post Deletion**: Safely delete posts with confirmation dialogs
- **Post Editing**: Full editing capabilities for existing posts

### User Experience

- **Typography-First Design**: Optimized typography using classic principles for beautiful reading on any device
- **Distraction-Free Interface**: Clean, minimal UI focused on writing
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Dark Mode Support**: Theme switching with next-themes
- **Author Profiles**: User profiles with avatars and names displayed on posts

### Public Blog

- **Public Post Feed**: Beautiful grid layout showcasing all published posts
- **Blog Cards**: Rich preview cards with:
  - Cover images
  - Author information and avatars
  - Publication dates
  - Read time estimates
  - Post summaries
- **Individual Post Pages**: Dedicated pages for each blog post with full content
- **SEO Optimized**: Built-in SEO support with sitemap and robots.txt

### Authentication & Security

- **User Authentication**: Complete auth system with Supabase:
  - Sign up
  - Login
  - Password reset
  - Email confirmation
- **Row-Level Security**: Database-level security policies ensuring users can only access their own posts
- **Protected Routes**: Dashboard and editing routes require authentication

### Storage & Media

- **Image Storage**: Supabase Storage buckets for:
  - Post cover images (`post-images` bucket)
  - User avatars (`avatars` bucket)
- **Secure Uploads**: Authenticated image uploads with proper access controls

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives with custom styling
- **Rich Text Editor**: TipTap
- **Form Management**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Project Structure

```
serif/
├── app/
│   ├── (marketing)/          # Public marketing pages
│   │   ├── blog/             # Public blog listing and post pages
│   │   ├── about/            # About page
│   │   └── page.tsx          # Landing page
│   ├── auth/                 # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   └── update-password/
│   ├── dashboard/            # Protected dashboard area
│   │   ├── blogs/            # Post management
│   │   │   ├── new/          # Create new post
│   │   │   └── [id]/         # Edit existing post
│   │   └── settings/         # User settings
│   └── layout.tsx            # Root layout
├── components/
│   ├── editor/               # Rich text editor components
│   ├── blog/                # Blog-related components
│   ├── dashboard/           # Dashboard components
│   ├── landing/             # Landing page sections
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── supabase/            # Supabase client utilities
│   ├── actions/              # Server actions
│   └── types.ts             # TypeScript type definitions
└── supabase/
    └── migrations/          # Database migrations
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account and project

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd serif
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:
   Apply the migrations in `supabase/migrations/` to your Supabase database.

5. Start the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Posts Table

- `id`: UUID primary key
- `user_id`: Foreign key to auth.users
- `title`: Post title
- `slug`: URL-friendly identifier (unique per user)
- `summary`: Optional post summary/excerpt
- `body`: Post content (HTML)
- `image`: Cover image URL
- `author`: Author name override
- `read_time`: Estimated reading time in minutes
- `status`: draft | published | scheduled
- `scheduled_at`: Optional scheduled publish datetime
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Profiles Table

- `id`: UUID (references auth.users)
- `first_name`: User's first name
- `avatar_url`: Profile picture URL
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Views

- `public_posts`: Public-facing view of published posts (excludes user_id)
- `public_authors`: Public author information view

## Development

### Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint

### Key Features Implementation

- **Rich Text Editor**: Custom TipTap editor with toolbar and image upload
- **Image Upload**: Client-side upload to Supabase Storage with progress tracking
- **Post Scheduling**: Database-level scheduled publishing support
- **SEO**: Dynamic sitemap and robots.txt generation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
