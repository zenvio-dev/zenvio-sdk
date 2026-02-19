defmodule Zenvio.Messages do
  @moduledoc """
  Messages (templates) — POST /v1/templates/send
  Envio por template em múltiplos canais (whatsapp, sms, email).
  Parâmetros (mesmos da API): to, template, variables, channels, instance_id, from, fromName.
  """

  @doc """
  POST /v1/templates/send.
  params: map com "to", "template", "channels" (obrigatórios) e opcionalmente "variables", "instance_id", "from", "fromName".
  Aceita também "from_name" (será enviado como "fromName" para a API).
  """
  def send(client, params, opts \\ []) do
    params = normalize_params(params)
    Zenvio.request(client, :post, "/templates/send", params, opts)
  end

  defp normalize_params(params) when is_map(params) do
    params
    |> maybe_put_from_name()
  end

  defp maybe_put_from_name(params) do
    from_name = Map.get(params, "from_name") || Map.get(params, :from_name)
    from_name_api = Map.get(params, "fromName") || Map.get(params, :fromName)
    cond do
      is_binary(from_name) and is_nil(from_name_api) ->
        params
        |> Map.delete("from_name")
        |> Map.delete(:from_name)
        |> Map.put("fromName", from_name)
      true ->
        params
    end
  end
end
