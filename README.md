# ItineraryPro

ItineraryPro is a travel planning application that leverages natural language processing to streamline the trip planning process. Built with TypeScript and Angular, and utilizing Google Firebase, ItineraryPro offers an intuitive user experience for efficiently planning trips.

# Project Deprecation Notice
 This project is deprecated particularly due to the advancement of custom GPT travel assistant applications.

## Features

- **Natural Language Processing**: Simplify the process of entering travel details.
- **Intuitive User Interface**: Built with Angular for a responsive, user-friendly experience.
- **Cloud Integration**: Utilizing Google Firebase for real-time data handling and storage.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js and npm installed (download from [Node.js website](https://nodejs.org/))
- Angular CLI installed (`npm install -g @angular/cli`)

### Installation

To install ItineraryPro, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/401-Nick/ItineraryPro.git
   cd itinerarypro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

#### Firebase Configuration

1. Rename `firebase.config.example` to `firebase.config.ts`.
2. Fill in your Firebase project details in `firebase.config.ts`:

   ```typescript
   // Firebase configuration
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```

   Replace the placeholders with your actual Firebase project configuration. Do not commit your actual `firebase.config.ts` file to your public repository.

#### Environment Variables

1. Rename `.env.example` to `.env`.
2. Add your OpenAI API key in the `.env` file:

   ```env
   OPENAI_API_KEY=Your_OpenAI_API_Key_Here
   ```

   Ensure to replace `Your_OpenAI_API_Key_Here` with your actual OpenAI API key. Keep this file secure and do not commit it to your public repository.

## Running the Application

To run ItineraryPro on a development server:

1. Execute the following command:
   ```bash
   ng serve
   ```
2. Navigate to `http://localhost:4200/` in your web browser.