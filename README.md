## Arkaiv

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Contributions welcome](https://img.shields.io/badge/Contributions-welcome-brightgreen.svg)
![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?logo=nextdotjs)
![UI Library](https://img.shields.io/badge/UI-Shadcn%20UI-7E22CE?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Backend-Firebase-ffca28?logo=firebase&logoColor=white)

### About - Arkaiv

**Arkaiv** is an open-source document management system for MSMEs, designed to make managing digital paperwork effortless. Built with Firebase, React, and serverless architecture, it lets teams securely store, organize, and search documents — anywhere.

Built on **Next.js**, **Firebase**, and **Shadcn UI**, Arkaiv runs entirely serverless — so anyone can deploy and use it with minimal setup.  
The goal is to give small teams the capabilities of a document platform without the cost or complexity of enterprise systems.

### What It Does

Arkaiv enables users to register, upload, organize, and manage their digital documents from one unified interface.  
It currently supports user authentication, document uploads, listing and deletion, and introduces flexible metadata management allowing users to attach attributes like categories, tags, or notes to each document.

Folder-based organization makes navigation effortless, and the built-in search and filter functionality ensures that finding documents is quick and intuitive. This lays the groundwork for advanced features like AI-based tagging, OCR extraction, and semantic search in future iterations.

### Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router, Server Components)
- **UI:** [Shadcn UI](https://ui.shadcn.com) + Tailwind CSS
- **Backend:** [Firebase](https://firebase.google.com) (Auth, Firestore, Storage, Functions)
- **Deployment:** Vercel / Firebase Hosting
- **Search:** Firebase queries (with OpenSearch / vector search planned)

### 🚀 Getting Started

#### 1. Clone the Repository

```
git clone https://github.com/<your-username>/arkaiv.git
cd arkaiv
```

#### 2. Install Dependencies

```
npm install
```

#### 3. Configure Firebase .env file

Create an account on firebase, start a project, go the console and get the keys from the project settings

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### 4. Run it Locally

```
npm run dev
```

Then open http://localhost:3000 in your browser.

### Why Arkaiv Exists

Document management is often overlooked until chaos sets in — lost receipts, mismatched statements, or inaccessible files.
Arkaiv aims to bridge that gap by providing MSMEs a clear, structured way to handle their documentation. It’s built for real-world business users who need efficiency, not just storage.

With Firebase powering authentication, storage, and sync, and Next.js handling fast, modern rendering, Arkaiv remains scalable and cost-efficient. Future versions could include BYOC (Bring Your Own Cloud) setup.

### Vision & Roadmap

Arkaiv’s long-term mission is to evolve into an AI-assisted document platform.
Beyond file management, it will help users extract insights from their data through OCR, classification, and semantic search — transforming static documents into actionable knowledge.

The roadmap includes:

1. AI-powered document tagging and categorization
2. OCR-based text extraction using cloud functions
3. Role-based access control and team workspaces
4. Version control and activity logs
5. Multi-tenant deployments for organizations
