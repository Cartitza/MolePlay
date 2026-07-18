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

    // showcase which player has the weapon
    this.handleEvent("remote_player_has_weapon", ({ id }) => {
      const el = document.getElementById(`remote_player_${id}`);
      if (el) {
        const box = el.querySelector(".w-12.h-12");
        if (box) box.style.outline = "3px solid gold";
      }
    });

    // showcase which player used the weapon
    this.handleEvent("remote_player_doesnt_have_weapon", ({ id }) => {
      const el = document.getElementById(`remote_player_${id}`);
      if (el) {
        const box = el.querySelector(".w-12.h-12");
        if (box) box.style.outline = "";
      }
    });
  }
};

export default RemotePlayer;
