![Next.js](https://img.shields.io/badge/framework-Next.js-white)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue)
![Status](https://img.shields.io/badge/Status-Development-green)

# Hablo: Language Learning Made Fun

Hablo is a "SaaS" application designed to help users learn new languages in an engaging and interactive way. Inspired by the "gamey" feel of Duolingo, Hablo incorporates a structured and simple approach to language learning, breaking down courses into units, lessons, and challenges that keep users motivated to progress. 

## Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API References/Docs](#api-referencesdocs)
- [Asset Links](#asset-links)
- [Development Progress](#development-progress)
- [DB Commands](#db-commands)

## About the Project
Hablo replicates the gamified language learning experience of Duolingo, providing users with a series of courses that are broken down into manageable units and lessons. Each lesson includes interactive challenges designed to reinforce language skills. The platform tracks user progress, allowing learners to pick up where they left off and continue advancing toward fluency.

## Features
- **Gamified Learning Experience**: Engage users with interactive lessons and challenges that attempt to make learning fun.
- **User Progress Tracking**: Track individual progress, ensuring users always know where they are in their learning journey.
- **Course Management**: Structured courses with units and lessons that are easy to navigate.
- **Rich Media Support**: Integrates audio, images, and interactive elements to enhance the learning experience.

## Tech Stack
- **Frontend**: React, Next.js, TypeScript
- **Backend**: Node.js, Drizzle ORM, PostgreSQL (Neon)
- **Authentication**: Clerk
- **Hosting**: `TBD`

## Getting Started
To get started with development, clone the repository and install the necessary dependencies. You'll also need to create your own `.env` file at the root of your directory, as I have not made my environment variables publicly available:

```bash
git clone https://github.com/natndez/hablo.git
cd @/.../hablo
npm install
```

## API References/Docs
- Clerk: https://go.clerk.com/wmPbEeD
- Neon: https://neon.tech/docs/introduction 
- Drizzle: https://orm.drizzle.team/docs/get-started-postgresql 

## Asset Links
- Kenney Assets: https://kenney.nl/
- SVG Repo: https://www.svgrepo.com/  
- Freesound: https://freesound.org/ 
- Elevenlabs AI: https://elevenlabs.io/ 
- Flagpack: https://flagpack.xyz/ 
- Icons: https://iconduck.com/licenses/mit 

## Development Progress
- Currently sorting out the learn page... soon to be working on the lesson page(s)

## DB commands
- Shorthands declared in package.json
- Run the following commands for their respective uses:
    - `npm run db:push`
    - `npm run db:studio`
    - `npm run db:seed`


## Time stamp:
- 07:14:27