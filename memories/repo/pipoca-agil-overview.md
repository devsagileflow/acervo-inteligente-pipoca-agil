# Pipoca Ágil - Intelligent Learning Platform

## Product Essence

Transform Pipoca Ágil's scattered YouTube content into a structured, personalized learning platform. Problem: users can't find organized content, don't know where to start, can't track progress. Solution: intelligent content organization + personalized learning paths + progress tracking + gamification.

## Three Strategic Pillars

1. **Organize All Content** - Centralize scattered content, enable discovery through search/tags/filters, offer diverse formats (video + text), ensure responsive/accessible UI
2. **Personalized Learning Paths** - Smart onboarding quiz → user profile → role-based paths (PO/SM/beginner) → adaptive recommendations based on consumption
3. **Track & Motivate** - Progress visualization, light gamification (badges, levels, rankings), knowledge gap identification, activity summaries

## User Journey Stages

- **Discovery** (home, not logged) → FAQ, testimonials, category showcase, mini-test for path recommendation
- **Registration** → Social login (Google/LinkedIn), clear value prop, transparent data usage
- **Exploration** → Search, advanced filters, personalized quiz, content preview
- **Logged-in Home** → Welcome, "start here" block, recommendations, track status
- **Continuity** → Progress bars, "continue where I left off", quizzes, certificates, social sharing, notifications

## Tech Stack

- **Backend**: Fastify + TypeScript + Zod + Prisma + PostgreSQL + better-auth
- **Frontend**: Next.js + React 19 + Tailwind + shadcn/radix-ui
- **Current State**: Auth basics done (User/Session/Account), no domain models yet

## Key Features

- Track/Topic/ContentUnit hierarchy with flexible tagging (category, level, duration, guest)
- User profile/preference system with role-based paths
- Enrollment tracking with progress, completion percentages, timestamps
- Quizzes for knowledge validation + completion certificates
- Recommendations engine based on profile + progress + interests
- Accessibility: subtitles, night mode, playback controls
- Optional: annotations, community comments, leaderboards, social sharing

## Design Decisions Pending

- MVP scope vs nice-to-haves (which features in v1?)
- Content hierarchy structure details
- Personalization algorithm (quiz-based? observed? both?)
- Community features criticality
- Gamification level (light or extensive?)
- Content source/migration plan

## Deployment Notes

- API env validation must parse `process.env` (Render injects vars at runtime); `.env` loading is local fallback only.

## API Notes

- Detailed API architecture and operational patterns were moved to `/memories/repo/api-architecture-patterns.md`.
- Keep this overview focused on product context and strategic direction.
