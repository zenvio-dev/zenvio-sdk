# Zenvio SDK Example in Elixir

# 1. Initialize the client
client = Zenvio.new("your_api_key_here")
phone_id = "your_phone_id_here"
recipient = "5511999999999"

IO.puts("--- Starting Zenvio Elixir SDK Example ---")

# 2. Simplified Text
IO.puts("\n1. Sending simplified text...")
case Zenvio.Whatsapp.send_text(client, phone_id, recipient, "Hello from Elixir! 💧") do
  {:ok, body} -> IO.inspect(body, label: "Success")
  {:error, reason} -> IO.puts("Error: #{reason}")
end

# 3. Full Params (Template)
IO.puts("\n2. Sending template message...")
params = %{
  "to" => [recipient],
  "type" => "template",
  "payload" => %{
    "key" => "order_on_route",
    "language" => "pt_BR",
    "variables" => ["Elixir Developer", "Standard Shipping"]
  }
}

case Zenvio.Whatsapp.send(client, phone_id, params) do
  {:ok, body} -> IO.inspect(body, label: "Success")
  {:error, reason} -> IO.puts("Error: #{reason}")
end
