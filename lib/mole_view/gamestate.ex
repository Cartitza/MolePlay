defmodule MoleView.GameState do
  use GenServer

  defstruct player_list: []

  def start_link(_arg) do
    GenServer.start(__MODULE__, %__MODULE__{}, name: __MODULE__)
  end

  def add_new_player(player) do
    GenServer.call(__MODULE__, {:add_new_player, player})
  end

  def get_player_list do
    GenServer.call(__MODULE__, :get_player_list)
  end

  # --- HANDLERS ---
  def init(init_gamestate) do
    {:ok, init_gamestate}
  end

  def handle_call({:add_new_player, player}, _from, state) do
    # add the new player to the player list
    new_player_list =
      if Enum.any?(state.player_list, fn p -> p.id == player.id end) do
        state.player_list
      else
        [player | state.player_list]
      end

    new_state = Map.put(state, :player_list, new_player_list)

    {:reply, new_player_list, new_state}
  end

  def handle_call(:get_player_list, _from, state) do
    {:reply, state.player_list, state}
  end
end
