defmodule MoleView.WeaponSpawner do
  use GenServer

  @spawn_delay 5_000
  @despawn_delay 3_000

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  @impl true
  def init(:ok) do
    schedule_spawn()
    {:ok, %{}}
  end

  @impl true
  def handle_info(:spawn_weapon, state) do
    weapon_x = Enum.random(-400..400)

    Phoenix.PubSub.broadcast(
      MoleView.PubSub,
      "game_room",
      {:render_weapon, weapon_x}
    )

    Process.send_after(self(), :despawn_weapon, @despawn_delay)
    {:noreply, state}
  end

  @impl true
  def handle_info(:despawn_weapon, state) do
    Phoenix.PubSub.broadcast(MoleView.PubSub, "game_room", :dont_render_weapon)

    schedule_spawn()
    {:noreply, state}
  end

  defp schedule_spawn, do: Process.send_after(self(), :spawn_weapon, @spawn_delay)
end
