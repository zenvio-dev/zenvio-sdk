import {
  NodeOperationError,
  type IExecuteFunctions,
  type IDataObject,
  type INodeExecutionData,
  type INodeType,
  type INodeTypeDescription,
} from 'n8n-workflow';
import type { IHttpRequestOptions } from 'n8n-workflow';

type JsonRecord = Record<string, unknown>;

function toStringArray(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function parseJsonObject(raw: string): JsonRecord {
  if (!raw.trim()) return {};
  const parsed = JSON.parse(raw) as unknown;
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('JSON value must be an object');
  }
  return parsed as JsonRecord;
}

function shouldConfirm(operation: string): boolean {
  return ['cancel', 'delete'].includes(operation);
}

function normalizeError(error: unknown): JsonRecord {
  if (error instanceof NodeOperationError) {
    return {
      name: error.name,
      message: error.message,
    };
  }
  if (error instanceof Error) return { name: error.name, message: error.message };
  return { message: String(error) };
}

function assertSecureBaseUrl(baseUrl: string): void {
  let parsed: URL;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error('Base URL must be a valid absolute URL');
  }
  if (parsed.protocol !== 'https:') {
    throw new Error('Base URL must use HTTPS');
  }
}

function pathSegment(value: string): string {
  return encodeURIComponent(value);
}

