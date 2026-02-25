/**
 * <user-card> Web Component
 * Attributes: data-id, data-user, data-email, data-phone, data-created, data-updated
 * Events: user-delete, user-edit
 */
class UserCard extends HTMLElement {
  static get observedAttributes() {
    return [
      "data-id",
      "data-user",
      "data-email",
      "data-phone",
      "data-created",
      "data-updated",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  render() {
    const id = this.getAttribute("data-id") || "";
    const user = this.getAttribute("data-user") || "";
    const email = this.getAttribute("data-email") || "";
    const phone = this.getAttribute("data-phone") || "";
    const created = this.getAttribute("data-created") || "";
    const updated = this.getAttribute("data-updated") || "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: #cfd8dc;
          border-radius: 6px;
          padding: 16px 18px 14px;
          margin-bottom: 10px;
          border-left: 5px solid #1565c0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          position: relative;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          animation: fadeIn 0.3s ease;
        }
        :host(:hover) {
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .actions {
          position: absolute;
          top: 10px;
          right: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.15s;
          line-height: 1;
        }
        .btn-icon:hover { background: rgba(0,0,0,0.1); }
        .btn-delete svg { fill: #e53935; width: 20px; height: 20px; }
        .btn-edit   svg { fill: #e53935; width: 18px; height: 18px; }

        .info { padding-right: 36px; }
        .info p {
          font-size: 0.88rem;
          margin-bottom: 5px;
          color: #1a1a2e;
          line-height: 1.4;
        }
        .info p strong {
          font-weight: 500;
          color: #0d47a1;
        }
      </style>

      <div class="actions">
        <button class="btn-icon btn-delete" id="btnDelete" title="Eliminar">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3h6l1 1h4v2H4V4h4l1-1zm-4 4h14l-1.5 13.5A1.5 1.5 0 0 1 16 22H8a1.5 1.5 0 0 1-1.5-1.5L5 7zm4 2v9h2V9H9zm4 0v9h2V9h-2z"/>
          </svg>
        </button>
        <button class="btn-icon btn-edit" id="btnEdit" title="Editar">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm18.71-11.96a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
      </div>

      <div class="info">
        <p><strong>user:</strong> ${this._esc(user)}</p>
        <p><strong>email:</strong> ${this._esc(email)}</p>
        <p><strong>phone:</strong> ${this._esc(phone)}</p>
        <p><strong>created At:</strong> ${this.formatDate(created)}</p>
        <p><strong>update At:</strong> ${this.formatDate(updated)}</p>
      </div>
    `;

    this.shadowRoot
      .getElementById("btnDelete")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("user-delete", {
            bubbles: true,
            composed: true,
            detail: { id },
          }),
        );
      });

    this.shadowRoot.getElementById("btnEdit").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("user-edit", {
          bubbles: true,
          composed: true,
          detail: { id, user, email, phone },
        }),
      );
    });
  }

  _esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}

customElements.define("user-card", UserCard);
