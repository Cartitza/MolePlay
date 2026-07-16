defmodule MoleViewWeb.MainLive do
  use MoleViewWeb, :live_view

  alias MoleView.Player
  alias MoleView.GameState

  import MoleViewWeb.GameComponents

  @impl true
  def mount(_params, _session, socket) do
    # Subscribe to PubSub
    Phoenix.PubSub.subscribe(MoleView.PubSub, "game_room")

    # player = %Player{colour: "cyan", posX: Enum.random(-400..400), id: Enum.random(1..99999)}

    new_socket =
      socket
      |> assign(:is_ready, false)
      |> assign(:local_player, nil)
      |> assign(:remote_players, [])

    # TODO: Player list
    {:ok, new_socket}
  end

  @impl true
  def handle_event("join_game", %{"player_name" => name, "player_colour" => colour}, socket) do
    # Build the local player and mark as ready
    player = %Player{
      name: name,
      colour: colour,
      posX: Enum.random(-400..400),
      id: Enum.random(1..99999)
    }

    # broadcast 'new_player'
    if connected?(socket) do
      GameState.add_new_player(player)
      Phoenix.PubSub.broadcast(MoleView.PubSub, "game_room", {:new_player, player})
    end

    new_socket =
      socket
      |> assign(:is_ready, true)
      |> assign(:local_player, player)

    {:noreply, new_socket}
  end

  @impl true
  def handle_event("move", %{"direction" => _dir, "new_pos" => [new_x, new_y]}, socket) do
    # dau broadcast
    Phoenix.PubSub.broadcast(
      MoleView.PubSub,
      "game_room",
      {:position_update, socket.assigns.local_player.id, new_x, new_y}
    )

    {:noreply, socket}
  end

  @impl true
  def handle_info({:new_player, player}, socket) when socket.assigns.is_ready do
    # should add "is_ready" checks for less errors
    local_id = socket.assigns.local_player.id
    # update the genserver
    if player.id != local_id do
      GameState.add_new_player(player)
    end

    remote_player_list =
      GameState.get_player_list()
      |> Enum.reject(fn p -> p.id == local_id end)

    {:noreply, assign(socket, :remote_players, remote_player_list)}
  end

  def handle_info({:new_player, _player}, socket) do
    {:noreply, socket}
  end

  @impl true
  def handle_info({:position_update, id, new_x, new_y}, socket) when socket.assigns.is_ready do
    # in handle_info de la broadcast:
    # 1. update la genserver cu pozitia per id
    GameState.update_player_position(id, new_x, new_y)
    # 2. nu intorc socket, ci event pt hookul de remote_player
    {:noreply, push_event(socket, "player_moved", %{id: id, x: new_x, y: new_y})}
  end

  def handle_info({:position_update, _id, _new_x, _new_y}, socket) do
    {:noreply, socket}
  end
end
