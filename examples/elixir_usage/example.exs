# Notifique SDK Example em Elixir

api_key = System.get_env("NOTIFIQUE_API_KEY")
phone_id = System.get_env("NOTIFIQUE_INSTANCE_ID")
recipient = System.get_env("MY_PHONE")

if is_nil(api_key) or is_nil(phone_id) or is_nil(recipient) do
  raise "Set NOTIFIQUE_API_KEY, NOTIFIQUE_INSTANCE_ID and MY_PHONE before running this example."
end

client = Notifique.new(api_key)

IO.puts("--- Notifique Elixir SDK Example ---")

IO.puts("\n1. Sending text...")
case Notifique.Whatsapp.send_text(client, phone_id, [recipient], "Hello from Elixir! 💧") do
  {:ok, body} -> IO.inspect(body, label: "Success")
  {:error, reason} -> IO.puts("Error: #{inspect(reason)}")
end

IO.puts("\n2. Sending with params...")
params = %{
  "to" => [recipient],
  "type" => "text",
  "payload" => %{"message" => "Hello from Notifique!"}
}
case Notifique.Whatsapp.send(client, phone_id, params) do
  {:ok, body} -> IO.inspect(body, label: "Success")
  {:error, reason} -> IO.puts("Error: #{inspect(reason)}")
end
