# Zenvio Node.js SDK Example

This project demonstrates how to use the official Zenvio Node.js SDK to send various types of WhatsApp messages.

## Prerequisites

- Node.js installed.
- A Zenvio API Key and a WhatsApp Instance ID (phoneId).

## Setup

1. **Build the SDK Packages**:
   At the root of the monorepo, run:
   ```bash
   npm install
   npm run build
   ```

2. **Install Example Dependencies**:
   Enter this directory and run:
   ```bash
   npm install
   ```

3. **Configure the Example**:
   Open `src/index.ts` and replace the placeholder values:
   - `apiKey`: Your Zenvio API Key.
   - `phoneId`: The ID of the instance you want to send from.
   - `to`: The recipient phone number(s).

## Running the example

```bash
npm start
```

## What's included

- **Text Messages**: Simple text delivery.
- **Media Messages**: Sending images via URL.
- **Template Messages**: Sending official WhatsApp templates with variables.
- **Interactive Buttons**: Engaging users with quick reply buttons.
- **Metadata**: Attaching custom data for tracking.