export class NotifiqueNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Notifique',
    name: 'notifiqueNode',
    icon: 'file:notifique.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["resource"] + " : " + $parameter["operation"]}}',
    description: 'No-code Notifique integration for n8n',
    defaults: {
      name: 'Notifique',
    },
    credentials: [
      {
        name: 'notifiqueApi',
        required: true,
      },
    ],
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        default: 'whatsapp',
        options: [
          { name: 'WhatsApp Messages', value: 'whatsapp' },
          { name: 'WhatsApp Instances', value: 'whatsappInstances' },
          { name: 'WhatsApp Groups', value: 'whatsappGroups' },
          { name: 'SMS', value: 'sms' },
          { name: 'Email', value: 'email' },
          { name: 'Templates', value: 'templates' },
          { name: 'Contacts', value: 'contacts' },
          { name: 'Tags', value: 'tags' },
          { name: 'Email Domains', value: 'emailDomains' },
          { name: 'Push Apps', value: 'pushApps' },
          { name: 'Push Devices', value: 'pushDevices' },
          { name: 'Push Messages', value: 'pushMessages' },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'sendText',
        displayOptions: { show: { resource: ['whatsapp'] } },
        options: [
          { name: 'Send Text', value: 'sendText', action: 'Send WhatsApp text message' },
          { name: 'List Messages', value: 'listMessages', action: 'List WhatsApp messages' },
          { name: 'Get Message', value: 'getMessage', action: 'Get WhatsApp message status' },
          { name: 'Edit Message', value: 'edit', action: 'Edit sent message text' },
          { name: 'Cancel Message', value: 'cancel', action: 'Cancel scheduled message' },
          { name: 'Delete Message', value: 'delete', action: 'Delete message for everyone' },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'list',
        displayOptions: { show: { resource: ['whatsappInstances'] } },
        options: [
          { name: 'List', value: 'list', action: 'List WhatsApp instances' },
          { name: 'Create', value: 'create', action: 'Create WhatsApp instance' },
          { name: 'Get', value: 'get', action: 'Get WhatsApp instance' },
          { name: 'Get QR Code', value: 'getQr', action: 'Get current instance QR code' },
          { name: 'Disconnect', value: 'disconnect', action: 'Disconnect WhatsApp instance' },
          { name: 'Delete', value: 'delete', action: 'Delete WhatsApp instance' },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'list',
        displayOptions: { show: { resource: ['whatsappGroups'] } },
        options: [
          { name: 'List Groups', value: 'list', action: 'List instance groups' },
          { name: 'List Participants', value: 'listParticipants', action: 'List group participants' },
          { name: 'Add Participants', value: 'addParticipants', action: 'Add participants to group' },
          { name: 'Remove Participants', value: 'removeParticipants', action: 'Remove participants from group' },
          { name: 'Send Invite Link', value: 'sendInvite', action: 'Send group invite link' },
          { name: 'Revoke Invite Link', value: 'revokeInvite', action: 'Revoke group invite link' },
          { name: 'Get Invite Code', value: 'getInviteCode', action: 'Get group invite code' },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'send',
        displayOptions: { show: { resource: ['sms'] } },
        options: [
          { name: 'Send', value: 'send', action: 'Send SMS' },
          { name: 'Get', value: 'get', action: 'Get SMS status' },
          { name: 'Cancel', value: 'cancel', action: 'Cancel scheduled SMS' },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'send',
        displayOptions: { show: { resource: ['email'] } },
        options: [
          { name: 'Send', value: 'send', action: 'Send email' },
          { name: 'Get', value: 'get', action: 'Get email status' },
          { name: 'Cancel', value: 'cancel', action: 'Cancel scheduled email' },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'send',
        displayOptions: { show: { resource: ['templates'] } },
        options: [{ name: 'Send Template', value: 'send', action: 'Send multichannel template' }],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'list',
        displayOptions: { show: { resource: ['contacts'] } },
        options: [
          { name: 'List', value: 'list', action: 'List contacts' },
          { name: 'Create', value: 'create', action: 'Create contact' },
          { name: 'Get', value: 'get', action: 'Get contact' },
          { name: 'Update', value: 'update', action: 'Update contact' },
          { name: 'Delete', value: 'delete', action: 'Delete contact' },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'list',
        displayOptions: { show: { resource: ['tags'] } },
        options: [
          { name: 'List', value: 'list', action: 'List tags' },
          { name: 'Create', value: 'create', action: 'Create tag' },
          { name: 'Get', value: 'get', action: 'Get tag' },
          { name: 'Update', value: 'update', action: 'Update tag' },
          { name: 'Delete', value: 'delete', action: 'Delete tag' },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'list',
        displayOptions: { show: { resource: ['emailDomains'] } },
        options: [
          { name: 'List', value: 'list', action: 'List email domains' },
          { name: 'Create', value: 'create', action: 'Create email domain' },
          { name: 'Get', value: 'get', action: 'Get domain by ID' },
          { name: 'Verify DNS', value: 'verify', action: 'Verify email domain DNS' },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'list',
        displayOptions: { show: { resource: ['pushApps'] } },
        options: [
          { name: 'List', value: 'list', action: 'List push apps' },
          { name: 'Create', value: 'create', action: 'Create push app' },
          { name: 'Get', value: 'get', action: 'Get push app' },
          { name: 'Update', value: 'update', action: 'Update push app' },
          { name: 'Delete', value: 'delete', action: 'Delete push app' },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'register',
        displayOptions: { show: { resource: ['pushDevices'] } },
        options: [
          { name: 'Register', value: 'register', action: 'Register push device' },
          { name: 'List', value: 'list', action: 'List push devices' },
          { name: 'Get', value: 'get', action: 'Get push device' },
          { name: 'Delete', value: 'delete', action: 'Delete push device' },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'send',
        displayOptions: { show: { resource: ['pushMessages'] } },
        options: [
          { name: 'Send', value: 'send', action: 'Send push message' },
          { name: 'List', value: 'list', action: 'List push messages' },
          { name: 'Get', value: 'get', action: 'Get push message' },
          { name: 'Cancel', value: 'cancel', action: 'Cancel push message' },
        ],
      },

      { displayName: 'Instance ID', name: 'instanceId', type: 'string', default: '', displayOptions: { show: { resource: ['whatsapp', 'whatsappInstances', 'whatsappGroups'], operation: ['sendText', 'get', 'getQr', 'disconnect', 'delete', 'list', 'listParticipants', 'addParticipants', 'removeParticipants', 'sendInvite', 'revokeInvite', 'getInviteCode'] } } },
      { displayName: 'To (comma-separated list)', name: 'to', type: 'string', default: '', displayOptions: { show: { resource: ['whatsapp', 'sms', 'email', 'templates', 'whatsappGroups'], operation: ['sendText', 'send', 'sendInvite'] } } },
      { displayName: 'Message', name: 'message', type: 'string', typeOptions: { rows: 3 }, default: '', displayOptions: { show: { resource: ['whatsapp', 'sms'], operation: ['sendText', 'send'] } } },
      { displayName: 'Message ID', name: 'messageId', type: 'string', default: '', displayOptions: { show: { resource: ['whatsapp'], operation: ['getMessage', 'cancel', 'delete', 'edit'] } } },
      { displayName: 'Edited Text', name: 'editedText', type: 'string', default: '', displayOptions: { show: { resource: ['whatsapp'], operation: ['edit'] } } },
      { displayName: 'Message Filters (JSON)', name: 'whatsappListParamsJson', type: 'json', default: '{}', displayOptions: { show: { resource: ['whatsapp'], operation: ['listMessages'] } } },
      { displayName: 'Instance Name', name: 'instanceName', type: 'string', default: '', displayOptions: { show: { resource: ['whatsappInstances'], operation: ['create'] } } },
      { displayName: 'Group ID', name: 'groupId', type: 'string', default: '', displayOptions: { show: { resource: ['whatsappGroups'], operation: ['listParticipants'] } } },
      { displayName: 'Group JID', name: 'groupJid', type: 'string', default: '', displayOptions: { show: { resource: ['whatsappGroups'], operation: ['addParticipants', 'removeParticipants', 'revokeInvite', 'getInviteCode'] } } },
      { displayName: 'Groups (comma-separated JIDs)', name: 'groupJidsCsv', type: 'string', default: '', displayOptions: { show: { resource: ['whatsappGroups'], operation: ['sendInvite'] } } },
      { displayName: 'Participants (comma-separated)', name: 'participantsCsv', type: 'string', default: '', displayOptions: { show: { resource: ['whatsappGroups'], operation: ['addParticipants', 'removeParticipants'] } } },
      { displayName: 'Invite Description', name: 'inviteDescription', type: 'string', default: 'Group invite', displayOptions: { show: { resource: ['whatsappGroups'], operation: ['sendInvite'] } } },
      { displayName: 'SMS ID', name: 'smsId', type: 'string', default: '', displayOptions: { show: { resource: ['sms'], operation: ['get', 'cancel'] } } },
      { displayName: 'Email ID', name: 'emailId', type: 'string', default: '', displayOptions: { show: { resource: ['email'], operation: ['get', 'cancel'] } } },
      { displayName: 'From', name: 'from', type: 'string', default: '', displayOptions: { show: { resource: ['email', 'templates'], operation: ['send'] } } },
      { displayName: 'From Name', name: 'fromName', type: 'string', default: '', displayOptions: { show: { resource: ['email', 'templates'], operation: ['send'] } } },
      { displayName: 'Subject', name: 'subject', type: 'string', default: '', displayOptions: { show: { resource: ['email'], operation: ['send'] } } },
      { displayName: 'Text', name: 'text', type: 'string', typeOptions: { rows: 3 }, default: '', displayOptions: { show: { resource: ['email'], operation: ['send'] } } },
      { displayName: 'HTML', name: 'html', type: 'string', typeOptions: { rows: 3 }, default: '', displayOptions: { show: { resource: ['email'], operation: ['send'] } } },

      { displayName: 'Template', name: 'template', type: 'string', default: '', displayOptions: { show: { resource: ['templates'], operation: ['send'] } } },
      {
        displayName: 'Canais',
        name: 'channels',
        type: 'multiOptions',
        default: ['whatsapp'],
        options: [
          { name: 'WhatsApp', value: 'whatsapp' },
          { name: 'SMS', value: 'sms' },
          { name: 'Email', value: 'email' },
        ],
        displayOptions: { show: { resource: ['templates'], operation: ['send'] } },
      },
      {
        displayName: 'Variables (JSON)',
        name: 'variablesJson',
        type: 'json',
        default: '{}',
        displayOptions: { show: { resource: ['templates'], operation: ['send'] } },
      },
      { displayName: 'Contact ID', name: 'contactId', type: 'string', default: '', displayOptions: { show: { resource: ['contacts'], operation: ['get', 'update', 'delete'] } } },
      { displayName: 'Contact Payload (JSON)', name: 'contactPayloadJson', type: 'json', default: '{"name":"","phone":"","email":"","url":"","receiveMarketing":true,"tagIds":[]}', displayOptions: { show: { resource: ['contacts'], operation: ['create', 'update'] } } },
      { displayName: 'Contact Filters (JSON)', name: 'contactFiltersJson', type: 'json', default: '{}', displayOptions: { show: { resource: ['contacts'], operation: ['list'] } } },
      { displayName: 'ID da Tag', name: 'tagId', type: 'string', default: '', displayOptions: { show: { resource: ['tags'], operation: ['get', 'update', 'delete'] } } },
      { displayName: 'Nome da Tag', name: 'tagName', type: 'string', default: '', displayOptions: { show: { resource: ['tags'], operation: ['create', 'update'] } } },

      { displayName: 'Domain ID', name: 'domainId', type: 'string', default: '', displayOptions: { show: { resource: ['emailDomains'], operation: ['get', 'verify'] } } },
      { displayName: 'Domain', name: 'domain', type: 'string', default: '', displayOptions: { show: { resource: ['emailDomains'], operation: ['create'] } } },

      { displayName: 'ID do App', name: 'appId', type: 'string', default: '', displayOptions: { show: { resource: ['pushApps'], operation: ['get', 'update', 'delete'] } } },
      { displayName: 'Nome do App', name: 'appName', type: 'string', default: '', displayOptions: { show: { resource: ['pushApps'], operation: ['create', 'update'] } } },
      {
        displayName: 'Dados de Update (JSON)',
        name: 'appUpdateJson',
        type: 'json',
        default: '{}',
        displayOptions: { show: { resource: ['pushApps'], operation: ['update'] } },
      },

      { displayName: 'ID do Device', name: 'deviceId', type: 'string', default: '', displayOptions: { show: { resource: ['pushDevices'], operation: ['get', 'delete'] } } },
      {
        displayName: 'Payload de Registro (JSON)',
        name: 'devicePayloadJson',
        type: 'json',
        default: '{"appId":"","platform":"web","token":""}',
        displayOptions: { show: { resource: ['pushDevices'], operation: ['register'] } },
      },
      {
        displayName: 'Filtros de Listagem (JSON)',
        name: 'listFiltersJson',
        type: 'json',
        default: '{}',
        displayOptions: { show: { resource: ['pushApps', 'pushDevices', 'pushMessages'], operation: ['list'] } },
      },

      {
        displayName: 'Payload do Push (JSON)',
        name: 'pushPayloadJson',
        type: 'json',
        default: '{"appId":"","title":"","body":"","deviceIds":[]}',
        displayOptions: { show: { resource: ['pushMessages'], operation: ['send'] } },
      },
      { displayName: 'ID da Push Message', name: 'pushMessageId', type: 'string', default: '', displayOptions: { show: { resource: ['pushMessages'], operation: ['get', 'cancel'] } } },

      {
        displayName: 'Idempotency Key',
        name: 'idempotencyKey',
        type: 'string',
        default: '',
        description: 'Chave opcional para retries idempotentes',
        displayOptions: {
          show: {
            resource: ['whatsapp', 'sms', 'email', 'pushMessages'],
            operation: ['sendText', 'send'],
          },
        },
      },
      {
        displayName: 'Aguardar Status Final',
        name: 'waitForStatus',
        type: 'boolean',
        default: false,
        description: 'Poll until a final status when available',
        displayOptions: {
          show: {
            resource: ['whatsapp', 'sms', 'email', 'pushMessages', 'templates'],
            operation: ['sendText', 'send'],
          },
        },
      },
      {
        displayName: 'Intervalo de Polling (ms)',
        name: 'pollIntervalMs',
        type: 'number',
        typeOptions: { minValue: 500 },
        default: 2000,
        displayOptions: {
          show: {
            waitForStatus: [true],
            resource: ['whatsapp', 'sms', 'email', 'pushMessages', 'templates'],
            operation: ['sendText', 'send'],
          },
        },
      },
      {
        displayName: 'Timeout de Polling (ms)',
        name: 'pollTimeoutMs',
        type: 'number',
        typeOptions: { minValue: 2000 },
        default: 45000,
        displayOptions: {
          show: {
            waitForStatus: [true],
            resource: ['whatsapp', 'sms', 'email', 'pushMessages', 'templates'],
            operation: ['sendText', 'send'],
          },
        },
      },
      {
        displayName: 'Confirm Sensitive Operation',
        name: 'confirmSensitive',
        type: 'boolean',
        default: false,
        description: 'Required for cancel/delete',
        displayOptions: {
          show: {
            operation: ['cancel', 'delete'],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const out: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i += 1) {
      try {
        const credentials = await this.getCredentials('notifiqueApi', i);
        const apiKey = String(credentials.apiKey ?? '');
        const baseUrl = String(credentials.baseUrl ?? 'https://api.notifique.dev/v1').replace(/\/$/, '');
        if (!apiKey.trim()) {
          throw new NodeOperationError(this.getNode(), 'API Key must be a non-empty string.', { itemIndex: i });
        }
        assertSecureBaseUrl(baseUrl);

        const apiRequest = async (
          method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
          path: string,
          body?: JsonRecord,
          qs?: JsonRecord,
          extraHeaders?: JsonRecord,
        ): Promise<unknown> => {
          const options: IHttpRequestOptions = {
            method,
            url: `${baseUrl}${path}`,
            json: true,
            timeout: 30000,
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              ...(extraHeaders ?? {}),
            },
          };
          if (body && Object.keys(body).length > 0) options.body = body;
          if (qs && Object.keys(qs).length > 0) options.qs = qs as IDataObject;
          return this.helpers.httpRequest(options);
        };

        const resource = this.getNodeParameter('resource', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;
        const idempotencyKey = this.getNodeParameter('idempotencyKey', i, '') as string;
        const idempotencyHeaders = idempotencyKey
          ? {
              'Idempotency-Key': idempotencyKey,
              'x-idempotency-key': idempotencyKey,
            }
          : undefined;

        if (shouldConfirm(operation)) {
          const confirmed = this.getNodeParameter('confirmSensitive', i, false) as boolean;
          if (!confirmed) {
            throw new NodeOperationError(
              this.getNode(),
              'Sensitive operation blocked. Enable "Confirm Sensitive Operation" to continue.',
              { itemIndex: i },
            );
          }
        }

        let response: unknown;

        if (resource === 'whatsapp') {
          if (operation === 'sendText') {
            const instanceId = this.getNodeParameter('instanceId', i) as string;
            const to = toStringArray(this.getNodeParameter('to', i) as string);
            const message = this.getNodeParameter('message', i) as string;
            response = await apiRequest('POST', '/whatsapp/messages', {
              instanceId,
              to,
              type: 'text',
              payload: { message },
            }, undefined, idempotencyHeaders);
          } else if (operation === 'listMessages') {
            const params = parseJsonObject(this.getNodeParameter('whatsappListParamsJson', i, '{}') as string);
            response = await apiRequest('GET', '/whatsapp/messages', undefined, params);
          } else if (operation === 'getMessage') {
            const messageId = this.getNodeParameter('messageId', i) as string;
            response = await apiRequest('GET', `/whatsapp/messages/${pathSegment(messageId)}`);
          } else if (operation === 'edit') {
            const messageId = this.getNodeParameter('messageId', i) as string;
            const editedText = this.getNodeParameter('editedText', i) as string;
            response = await apiRequest('PATCH', `/whatsapp/messages/${pathSegment(messageId)}/edit`, { text: editedText });
          } else if (operation === 'cancel') {
            const messageId = this.getNodeParameter('messageId', i) as string;
            response = await apiRequest('POST', `/whatsapp/messages/${pathSegment(messageId)}/cancel`);
          } else if (operation === 'delete') {
            const messageId = this.getNodeParameter('messageId', i) as string;
            response = await apiRequest('DELETE', `/whatsapp/messages/${pathSegment(messageId)}`);
          }
        } else if (resource === 'whatsappInstances') {
          if (operation === 'list') {
            response = await apiRequest('GET', '/whatsapp/instances');
          }
          if (operation === 'create') {
            const instanceName = this.getNodeParameter('instanceName', i) as string;
            response = await apiRequest('POST', '/whatsapp/instances', { name: instanceName });
          }
          if (operation === 'get') {
            const instanceId = this.getNodeParameter('instanceId', i) as string;
            response = await apiRequest('GET', `/whatsapp/instances/${pathSegment(instanceId)}`);
          }
          if (operation === 'getQr') {
            const instanceId = this.getNodeParameter('instanceId', i) as string;
            response = await apiRequest('GET', `/whatsapp/instances/${pathSegment(instanceId)}/qr`);
          }
          if (operation === 'disconnect') {
            const instanceId = this.getNodeParameter('instanceId', i) as string;
            response = await apiRequest('POST', `/whatsapp/instances/${pathSegment(instanceId)}/disconnect`);
          }
          if (operation === 'delete') {
            const instanceId = this.getNodeParameter('instanceId', i) as string;
            response = await apiRequest('DELETE', `/whatsapp/instances/${pathSegment(instanceId)}`);
          }
        } else if (resource === 'whatsappGroups') {
          const instanceId = this.getNodeParameter('instanceId', i) as string;
          if (operation === 'list') {
            response = await apiRequest('GET', `/whatsapp/instances/${pathSegment(instanceId)}/groups`);
          }
          if (operation === 'listParticipants') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            response = await apiRequest('GET', `/whatsapp/instances/${pathSegment(instanceId)}/groups/${pathSegment(groupId)}/participants`);
          }
          if (operation === 'addParticipants' || operation === 'removeParticipants') {
            const groupJid = this.getNodeParameter('groupJid', i) as string;
            const participants = toStringArray(this.getNodeParameter('participantsCsv', i) as string);
            response = await apiRequest('POST', `/whatsapp/instances/${pathSegment(instanceId)}/groups/participants`, {
              groupJid,
              action: operation === 'addParticipants' ? 'add' : 'remove',
              participants,
            });
          }
          if (operation === 'sendInvite') {
            const groupJids = toStringArray(this.getNodeParameter('groupJidsCsv', i) as string);
            const to = toStringArray(this.getNodeParameter('to', i) as string);
            const description = this.getNodeParameter('inviteDescription', i, 'Convite para o grupo') as string;
            response = await apiRequest('POST', `/whatsapp/instances/${pathSegment(instanceId)}/groups/invite`, {
              groups: groupJids,
              to,
              description,
            });
          }
          if (operation === 'revokeInvite') {
            const groupJid = this.getNodeParameter('groupJid', i) as string;
            response = await apiRequest('POST', `/whatsapp/instances/${pathSegment(instanceId)}/groups/invite/revoke`, { groupJid });
          }
          if (operation === 'getInviteCode') {
            const groupJid = this.getNodeParameter('groupJid', i) as string;
            response = await apiRequest('GET', `/whatsapp/instances/${pathSegment(instanceId)}/groups/invite-code`, undefined, { groupJid });
          }
        } else if (resource === 'sms') {
          if (operation === 'send') {
            const to = toStringArray(this.getNodeParameter('to', i) as string);
            const message = this.getNodeParameter('message', i) as string;
            response = await apiRequest('POST', '/sms/messages', { to, message }, undefined, idempotencyHeaders);
          } else if (operation === 'get') {
            const smsId = this.getNodeParameter('smsId', i) as string;
            response = await apiRequest('GET', `/sms/messages/${pathSegment(smsId)}`);
          } else if (operation === 'cancel') {
            const smsId = this.getNodeParameter('smsId', i) as string;
            response = await apiRequest('POST', `/sms/messages/${pathSegment(smsId)}/cancel`);
          }
        } else if (resource === 'email') {
          if (operation === 'send') {
            const to = toStringArray(this.getNodeParameter('to', i) as string);
            const from = this.getNodeParameter('from', i) as string;
            const fromName = this.getNodeParameter('fromName', i, '') as string;
            const subject = this.getNodeParameter('subject', i) as string;
            const text = this.getNodeParameter('text', i, '') as string;
            const html = this.getNodeParameter('html', i, '') as string;
            const payload: JsonRecord = { to, from, subject };
            if (fromName) payload.fromName = fromName;
            if (text) payload.text = text;
            if (html) payload.html = html;
            response = await apiRequest('POST', '/email/messages', payload, undefined, idempotencyHeaders);
          } else if (operation === 'get') {
            const emailId = this.getNodeParameter('emailId', i) as string;
            response = await apiRequest('GET', `/email/messages/${pathSegment(emailId)}`);
          } else if (operation === 'cancel') {
            const emailId = this.getNodeParameter('emailId', i) as string;
            response = await apiRequest('POST', `/email/messages/${pathSegment(emailId)}/cancel`);
          }
        } else if (resource === 'templates') {
          const to = toStringArray(this.getNodeParameter('to', i) as string);
          const template = this.getNodeParameter('template', i) as string;
          const channels = this.getNodeParameter('channels', i) as string[];
          const variables = parseJsonObject(this.getNodeParameter('variablesJson', i, '{}') as string);
          const from = this.getNodeParameter('from', i, '') as string;
          const fromName = this.getNodeParameter('fromName', i, '') as string;
          const instanceId = this.getNodeParameter('instanceId', i, '') as string;
          const payload: JsonRecord = { to, template, channels };
          if (Object.keys(variables).length > 0) payload.variables = variables;
          if (from) payload.from = from;
          if (fromName) payload.fromName = fromName;
          if (instanceId) payload.instanceId = instanceId;
          response = await apiRequest('POST', '/templates/send', payload);
        } else if (resource === 'contacts') {
          if (operation === 'list') {
            const filters = parseJsonObject(this.getNodeParameter('contactFiltersJson', i, '{}') as string);
            response = await apiRequest('GET', '/contacts', undefined, filters);
          }
          if (operation === 'create') {
            const payload = parseJsonObject(this.getNodeParameter('contactPayloadJson', i) as string);
            response = await apiRequest('POST', '/contacts', payload);
          }
          if (operation === 'get') {
            const contactId = this.getNodeParameter('contactId', i) as string;
            response = await apiRequest('GET', `/contacts/${pathSegment(contactId)}`);
          }
          if (operation === 'update') {
            const contactId = this.getNodeParameter('contactId', i) as string;
            const payload = parseJsonObject(this.getNodeParameter('contactPayloadJson', i) as string);
            response = await apiRequest('PUT', `/contacts/${pathSegment(contactId)}`, payload);
          }
          if (operation === 'delete') {
            const contactId = this.getNodeParameter('contactId', i) as string;
            response = await apiRequest('DELETE', `/contacts/${pathSegment(contactId)}`);
          }
        } else if (resource === 'tags') {
          if (operation === 'list') {
            response = await apiRequest('GET', '/tags');
          }
          if (operation === 'create') {
            const tagName = this.getNodeParameter('tagName', i) as string;
            response = await apiRequest('POST', '/tags', { name: tagName });
          }
          if (operation === 'get') {
            const tagId = this.getNodeParameter('tagId', i) as string;
            response = await apiRequest('GET', `/tags/${pathSegment(tagId)}`);
          }
          if (operation === 'update') {
            const tagId = this.getNodeParameter('tagId', i) as string;
            const tagName = this.getNodeParameter('tagName', i) as string;
            response = await apiRequest('PUT', `/tags/${pathSegment(tagId)}`, { name: tagName });
          }
          if (operation === 'delete') {
            const tagId = this.getNodeParameter('tagId', i) as string;
            response = await apiRequest('DELETE', `/tags/${pathSegment(tagId)}`);
          }
        } else if (resource === 'emailDomains') {
          if (operation === 'list') response = await apiRequest('GET', '/email/domains');
          if (operation === 'create') {
            const domain = this.getNodeParameter('domain', i) as string;
            response = await apiRequest('POST', '/email/domains', { domain });
          }
          if (operation === 'get') {
            const domainId = this.getNodeParameter('domainId', i) as string;
            response = await apiRequest('GET', `/email/domains/${pathSegment(domainId)}`);
          }
          if (operation === 'verify') {
            const domainId = this.getNodeParameter('domainId', i) as string;
            response = await apiRequest('POST', `/email/domains/${pathSegment(domainId)}/verify`);
          }
        } else if (resource === 'pushApps') {
          if (operation === 'list') {
            const filters = parseJsonObject(this.getNodeParameter('listFiltersJson', i, '{}') as string);
            response = await apiRequest('GET', '/push/apps', undefined, filters);
          }
          if (operation === 'create') {
            const appName = this.getNodeParameter('appName', i) as string;
            response = await apiRequest('POST', '/push/apps', { name: appName });
          }
          if (operation === 'get') {
            const appId = this.getNodeParameter('appId', i) as string;
            response = await apiRequest('GET', `/push/apps/${pathSegment(appId)}`);
          }
          if (operation === 'update') {
            const appId = this.getNodeParameter('appId', i) as string;
            const appName = this.getNodeParameter('appName', i, '') as string;
            const patch = parseJsonObject(this.getNodeParameter('appUpdateJson', i, '{}') as string);
            if (appName) patch.name = appName;
            response = await apiRequest('PUT', `/push/apps/${pathSegment(appId)}`, patch);
          }
          if (operation === 'delete') {
            const appId = this.getNodeParameter('appId', i) as string;
            response = await apiRequest('DELETE', `/push/apps/${pathSegment(appId)}`);
          }
        } else if (resource === 'pushDevices') {
          if (operation === 'register') {
            const payload = parseJsonObject(this.getNodeParameter('devicePayloadJson', i) as string);
            response = await apiRequest('POST', '/push/devices', payload);
          }
          if (operation === 'list') {
            const filters = parseJsonObject(this.getNodeParameter('listFiltersJson', i, '{}') as string);
            response = await apiRequest('GET', '/push/devices', undefined, filters);
          }
          if (operation === 'get') {
            const deviceId = this.getNodeParameter('deviceId', i) as string;
            response = await apiRequest('GET', `/push/devices/${pathSegment(deviceId)}`);
          }
          if (operation === 'delete') {
            const deviceId = this.getNodeParameter('deviceId', i) as string;
            response = await apiRequest('DELETE', `/push/devices/${pathSegment(deviceId)}`);
          }
        } else if (resource === 'pushMessages') {
          if (operation === 'send') {
            const payload = parseJsonObject(this.getNodeParameter('pushPayloadJson', i) as string);
            response = await apiRequest('POST', '/push/messages', payload, undefined, idempotencyHeaders);
          }
          if (operation === 'list') {
            const filters = parseJsonObject(this.getNodeParameter('listFiltersJson', i, '{}') as string);
            response = await apiRequest('GET', '/push/messages', undefined, filters);
          }
          if (operation === 'get') {
            const pushMessageId = this.getNodeParameter('pushMessageId', i) as string;
            response = await apiRequest('GET', `/push/messages/${pathSegment(pushMessageId)}`);
          }
          if (operation === 'cancel') {
            const pushMessageId = this.getNodeParameter('pushMessageId', i) as string;
            response = await apiRequest('POST', `/push/messages/${pathSegment(pushMessageId)}/cancel`);
          }
        }

        out.push({ json: (response ?? {}) as IDataObject, pairedItem: { item: i } });
      } catch (error) {
        if (this.continueOnFail()) {
          out.push({
            json: {
              success: false,
              error: normalizeError(error) as IDataObject,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        if (error instanceof NodeOperationError) {
          throw error;
        }
        if (error instanceof Error) {
          throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
        }
        throw new NodeOperationError(this.getNode(), String(error), { itemIndex: i });
      }
    }

    return [out];
  }

}
