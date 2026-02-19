defmodule Zenvio.Whatsapp do
  @moduledoc """
  WhatsApp — POST /v1/whatsapp/send, GET/DELETE/PATCH/POST /v1/whatsapp/:id, /v1/whatsapp/instances/...
  """

  @doc """
  POST /v1/whatsapp/send — instance_id no body.
  params: map com "to", "type", "payload" (e opcionalmente "schedule", "options").
  Tipos: text (payload.message), image|video|audio|document (payload.media_url, file_name, mimetype — todos obrigatórios), location (payload.latitude, longitude, name, address), contact (payload.contact com fullName, wuid/phoneNumber e opcionalmente organization, email, url; ou payload.contact_id = ID do contato do workspace).
  """
  def send(client, instance_id, params, opts \\ []) do
    params = Map.put(params, "instance_id", instance_id)
    Zenvio.request(client, :post, "/whatsapp/send", params, opts)
  end

  @doc """
  Atalho: texto (payload.message).
  to pode ser string ou lista de strings.
  """
  def send_text(client, instance_id, to, text, opts \\ []) do
    to = List.wrap(to)
    params = %{
      "to" => to,
      "type" => "text",
      "payload" => %{"message" => text}
    }
    send(client, instance_id, params, opts)
  end

  @doc "GET /v1/whatsapp/:messageId"
  def get_message(client, message_id, opts \\ []) do
    Zenvio.request(client, :get, "/whatsapp/#{message_id}", nil, opts)
  end

  @doc "DELETE /v1/whatsapp/:messageId"
  def delete_message(client, message_id, opts \\ []) do
    Zenvio.request(client, :delete, "/whatsapp/#{message_id}", nil, opts)
  end

  @doc "PATCH /v1/whatsapp/:messageId/edit — body: %{\"text\" => \"...\"}"
  def edit_message(client, message_id, text, opts \\ []) do
    Zenvio.request(client, :patch, "/whatsapp/#{message_id}/edit", %{"text" => text}, opts)
  end

  @doc "POST /v1/whatsapp/:messageId/cancel"
  def cancel_message(client, message_id, opts \\ []) do
    Zenvio.request(client, :post, "/whatsapp/#{message_id}/cancel", nil, opts)
  end

  @doc """
  GET /v1/whatsapp/instances.
  params: opcional, ex. %{"page" => "1", "limit" => "10", "status" => "", "search" => ""}
  """
  def list_instances(client, params \\ %{}, opts \\ []) do
    query = URI.encode_query(params)
    path = if query == "", do: "/whatsapp/instances", else: "/whatsapp/instances?#{query}"
    Zenvio.request(client, :get, path, nil, opts)
  end

  @doc "GET /v1/whatsapp/instances/:instanceId"
  def get_instance(client, instance_id, opts \\ []) do
    Zenvio.request(client, :get, "/whatsapp/instances/#{instance_id}", nil, opts)
  end

  @doc "POST /v1/whatsapp/instances — body: %{\"name\" => \"...\"}"
  def create_instance(client, name, opts \\ []) do
    Zenvio.request(client, :post, "/whatsapp/instances", %{"name" => name}, opts)
  end

  @doc "POST /v1/whatsapp/instances/:instanceId/disconnect"
  def disconnect_instance(client, instance_id, opts \\ []) do
    Zenvio.request(client, :post, "/whatsapp/instances/#{instance_id}/disconnect", nil, opts)
  end

  @doc "DELETE /v1/whatsapp/instances/:instanceId"
  def delete_instance(client, instance_id, opts \\ []) do
    Zenvio.request(client, :delete, "/whatsapp/instances/#{instance_id}", nil, opts)
  end
end
