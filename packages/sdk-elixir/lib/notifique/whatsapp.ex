defmodule Notifique.Whatsapp do
  @moduledoc """
  WhatsApp — POST /v1/whatsapp/messages, GET/DELETE/PATCH/POST /v1/whatsapp/messages/:id, /v1/whatsapp/instances/...
  """

  def send(client, instance_id, params, opts \\ []) do
    params = Map.put(params, "instanceId", instance_id)
    Notifique.request(client, :post, "/whatsapp/messages", params, opts)
  end

  def send_text(client, instance_id, to, text, opts \\ []) do
    to = List.wrap(to)
    params = %{
      "to" => to,
      "type" => "text",
      "payload" => %{"message" => text}
    }
    send(client, instance_id, params, opts)
  end

  def list_messages(client, params \\ %{}, opts \\ []) do
    query = URI.encode_query(params)
    path = if query == "", do: "/whatsapp/messages", else: "/whatsapp/messages?#{query}"
    Notifique.request(client, :get, path, nil, opts)
  end

  def get_message(client, message_id, opts \\ []) do
    Notifique.request(client, :get, "/whatsapp/messages/#{Notifique.encode_path_segment(message_id)}", nil, opts)
  end

  def delete_message(client, message_id, opts \\ []) do
    Notifique.request(client, :delete, "/whatsapp/messages/#{Notifique.encode_path_segment(message_id)}", nil, opts)
  end

  def edit_message(client, message_id, text, opts \\ []) do
    Notifique.request(client, :patch, "/whatsapp/messages/#{Notifique.encode_path_segment(message_id)}/edit", %{"text" => text}, opts)
  end

  def cancel_message(client, message_id, opts \\ []) do
    Notifique.request(client, :post, "/whatsapp/messages/#{Notifique.encode_path_segment(message_id)}/cancel", nil, opts)
  end

  def list_instances(client, params \\ %{}, opts \\ []) do
    query = URI.encode_query(params)
    path = if query == "", do: "/whatsapp/instances", else: "/whatsapp/instances?#{query}"
    Notifique.request(client, :get, path, nil, opts)
  end

  def get_instance(client, instance_id, opts \\ []) do
    Notifique.request(client, :get, "/whatsapp/instances/#{Notifique.encode_path_segment(instance_id)}", nil, opts)
  end

  def get_instance_qr(client, instance_id, opts \\ []) do
    Notifique.request(client, :get, "/whatsapp/instances/#{Notifique.encode_path_segment(instance_id)}/qr", nil, opts)
  end

  @doc """
  Cria instância WhatsApp. Resposta: `%{"success" => true, "data" => %{"instance" => %{...}, "connection" => %{"base64" => qr_data_url, "code" => ..., "pairingCode" => ..., "count" => ...}}}`.
  Use `data["connection"]["base64"]` para exibir o QR code.
  """
  def create_instance(client, name, opts \\ []) do
    Notifique.request(client, :post, "/whatsapp/instances", %{"name" => name}, opts)
  end

  def disconnect_instance(client, instance_id, opts \\ []) do
    Notifique.request(client, :post, "/whatsapp/instances/#{Notifique.encode_path_segment(instance_id)}/disconnect", nil, opts)
  end

  def delete_instance(client, instance_id, opts \\ []) do
    Notifique.request(client, :delete, "/whatsapp/instances/#{Notifique.encode_path_segment(instance_id)}", nil, opts)
  end
end
