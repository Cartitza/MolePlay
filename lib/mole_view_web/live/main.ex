defmodule MoleViewWeb.MainLive do
  use MoleViewWeb, :live_view

  alias MoleView.Player

  import MoleViewWeb.GameComponents

  @impl true
  def mount(_params, _session, socket) do
    player = %Player{colour: "cyan"}
    {:ok, assign(socket, :local_player, player)}
  end

  @impl true
  def handle_event("move", _payload, socket) do
    {:noreply, socket}
  end
end
