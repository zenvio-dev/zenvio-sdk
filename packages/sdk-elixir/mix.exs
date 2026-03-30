defmodule Notifique.MixProject do
  use Mix.Project

  @version "0.1.0"

  def project do
    [
      app: :notifique,
      version: @version,
      elixir: "~> 1.14",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      description: "SDK oficial Notifique para Elixir",
      package: package()
    ]
  end

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp deps do
    [
      {:req, "~> 0.5.17"},
      {:jason, "~> 1.4"},
      {:ex_doc, ">= 0.0.0", runtime: false}
    ]
  end

  defp package do
    [
      licenses: ["MIT"],
      links: %{"GitHub" => "https://github.com/notifique/notifique-sdk"}
    ]
  end
end
