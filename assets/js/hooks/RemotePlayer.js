const RemotePlayer = {
  mounted() {
    // LiveView will push "player_moved" events to this element's topic
    this.handleEvent("player_moved", ({ id, x, y }) => {
      // Only update the element that matches this player
      const el = document.getElementById(`remote_player_${id}`);
      if (el) {
        el.style.left = `calc(50% + ${x}px)`;
        el.style.bottom = `${y}px`;
      }
    });
  }
};

export default RemotePlayer;
