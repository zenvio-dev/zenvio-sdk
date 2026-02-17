defmodule Zenvio do
  @moduledoc """
  Zenvio SDK — WhatsApp, SMS, Email e envio por template (messages).
  """

  defstruct [:api_key, :base_url]

  @type t :: %__MODULE__{
          api_key: String.t(),
          base_url: String.t()
        }

  @doc """
  Inicializa um novo cliente Zenvio.
  """
  def new(api_key, base_url \\ "https://api.zenvio.com/v1") do
    %__MODULE__{
      api_key: api_key,
      base_url: String.trim_trailing(base_url, "/")
    }
  end

  @doc """
  Executa a requisição HTTP.
  Em status >= 400 retorna `{:error, %{status: code, body: body}}`.
  Caso contrário retorna `{:ok, body}` (body é o JSON decodificado).
  Para GET/DELETE sem body, passe `body: nil`.
  """
  def request(client, method, path, body \\ nil, opts \\ []) do
    url = client.base_url <> path

    base = [
      method: method,
      url: url,
      headers: [
        {"content-type", "application/json"},
        {"user-agent", "Zenvio-Elixir-SDK/0.2.0"}
      ]
    ]

    # Req usa :auth para Bearer
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
end
