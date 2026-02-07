# Zenvio Elixir SDK

Official Zenvio SDK for Elixir.

## Installation

Add `zenvio` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:zenvio, "~> 0.1.0"}
  ]
end
```

## Quick Start

```elixir
# Initialize the client
client = Zenvio.new("your-api-key")

phone_id = "your-phone-id"

# 1. Simple text message
{:ok, response} = Zenvio.Whatsapp.send_text(client, phone_id, "5511999999999", "Hello from Elixir! 💧")

# 2. Template message
params = %{
  "to" => ["5511999999999"],
  "type" => "template",
  "payload" => %{
    "key" => "order_update",
    "language" => "en_US",
    "variables" => ["John", "Shipped"]
  }
}

Zenvio.Whatsapp.send(client, phone_id, params)
```

## Features

- Uses `Req` for lightweight, modern HTTP requests.
- Simple namespaced API (`Zenvio.Whatsapp`).
- Built-in JSON support via `Jason`.
