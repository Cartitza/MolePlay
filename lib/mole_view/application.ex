defmodule MoleView.Application do
  # See https://elixir.hexdocs.pm/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      MoleViewWeb.Telemetry,
      # MoleView.Repo,
      {DNSCluster, query: Application.get_env(:mole_view, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: MoleView.PubSub},
      # Start a worker by calling: MoleView.Worker.start_link(arg)
      # {MoleView.Worker, arg},
      # Start to serve requests, typically the last entry
      MoleViewWeb.Endpoint,
      MoleView.GameState
    ]

    # See https://elixir.hexdocs.pm/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: MoleView.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    MoleViewWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
