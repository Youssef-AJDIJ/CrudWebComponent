/**
 * <user-form> Web Component
 * Events: form-save (detail: { id?, user, email, phone })
 * Methods: setUser(data), reset()
 */
class UserForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._editingId = null;
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
  }

  /** Populate form for editing */
  setUser({ id, user, email, phone }) {
    this._editingId = id;
    this.shadowRoot.getElementById("inputUser").value = user || "";
    this.shadowRoot.getElementById("inputEmail").value = email || "";
    this.shadowRoot.getElementById("inputPhone").value = phone || "";
    this.shadowRoot.getElementById("saveBtn").textContent = "update";
  }

  /** Clear form */
  reset() {
    this._editingId = null;
    this.shadowRoot.getElementById("frm").reset();
    this.shadowRoot.getElementById("saveBtn").textContent = "save";
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; max-width: 440px; }

        form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .field {
          display: grid;
          grid-template-columns: 110px 1fr;
          align-items: center;
        }

        label {
          background: #1a237e;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 12px 14px;
          border-radius: 4px 0 0 4px;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        input {
          background: #cfd8dc;
          border: none;
          outline: none;
          padding: 12px 14px;
          font-size: 0.95rem;
          font-family: 'Roboto', sans-serif;
          border-radius: 0 4px 4px 0;
          color: #1a1a2e;
          width: 100%;
          transition: background 0.2s;
        }
        input:focus { background: #b0bec5; }

        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 4px;
        }

        button {
          padding: 14px;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-transform: lowercase;
          letter-spacing: 0.04em;
          transition: filter 0.15s, transform 0.1s;
        }
        button:hover  { filter: brightness(1.12); }
        button:active { transform: scale(0.97); }

        #saveBtn  { background: #f57f17; color: #fff; }
        #resetBtn { background: #f9d71c; color: #1a1a2e; }
      </style>

      <form id="frm" novalidate>
        <div class="field">
          <label for="inputUser">user :</label>
          <input id="inputUser" type="text" placeholder="Nombre de usuario" required autocomplete="off" />
        </div>
        <div class="field">
          <label for="inputEmail">email :</label>
          <input id="inputEmail" type="email" placeholder="correo@ejemplo.com" required autocomplete="off" />
        </div>
        <div class="field">
          <label for="inputPhone">phone :</label>
          <input id="inputPhone" type="tel" placeholder="+34 600 000 000" autocomplete="off" />
        </div>
        <div class="actions">
          <button type="submit" id="saveBtn">save</button>
          <button type="button" id="resetBtn">reset</button>
        </div>
      </form>
    `;
  }

  _bindEvents() {
    const frm = this.shadowRoot.getElementById("frm");
    const resetBtn = this.shadowRoot.getElementById("resetBtn");

    frm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = this.shadowRoot.getElementById("inputUser").value.trim();
      const email = this.shadowRoot.getElementById("inputEmail").value.trim();
      const phone = this.shadowRoot.getElementById("inputPhone").value.trim();

      if (!user || !email) {
        this.dispatchEvent(
          new CustomEvent("form-error", {
            bubbles: true,
            composed: true,
            detail: { message: "user y email son obligatorios" },
          }),
        );
        return;
      }

      this.dispatchEvent(
        new CustomEvent("form-save", {
          bubbles: true,
          composed: true,
          detail: { id: this._editingId, user, email, phone },
        }),
      );
    });

    resetBtn.addEventListener("click", () => {
      this.reset();
      this.dispatchEvent(
        new CustomEvent("form-reset", { bubbles: true, composed: true }),
      );
    });
  }
}

customElements.define("user-form", UserForm);
