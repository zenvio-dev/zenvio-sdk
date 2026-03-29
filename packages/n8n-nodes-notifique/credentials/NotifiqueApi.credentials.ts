import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class NotifiqueApi implements ICredentialType {
  name = 'notifiqueApi';

  displayName = 'Notifique API';

  documentationUrl = 'https://docs.notifique.com';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      placeholder: 'sk_live_xxx',
      description: 'Notifique API key',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.notifique.dev/v1',
      placeholder: 'https://api.notifique.dev/v1',
      description: 'Base URL for Notifique API (HTTPS only)',
    },
  ];
}
