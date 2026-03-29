# Notifique Node.js SDK Example

This project demonstrates how to use the official Notifique Node.js SDK to send various types of WhatsApp messages.

## Prerequisites

- Node.js installed.
- A Notifique API Key and a WhatsApp Instance ID (phoneId).

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

3. **Configure Environment Variables**:
   Export the required values:
   - `NOTIFIQUE_API_KEY`
   - `NOTIFIQUE_INSTANCE_ID`
   - `MY_PHONE`

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
