defmodule Zenvio.Messages do
  @moduledoc """
  Messages (templates) — POST /v1/templates/send
  Envio por template em múltiplos canais (whatsapp, sms, email).
  """

  @doc """
  POST /v1/templates/send.
  params: map com "to", "template", "channels" (e opcionalmente "variables", "instance_id", "from", "from_name").
  """
  def send(client, params, opts \\ []) do
    Zenvio.request(client, :post, "/templates/send", params, opts)
  end
end
