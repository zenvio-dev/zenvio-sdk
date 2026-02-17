# Zenvio Elixir SDK

SDK oficial Zenvio para Elixir — WhatsApp, SMS, Email e envio por template (messages).

## Instalação

Adicione no `mix.exs`:

```elixir
def deps do
  [
    {:zenvio, "~> 0.2.0"}
  ]
end
```

## Uso rápido

```elixir
client = Zenvio.new("sua-api-key")
instance_id = "sua-instancia-whatsapp"

# WhatsApp — texto
case Zenvio.Whatsapp.send_text(client, instance_id, "5511999999999", "Olá pelo Elixir!") do
  {:ok, body} -> IO.inspect(body["message_ids"])
  {:error, %{status: code, body: body}} -> IO.puts("API erro #{code}: #{inspect(body)}")
  {:error, reason} -> IO.puts("Erro: #{inspect(reason)}")
end
```

## WhatsApp

- **POST /v1/whatsapp/send** — `Zenvio.Whatsapp.send(client, instance_id, params)` ou `send_text(client, instance_id, to, text)`
- **GET/DELETE/PATCH/POST** — `get_message`, `delete_message`, `edit_message`, `cancel_message`
- **Instâncias** — `list_instances`, `get_instance`, `create_instance`, `disconnect_instance`, `delete_instance`

Todos retornam `{:ok, body}` ou `{:error, %{status: code, body: body}}` em 4xx/5xx.

```elixir
# Texto
{:ok, resp} = Zenvio.Whatsapp.send_text(client, instance_id, ["5511999999999"], "Oi")

# Com params
params = %{
  "to" => ["5511999999999"],
  "type" => "image",
  "payload" => %{"media_url" => "https://exemplo.com/img.png"}
}
{:ok, resp} = Zenvio.Whatsapp.send(client, instance_id, params)

# Status da mensagem
{:ok, status} = Zenvio.Whatsapp.get_message(client, "msg-123")
```

## SMS

```elixir
{:ok, resp} = Zenvio.Sms.send(client, %{
  "to" => ["5511999999999"],
  "message" => "Seu código: 123"
})
# resp["data"]["sms_ids"]

{:ok, status} = Zenvio.Sms.get(client, "sms-id")
```

## Email

```elixir
{:ok, resp} = Zenvio.Email.send(client, %{
  "from" => "noreply@seudominio.com",
  "to" => ["cliente@email.com"],
  "subject" => "Assunto",
  "text" => "Corpo",
  "html" => "<p>Corpo HTML</p>"
})
# resp["data"]["email_ids"]

{:ok, status} = Zenvio.Email.get(client, "email-id")
{:ok, _} = Zenvio.Email.cancel(client, "email-id")
```

## Messages (template)

Envio por template em múltiplos canais (whatsapp, sms, email).

```elixir
{:ok, resp} = Zenvio.Messages.send(client, %{
  "to" => ["5511999999999"],
  "template" => "welcome",
  "variables" => %{"name" => "João"},
  "channels" => ["whatsapp", "sms"],
  "instance_id" => "inst-whatsapp"
})
# resp["data"]["message_ids"], resp["data"]["sms_ids"], etc.
```

## Erros

Em 4xx/5xx o SDK retorna `{:error, %{status: code, body: body}}`, onde `body` é o JSON decodificado (quando for JSON).

```elixir
case Zenvio.Whatsapp.send_text(client, inst, to, "Hi") do
  {:ok, body} -> # sucesso
  {:error, %{status: 400, body: %{"error" => msg}}} -> # erro da API
  {:error, reason} -> # falha de rede etc.
end
```

## Requisitos

- Elixir ~> 1.14
- Req ~> 0.4
- Jason ~> 1.4
