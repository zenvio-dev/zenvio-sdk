defmodule Zenvio.Sms do
  @moduledoc """
  SMS — POST /v1/sms/send, GET /v1/sms/:id, POST /v1/sms/:id/cancel
  """

  @doc """
  POST /v1/sms/send.
  params: map com "to" (lista), "message" (e opcionalmente "schedule", "options").
  """
  def send(client, params, opts \\ []) do
    Zenvio.request(client, :post, "/sms/send", params, opts)
  end

  @doc "GET /v1/sms/:id"
  def get(client, id, opts \\ []) do
    Zenvio.request(client, :get, "/sms/#{id}", nil, opts)
  end

  @doc "POST /v1/sms/:id/cancel — cancela SMS agendado (status SCHEDULED). Escopo: sms:cancel."
  def cancel(client, id, opts \\ []) do
    Zenvio.request(client, :post, "/sms/#{id}/cancel", nil, opts)
  end
end
