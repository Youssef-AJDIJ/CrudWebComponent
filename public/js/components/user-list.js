/**
 * <user-list> Web Component
 * Methods: setUsers(users[])
 */
class UserList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._users = [];
  }

  connectedCallback() {
    this.render();
  }

  /** Replace displayed users */
  setUsers(users) {
    this._users = users;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .empty {
          color: rgba(255,255,255,0.65);
          text-align: center;
          font-size: 1rem;
          padding: 40px 0;
          font-style: italic;
        }
      </style>
      ${
        this._users.length === 0
          ? '<p class="empty">No hay usuarios aún. ¡Crea uno con el formulario!</p>'
          : this._users
              .map(
                (u) => `
                <user-card
                  data-id="${u.id}"
                  data-user="${this._esc(u.user)}"
                  data-email="${this._esc(u.email)}"
                  data-phone="${this._esc(u.phone || "")}"
                  data-created="${u.createdAt || ""}"
                  data-updated="${u.updatedAt || ""}"
                ></user-card>`,
              )
              .join("")
      }
    `;
  }

  _esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}

customElements.define("user-list", UserList);
