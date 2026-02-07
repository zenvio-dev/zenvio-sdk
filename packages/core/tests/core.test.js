"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe('Core Type Contracts', () => {
    it('should allow a valid text message params', () => {
        const params = {
            to: ['5511999999999'],
            type: 'text',
            payload: {
                text: 'Hello World'
            }
        };
        expect(params.type).toBe('text');
        expect(params.payload.text).toBe('Hello World');
    });
    it('should allow a valid template message params', () => {
        const params = {
            to: ['5511999999999'],
            type: 'template',
            payload: {
                key: 'welcome_message',
                language: 'en_US',
                variables: ['John']
            }
        };
        expect(params.type).toBe('template');
        expect(params.payload.key).toBe('welcome_message');
    });
    it('should allow a valid media message params', () => {
        const params = {
            to: ['5511999999999'],
            type: 'image',
            payload: {
                url: 'https://example.com/image.png',
                caption: 'Beautiful Image'
            }
        };
        expect(params.type).toBe('image');
        expect(params.payload.url).toBe('https://example.com/image.png');
    });
});
