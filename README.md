<div align="center">

### Fakebook

</div>

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#) [![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#) [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)

</div>

---

### Overview

Fakebook is an interactive phishing awareness simulator that teaches users how to identify common social engineering tactics. The application simulates a realistic phishing attack in three phases - the hook, data grab, and reveal - demonstrating red flags like suspicious domains, artificial urgency, poor grammar, and excessive data requests. After completing the simulation, users receive a detailed breakdown of what they missed and learn key security principles to protect themselves from real attacks.

---

### Demo

This application is itself a demonstration. Run it locally to experience the full phishing simulation and security training.

---

### Project Structure

```
fakebook/
├── app/
│   ├── api/
│   │   └── send-otp/
│   │       └── route.ts          # OTP generation and email sending via Resend
│   ├── layout.tsx                 # Root layout with fonts and metadata
│   ├── page.tsx                   # Main phishing simulator component
│   └── globals.css                # Global styles
├── public/                        # Static assets
├── package.json                    # Dependencies and scripts
└── tsconfig.json                  # TypeScript configuration
```

---

### Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library
- **Resend** - Email service for OTP delivery

---

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

---

### Configuration

Create a `.env.local` file in the root directory with your Resend API key:

```env
RESEND_API_KEY=your_resend_api_key_here
```

You can get a free API key from [resend.com](https://resend.com).

---

### Usage

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start the phishing simulation.

To build for production:

```bash
npm run build
npm start
```

---

<div align="center">

Built by [Shaurya Chopra](https://shauryachopra.dev/)

</div>
