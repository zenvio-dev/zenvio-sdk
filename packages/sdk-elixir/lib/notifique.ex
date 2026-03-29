defmodule Notifique do
  @moduledoc """
  Cliente Notifique — WhatsApp, SMS, Email, Push e envio por template (messages).
  """

  defstruct [:api_key, :base_url]

  @type t :: %__MODULE__{
          api_key: String.t(),
          base_url: String.t()
        }

  @doc """
  Inicializa um novo cliente Notifique.
  base_url padrão: https://api.notifique.dev/v1
  """
  def new(api_key, base_url \\ "https://api.notifique.dev/v1") do
    if !is_binary(api_key) or String.trim(api_key) == "" do
      raise ArgumentError, "api_key must be a non-empty string"
    end

    uri = URI.parse(base_url)
    if uri.scheme != "https" or is_nil(uri.host) do
      raise ArgumentError, "base_url must be an absolute HTTPS URL"
    end

    %__MODULE__{
      api_key: api_key,
      base_url: String.trim_trailing(base_url, "/")
    }
  end

  @doc """
  Executa a requisição HTTP.
  Em status >= 400 retorna `{:error, %{status: code, body: body}}`.
  Caso contrário retorna `{:ok, body}` (body é o JSON decodificado).
  """
  def request(client, method, path, body \\ nil, opts \\ []) do
    url = client.base_url <> path

    base = [
      method: method,
      url: url,
      receive_timeout: 30_000,
      headers: [
        {"content-type", "application/json"},
        {"user-agent", "Notifique-Elixir-SDK/0.2.0"}
      ]
    ]

    options =
      base
      |> Keyword.put(:auth, {:bearer, client.api_key})
      |> maybe_put_json(body)
      |> Keyword.merge(opts)

    case Req.request(options) do
      {:ok, %{status: status, body: resp_body}} when status >= 200 and status < 300 ->
        {:ok, resp_body}

      {:ok, %{status: status, body: resp_body}} when status >= 400 ->
        {:error, %{status: status, body: resp_body}}

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp maybe_put_json(opts, nil), do: opts
  defp maybe_put_json(opts, body), do: Keyword.put(opts, :json, body)

  def encode_path_segment(segment), do: URI.encode(segment, &URI.char_unreserved?/1)
end
