defmodule Zenvio.Sms do
  @moduledoc """
  SMS — POST /v1/sms/messages, GET /v1/sms/messages/:id, POST /v1/sms/messages/:id/cancel
  """

  @doc """
  POST /v1/sms/messages.
  params: map com "to" (lista), "message" (e opcionalmente "schedule", "options").
  """
  def send(client, params, opts \\ []) do
    Zenvio.request(client, :post, "/sms/messages", params, opts)
  end

  @doc "GET /v1/sms/messages/:id"
  def get(client, id, opts \\ []) do
    Zenvio.request(client, :get, "/sms/messages/#{id}", nil, opts)
  end

  @doc "POST /v1/sms/messages/:id/cancel — cancela SMS agendado (status SCHEDULED). Escopo: sms:cancel."
  def cancel(client, id, opts \\ []) do
    Zenvio.request(client, :post, "/sms/messages/#{id}/cancel", nil, opts)
  end
end
