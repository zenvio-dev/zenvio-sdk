import axios from 'axios';
import { Zenvio } from '../src';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Node.js SDK', () => {
    let zenvio: Zenvio;

    beforeEach(() => {
        mockedAxios.create.mockReturnValue(mockedAxios as any);
        mockedAxios.isAxiosError.mockImplementation((payload) => !!payload?.isAxiosError);
        zenvio = new Zenvio({ apiKey: 'test-api-key' });
    });

    it('should send a whatsapp message correctly', async () => {
        const mockResponse = { data: { success: true, messageId: 'msg-123' } };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await zenvio.whatsapp.send('phone-abc', {
            to: ['5511999999999'],
            type: 'text',
            payload: { text: 'Test message' }
        });

        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/whatsapp/phone-abc/messages',
            expect.objectContaining({
                type: 'text',
                payload: { text: 'Test message' }
            })
        );
        expect(result.success).toBe(true);
        expect(result.messageId).toBe('msg-123');
    });

    it('should send a simple text message via sendText shortcut', async () => {
        const mockResponse = { data: { success: true, messageId: 'msg-shortcut' } };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await zenvio.whatsapp.sendText('phone-abc', '5511999999999', 'Shortcut test');

        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/whatsapp/phone-abc/messages',
            expect.objectContaining({
                to: ['5511999999999'],
                type: 'text',
                payload: { text: 'Shortcut test' }
            })
        );
        expect(result.success).toBe(true);
        expect(result.messageId).toBe('msg-shortcut');
    });

    it('should send an image message correctly', async () => {
        const mockResponse = { data: { success: true, messageId: 'msg-img-123' } };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await zenvio.whatsapp.send('phone-abc', {
            to: ['5511999999999'],
            type: 'image',
            payload: {
                url: 'https://example.com/image.png',
                caption: 'Image caption'
            }
        });

        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/whatsapp/phone-abc/messages',
            expect.objectContaining({
                type: 'image',
                payload: {
                    url: 'https://example.com/image.png',
                    caption: 'Image caption'
                }
            })
        );
        expect(result.success).toBe(true);
        expect(result.messageId).toBe('msg-img-123');
    });

    it('should send a template message correctly', async () => {
        const mockResponse = { data: { success: true, messageId: 'msg-tpl-123' } };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await zenvio.whatsapp.send('phone-abc', {
            to: ['5511999999999'],
            type: 'template',
            payload: {
                key: 'welcome_template',
                language: 'en_US',
                variables: ['John Doe']
            }
        });

        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/whatsapp/phone-abc/messages',
            expect.objectContaining({
                type: 'template',
                payload: {
                    key: 'welcome_template',
                    language: 'en_US',
                    variables: ['John Doe']
                }
            })
        );
        expect(result.success).toBe(true);
    });

    it('should send buttons message correctly', async () => {
        const mockResponse = { data: { success: true, messageId: 'msg-btn-123' } };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await zenvio.whatsapp.send('phone-abc', {
            to: ['5511999999999'],
            type: 'buttons',
            payload: {
                body: 'Choose an option:',
                buttons: [
                    { id: '1', label: 'Yes' },
                    { id: '2', label: 'No' }
                ]
            }
        });

        expect(result.success).toBe(true);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/whatsapp/phone-abc/messages',
            expect.objectContaining({
                type: 'buttons'
            })
        );
    });

    it('should send video, audio and document messages correctly', async () => {
        const mockResponse = { data: { success: true } };
        mockedAxios.post.mockResolvedValue(mockResponse);

        // Video
        await zenvio.whatsapp.send('p', { to: ['1'], type: 'video', payload: { url: 'v.mp4' } });
        expect(mockedAxios.post).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ type: 'video' }));

        // Audio
        await zenvio.whatsapp.send('p', { to: ['1'], type: 'audio', payload: { url: 'a.mp3' } });
        expect(mockedAxios.post).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ type: 'audio' }));

        // Document
        await zenvio.whatsapp.send('p', { to: ['1'], type: 'document', payload: { url: 'd.pdf', filename: 'd.pdf' } });
        expect(mockedAxios.post).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ type: 'document' }));
    });

    it('should send list messages correctly', async () => {
        const mockResponse = { data: { success: true } };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        await zenvio.whatsapp.send('phone-abc', {
            to: ['5511999999999'],
            type: 'list',
            payload: {
                body: 'Pick one',
                title: 'Main Menu',
                sections: [
                    { title: 'Fruits', rows: [{ id: '1', title: 'Apple' }] }
                ]
            }
        });

        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/whatsapp/phone-abc/messages',
            expect.objectContaining({
                type: 'list',
                payload: expect.objectContaining({ body: 'Pick one' })
            })
        );
    });

    it('should handle API errors gracefully', async () => {
        mockedAxios.post.mockRejectedValueOnce({
            isAxiosError: true,
            response: { data: { message: 'Invalid API Key' } }
        });

        const result = await zenvio.whatsapp.send('phone-abc', {
            to: ['5511999999999'],
            type: 'text',
            payload: { text: 'Test' }
        });

        expect(result.success).toBe(false);
        expect(result.error).toBe('Invalid API Key');
    });
});
