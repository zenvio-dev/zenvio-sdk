defmodule Zenvio.Email do
  @moduledoc """
  Email — POST /v1/email/send, GET /v1/email/:id, POST /v1/email/:id/cancel
  """

  @doc """
  POST /v1/email/send (campo "from" na API).
  params: map com "from", "to", "subject" e "text" e/ou "html" (e opcionalmente "from_name", "schedule", "options").
  """
  def send(client, params, opts \\ []) do
    Zenvio.request(client, :post, "/email/send", params, opts)
  end

  @doc "GET /v1/email/:id"
  def get(client, id, opts \\ []) do
    Zenvio.request(client, :get, "/email/#{id}", nil, opts)
  end

  @doc "POST /v1/email/:id/cancel"
  def cancel(client, id, opts \\ []) do
    Zenvio.request(client, :post, "/email/#{id}/cancel", nil, opts)
  end
end
