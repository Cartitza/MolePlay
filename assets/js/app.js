// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//
// If you have dependencies that try to import CSS, esbuild will generate a separate `app.css` file.
// To load it, simply add a second `<link>` to your `root.html.heex` file.

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html";
// Establish Phoenix Socket and LiveView configuration.
import { Socket } from "phoenix";
import { LiveSocket } from "phoenix_live_view";
import { hooks as colocatedHooks } from "phoenix-colocated/mole_view";
import topbar from "../vendor/topbar";

let Hooks = {};

Hooks.PlayerMovement = {
  mounted() {
    this.box = this.el.querySelector(".w-12.h-12");

    // Walk up to the full-width container (absolute bottom-16 w-full)
    const container = this.el.closest("[class*='bottom-16'][class*='w-full']")
                      || this.el.parentElement.parentElement;

    this.keys = {};

    // Read initial X from the data attribute instead of parsing calc()
    this.updatedX = parseFloat(this.el.dataset.posX) || 0;
    this.updatedY = 0;

    this.el.style.left = `calc(50% + ${this.updatedX}px)`;

    this.velocityY = 0;
    this.isOnGround = true;
    this.lastPushedBottom = 0;

    const GRAVITY = 0.5;
    const JUMP_FORCE = -12;
    const GROUND = 0;
    const PUSH_THRESHOLD = 2;

    this._onKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (!this.keys[k]) this.keys[k] = true;
    };
    this._onKeyUp = (e) => (this.keys[e.key.toLowerCase()] = false);

    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);

    this.loop = setInterval(() => {
      const containerWidth = container.offsetWidth;
      const boxWidth = this.box.offsetWidth;
      const rightBound = containerWidth / 2 - boxWidth;
      const leftBound = -(containerWidth / 2);

      // --- Horizontal ---
      if (this.keys["a"]) {
        const next = Math.max(leftBound, this.updatedX - 5);
        this.updatedX = next;
        this.el.style.left = `calc(50% + ${next}px)`;
        this.pushEvent("move", { direction: "left", new_pos: [next, this.updatedY] });
      }
      if (this.keys["d"]) {
        const next = Math.min(rightBound, this.updatedX + 5);
        this.updatedX = next;
        this.el.style.left = `calc(50% + ${next}px)`;
        this.pushEvent("move", { direction: "right", new_pos: [next, this.updatedY] });
      }

      // --- Jump ---
      if (this.keys[" "] && this.isOnGround) {
        this.velocityY = JUMP_FORCE;
        this.isOnGround = false;
      }

      // --- Vertical physics ---
      if (!this.isOnGround) {
        this.velocityY += GRAVITY;
        const nextBottom = this.updatedY - this.velocityY;

        if (nextBottom <= GROUND) {
          this.el.style.bottom = GROUND + "px";
          this.velocityY = 0;
          this.isOnGround = true;
          this.lastPushedBottom = 0;
          this.updatedY = 0;
          this.pushEvent("move", { direction: "vertical", new_pos: [this.updatedX, 0] });
        } else {
          this.el.style.bottom = nextBottom + "px";
          this.updatedY = nextBottom;

          if (Math.abs(nextBottom - this.lastPushedBottom) >= PUSH_THRESHOLD) {
            this.lastPushedBottom = nextBottom;
            this.pushEvent("move", { direction: "vertical", new_pos: [this.updatedX, nextBottom] });
          }
        }
      }
    }, 16);
  },

  destroyed() {
    clearInterval(this.loop);
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
  },
};


const csrfToken = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute("content");
const liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: { _csrf_token: csrfToken },
  hooks: Hooks,
});

// Show progress bar on live navigation and form submits
topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
window.addEventListener("phx:page-loading-start", (_info) => topbar.show(300));
window.addEventListener("phx:page-loading-stop", (_info) => topbar.hide());

// connect if there are any LiveViews on the page
liveSocket.connect();

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket;

// The lines below enable quality of life phoenix_live_reload
// development features:
//
//     1. stream server logs to the browser console
//     2. click on elements to jump to their definitions in your code editor
//
if (process.env.NODE_ENV === "development") {
  window.addEventListener(
    "phx:live_reload:attached",
    ({ detail: reloader }) => {
      // Enable server log streaming to client.
      // Disable with reloader.disableServerLogs()
      reloader.enableServerLogs();

      // Open configured PLUG_EDITOR at file:line of the clicked element's HEEx component
      //
      //   * click with "c" key pressed to open at caller location
      //   * click with "d" key pressed to open at function component definition location
      let keyDown;
      window.addEventListener("keydown", (e) => (keyDown = e.key));
      window.addEventListener("keyup", (_e) => (keyDown = null));
      window.addEventListener(
        "click",
        (e) => {
          if (keyDown === "c") {
            e.preventDefault();
            e.stopImmediatePropagation();
            reloader.openEditorAtCaller(e.target);
          } else if (keyDown === "d") {
            e.preventDefault();
            e.stopImmediatePropagation();
            reloader.openEditorAtDef(e.target);
          }
        },
        true,
      );

      window.liveReloader = reloader;
    },
  );
}
