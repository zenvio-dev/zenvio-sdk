defmodule Zenvio.Email do
  @moduledoc """
  Email — POST /v1/email/messages, GET /v1/email/messages/:id, POST /v1/email/messages/:id/cancel
  """

  @doc """
  POST /v1/email/messages (campo "from" na API).
  params: map com "from", "to", "subject" e "text" e/ou "html" (e opcionalmente "from_name", "schedule", "options").
  """
  def send(client, params, opts \\ []) do
    Zenvio.request(client, :post, "/email/messages", params, opts)
  end

  @doc "GET /v1/email/messages/:id"
  def get(client, id, opts \\ []) do
    Zenvio.request(client, :get, "/email/messages/#{id}", nil, opts)
  end

  @doc "POST /v1/email/messages/:id/cancel"
  def cancel(client, id, opts \\ []) do
    Zenvio.request(client, :post, "/email/messages/#{id}/cancel", nil, opts)
  end
end
