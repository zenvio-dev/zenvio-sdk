# Matriz E2E - n8n Notifique

Este guia valida o node `Notifique` ponta a ponta no n8n.

## Pré-requisitos

- n8n rodando com `n8n-nodes-notifique` instalado
- credencial `Notifique API` configurada
- API Key com escopos para:
  - `whatsapp:*`, `sms:*`, `email:*`, `push:*`, `contacts:*`, `tags:*`
- ao menos uma instância WhatsApp ativa para testes de envio
- domínio de email para ciclo de verificação (pode ser sandbox)
- app push e device de teste para fluxo de push

## Convenções dos testes

- Executar cada teste com um workflow separado
- Salvar outputs em `Set`/`Code` node para auditoria
- Para envios assíncronos, testar com e sem `Aguardar Status Final`
- Sempre validar:
  - status HTTP lógico (`success`)
  - ids retornados
  - estrutura de erro em falhas forçadas

## 1) WhatsApp - mensagens

- **WA-01 Enviar texto**
  - Recurso: `whatsapp`, operação: `sendText`
  - Esperado: `success=true`, `data.messageIds[0]` preenchido
- **WA-02 Listar mensagens**
  - Recurso: `whatsapp`, operação: `listMessages`
  - Esperado: paginação + lista retornada
- **WA-03 Obter status**
  - Recurso: `whatsapp`, operação: `getMessage`
  - Entrada: `messageId` do WA-01
  - Esperado: `data.status` presente
- **WA-04 Editar mensagem**
  - Recurso: `whatsapp`, operação: `edit`
  - Esperado: resposta de ação sem erro
- **WA-05 Cancelar agendada**
  - Recurso: `whatsapp`, operação: `cancel`
  - Pré: mensagem agendada
  - Esperado: status de cancelamento
- **WA-06 Apagar para todos**
  - Recurso: `whatsapp`, operação: `delete`
  - Esperado: resposta de deleção sem erro

## 2) WhatsApp - instâncias

- **WAI-01 Listar instâncias**
  - Recurso: `whatsappInstances`, operação: `list`
- **WAI-02 Criar instância**
  - Recurso: `whatsappInstances`, operação: `create`
  - Esperado: `instance.id` + dados de conexão/QR
- **WAI-03 Obter instância**
  - Recurso: `whatsappInstances`, operação: `get`
- **WAI-04 Obter QR atual**
  - Recurso: `whatsappInstances`, operação: `getQr`
- **WAI-05 Desconectar**
  - Recurso: `whatsappInstances`, operação: `disconnect`
- **WAI-06 Remover**
  - Recurso: `whatsappInstances`, operação: `delete`

## 3) WhatsApp - grupos

- **WAG-01 Listar grupos**
  - Recurso: `whatsappGroups`, operação: `list`
- **WAG-02 Listar participantes**
  - Recurso: `whatsappGroups`, operação: `listParticipants`
- **WAG-03 Adicionar participante**
  - Recurso: `whatsappGroups`, operação: `addParticipants`
- **WAG-04 Remover participante**
  - Recurso: `whatsappGroups`, operação: `removeParticipants`
- **WAG-05 Enviar convite**
  - Recurso: `whatsappGroups`, operação: `sendInvite`
- **WAG-06 Revogar convite**
  - Recurso: `whatsappGroups`, operação: `revokeInvite`
- **WAG-07 Buscar código de convite**
  - Recurso: `whatsappGroups`, operação: `getInviteCode`

## 4) SMS

- **SMS-01 Enviar**
  - Recurso: `sms`, operação: `send`
  - Esperado: `data.smsIds[0]`
- **SMS-02 Consultar status**
  - Recurso: `sms`, operação: `get`
  - Entrada: `smsId` do SMS-01
- **SMS-03 Cancelar agendado**
  - Recurso: `sms`, operação: `cancel`
  - Pré: SMS agendado

## 5) Email e domínios

- **EM-01 Enviar email**
  - Recurso: `email`, operação: `send`
  - Esperado: `data.emailIds[0]`
- **EM-02 Consultar status**
  - Recurso: `email`, operação: `get`
- **EM-03 Cancelar agendado**
  - Recurso: `email`, operação: `cancel`
- **EMD-01 Listar domínios**
  - Recurso: `emailDomains`, operação: `list`
- **EMD-02 Registrar domínio**
  - Recurso: `emailDomains`, operação: `create`
- **EMD-03 Obter por ID**
  - Recurso: `emailDomains`, operação: `get`
- **EMD-04 Verificar DNS**
  - Recurso: `emailDomains`, operação: `verify`

## 6) Push

- **PA-01 Listar apps**
  - Recurso: `pushApps`, operação: `list`
- **PA-02 Criar app**
  - Recurso: `pushApps`, operação: `create`
- **PA-03 Obter app**
  - Recurso: `pushApps`, operação: `get`
- **PA-04 Atualizar app**
  - Recurso: `pushApps`, operação: `update`
- **PA-05 Deletar app**
  - Recurso: `pushApps`, operação: `delete`
- **PD-01 Registrar device**
  - Recurso: `pushDevices`, operação: `register`
- **PD-02 Listar devices**
  - Recurso: `pushDevices`, operação: `list`
- **PD-03 Obter device**
  - Recurso: `pushDevices`, operação: `get`
- **PD-04 Remover device**
  - Recurso: `pushDevices`, operação: `delete`
- **PM-01 Enviar push**
  - Recurso: `pushMessages`, operação: `send`
- **PM-02 Listar envios**
  - Recurso: `pushMessages`, operação: `list`
- **PM-03 Consultar envio**
  - Recurso: `pushMessages`, operação: `get`
- **PM-04 Cancelar agendado**
  - Recurso: `pushMessages`, operação: `cancel`

## 7) Templates, contatos e tags

- **TPL-01 Enviar template**
  - Recurso: `templates`, operação: `send`
- **CT-01 Listar contatos**
  - Recurso: `contacts`, operação: `list`
- **CT-02 Criar contato**
  - Recurso: `contacts`, operação: `create`
- **CT-03 Obter contato**
  - Recurso: `contacts`, operação: `get`
- **CT-04 Atualizar contato**
  - Recurso: `contacts`, operação: `update`
- **CT-05 Excluir contato**
  - Recurso: `contacts`, operação: `delete`
- **TG-01 Listar tags**
  - Recurso: `tags`, operação: `list`
- **TG-02 Criar tag**
  - Recurso: `tags`, operação: `create`
- **TG-03 Obter tag**
  - Recurso: `tags`, operação: `get`
- **TG-04 Atualizar tag**
  - Recurso: `tags`, operação: `update`
- **TG-05 Excluir tag**
  - Recurso: `tags`, operação: `delete`

## 8) Testes negativos obrigatórios

- API key inválida ou sem escopo -> erro formatado com `statusCode/code/responseData`
- `cancel`/`delete` sem confirmar operação sensível -> bloqueio no node
- payload JSON inválido em campos `...Json` -> erro de validação no node
- `waitForStatus=true` com timeout baixo -> retorno com `timedOut=true`

## Critério de aprovação

- 100% dos cenários críticos (WA-01..06, SMS-01..03, EM-01..03, PM-01..04, TPL-01) aprovados
- 0 falhas de serialização ou campos obrigatórios no node
- erros negativos com mensagem legível e contexto suficiente para troubleshooting
