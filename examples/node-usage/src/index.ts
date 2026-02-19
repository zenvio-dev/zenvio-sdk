import { Zenvio } from '@zenvio/sdk-node';

/**
 * Zenvio SDK — WhatsApp (aligned with API)
 *
 * Run: npm run build (monorepo root), then npm start (here)
 */

async function main() {
  const zenvio = new Zenvio({
    apiKey: 'your_api_key_here',
  });

  const instanceId = 'your_instance_id_here';
  const myPhoneNumber = '5511999999999';

  console.log('--- Zenvio SDK WhatsApp Example ---');

  try {
    // 1. Text (shortcut) — POST /v1/whatsapp/send with payload.message
    console.log('Sending text (sendText)...');
    const simpleRes = await zenvio.whatsapp.sendText(instanceId, myPhoneNumber, 'Simple hello! 👋');
    console.log('Result:', simpleRes.message_ids, simpleRes.status);

    // 2. Text (full) — payload.message
    console.log('\nSending text (send)...');
    const textRes = await zenvio.whatsapp.send(instanceId, {
      to: [myPhoneNumber],
      type: 'text',
      payload: { message: 'Hello from Zenvio! 🚀' },
    });
    console.log('Result:', textRes.message_ids);

    // 3. Image — payload.media_url
    console.log('\nSending image...');
    const imageRes = await zenvio.whatsapp.send(instanceId, {
      to: [myPhoneNumber],
      type: 'image',
      payload: { media_url: 'https://placehold.co/600x400/png', file_name: 'image.png', mimetype: 'image/png' },
    });
    console.log('Result:', imageRes.message_ids);

    // 4. Optional: list instances, get message status, etc.
    // const instances = await zenvio.whatsapp.listInstances({ limit: '10' });
    // const status = await zenvio.whatsapp.getMessage('message-id-here');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
