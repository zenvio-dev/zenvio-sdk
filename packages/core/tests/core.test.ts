import type { WhatsAppSendParams, SendParams } from '../src';

describe('Core Type Contracts (API-aligned)', () => {
  it('allows valid text message params (payload.message)', () => {
    const params: WhatsAppSendParams<'text'> = {
      instance_id: 'inst-1',
      to: ['5511999999999'],
      type: 'text',
      payload: { message: 'Hello World' },
    };
    expect(params.type).toBe('text');
    expect(params.payload.message).toBe('Hello World');
  });

  it('allows valid media message params (payload.media_url, file_name, mimetype)', () => {
    const params: WhatsAppSendParams<'image'> = {
      instance_id: 'inst-1',
      to: ['5511999999999'],
      type: 'image',
      payload: { media_url: 'https://example.com/image.png', file_name: 'image.png', mimetype: 'image/png' },
    };
    expect(params.type).toBe('image');
    expect(params.payload.media_url).toBe('https://example.com/image.png');
    expect(params.payload.file_name).toBe('image.png');
    expect(params.payload.mimetype).toBe('image/png');
  });

  it('allows location payload', () => {
    const params: WhatsAppSendParams<'location'> = {
      instance_id: 'inst-1',
      to: ['5511999999999'],
      type: 'location',
      payload: { latitude: -23.5, longitude: -46.6, name: 'São Paulo', address: 'São Paulo, SP' },
    };
    expect(params.payload.latitude).toBe(-23.5);
    expect(params.payload.name).toBe('São Paulo');
    expect(params.payload.address).toBe('São Paulo, SP');
  });

  it('legacy SendParams alias maps to WhatsAppSendParams', () => {
    const params: SendParams<'text'> = {
      instance_id: 'inst-1',
      to: ['5511999999999'],
      type: 'text',
      payload: { message: 'Hi' },
    };
    expect(params.payload.message).toBe('Hi');
  });
});
