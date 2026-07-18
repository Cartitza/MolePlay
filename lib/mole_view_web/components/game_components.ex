defmodule MoleViewWeb.GameComponents do
  use Phoenix.Component

  attr :player_colour, :string, required: true
  attr :player_posX, :float, required: true
  attr :player_name, :string, required: true
  attr :player_id, :integer, required: true

  def player_box(assigns) do
    ~H"""
    <div
      id="local_player"
      phx-hook="PlayerMovement"
      class="absolute bottom-0"
      data-pos-x={@player_posX}
      data-player-id={@player_id}
    >
      <span class="mb-1 text-xs font-semibold text-white drop-shadow-md whitespace-nowrap">
        {@player_name}
      </span>
      <div
        class="w-12 h-12 rounded-md border-2 border-black-800 shadow-lg"
        style={"background-color: #{@player_colour};"}
      >
      </div>
    </div>
    """
  end

  attr :player, :map, required: true

  def remote_player_box(assigns) do
    ~H"""
    <div
      id={"remote_player_#{@player.id}"}
      phx-hook="RemotePlayer"
      class="absolute bottom-0"
      style={"left: calc(50% + #{@player.posX}px)"}
    >
      <span class="mb-1 text-xs font-semibold text-white drop-shadow-md whitespace-nowrap">
        {@player.name}
      </span>
      <div
        class="w-12 h-12 rounded-md border-2 border-black-800 shadow-lg"
        style={"background-color: #{@player.colour};"}
      >
      </div>
    </div>
    """
  end

  attr :players, :list, required: true

  def leaderboard(assigns) do
    ~H"""
    <div class="absolute top-4 left-0 right-0 flex justify-center px-4 z-10">
      <div class="flex gap-3 flex-wrap justify-center">
        <%= for player <- @players do %>
          <div class="flex flex-col gap-1 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[80px]">
            <div class="flex items-center gap-1.5">
              <div
                class="w-3 h-3 rounded-sm flex-shrink-0"
                style={"background-color: #{player.colour};"}
              />
              <span class="text-xs font-semibold text-white truncate max-w-[80px]">
                {player.name}
              </span>
            </div>
            <div class="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                class="h-full bg-green-400 rounded-full transition-all duration-300"
                style={"width: #{player.hp}%;"}
              />
            </div>
          </div>
        <% end %>
      </div>
    </div>
    """
  end
end
