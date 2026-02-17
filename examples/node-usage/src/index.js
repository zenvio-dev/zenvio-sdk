"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_node_1 = require("@zenvio/sdk-node");

async function main() {
  const zenvio = new sdk_node_1.Zenvio({ apiKey: 'your_api_key_here' });
  const instanceId = 'your_instance_id_here';
  const myPhoneNumber = '5511999999999';

  console.log('--- Zenvio SDK WhatsApp Example ---');

  try {
    console.log('Sending text (sendText)...');
    const simpleRes = await zenvio.whatsapp.sendText(instanceId, myPhoneNumber, 'Simple hello! 👋');
    console.log('Result:', simpleRes.message_ids, simpleRes.status);

    console.log('\nSending text (send)...');
    const textRes = await zenvio.whatsapp.send(instanceId, {
      to: [myPhoneNumber],
      type: 'text',
      payload: { message: 'Hello from Zenvio! 🚀' },
    });
    console.log('Result:', textRes.message_ids);

    console.log('\nSending image...');
    const imageRes = await zenvio.whatsapp.send(instanceId, {
      to: [myPhoneNumber],
      type: 'image',
      payload: { media_url: 'https://placehold.co/600x400/png' },
    });
    console.log('Result:', imageRes.message_ids);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
