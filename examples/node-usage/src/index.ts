import { Zenvio } from '@zenvio/sdk-node';

/**
 * Zenvio SDK Usage Example
 * 
 * To run this example:
 * 1. Build the main SDK: npm run build (at monorepo root)
 * 2. Install dependencies: npm install (in this folder)
 * 3. Run: npm start
 */

async function main() {
    // Initialize with your API Key
    const zenvio = new Zenvio({
        apiKey: 'your_api_key_here',
    });

    const phoneId = 'your_phone_id_here';
    const myPhoneNumber = '5511999999999';

    console.log('--- Starting Zenvio SDK Example ---');

    try {
        // 0. Simple Text Message (Shortcut)
        console.log('Sending simplified text message...');
        const simpleRes = await zenvio.whatsapp.sendText(phoneId, myPhoneNumber, 'Simple hello! 👋');
        console.log('Simple Result:', simpleRes);

        // 1. Send Simple Text Message (Full Parameters)
        console.log('\nSending text message (full params)...');
        const textRes = await zenvio.whatsapp.send(phoneId, {
            to: [myPhoneNumber],
            type: 'text',
            payload: {
                text: 'Hello from Zenvio! 🚀'
            }
        });
        console.log('Text Result:', textRes);

        // 2. Send Image Message
        console.log('\nSending image message...');
        const imageRes = await zenvio.whatsapp.send(phoneId, {
            to: [myPhoneNumber],
            type: 'image',
            payload: {
                url: 'https://placehold.co/600x400/png',
                caption: 'This is a test image',
                filename: 'test-image.png'
            }
        });
        console.log('Image Result:', imageRes);

        // 3. Send Template Message
        console.log('\nSending template message...');
        const templateRes = await zenvio.whatsapp.send(phoneId, {
            to: [myPhoneNumber],
            type: 'template',
            payload: {
                key: 'welcome_template',
                language: 'en_US',
                variables: ['John Doe', 'Zenvio Team']
            }
        });
        console.log('Template Result:', templateRes);

        // 4. Send Buttons (Interactive)
        console.log('\nSending interactive buttons...');
        const buttonsRes = await zenvio.whatsapp.send(phoneId, {
            to: [myPhoneNumber],
            type: 'buttons',
            payload: {
                body: 'Did you like the new SDK?',
                buttons: [
                    { id: 'yes', label: 'Yes! 😍' },
                    { id: 'no', label: 'Not yet 😅' }
                ]
            },
            metadata: {
                internal_tracking_id: 'abc-123'
            }
        });
        console.log('Buttons Result:', buttonsRes);

    } catch (error) {
        console.error('An unexpected error occurrred:', error);
    }
}

main();
