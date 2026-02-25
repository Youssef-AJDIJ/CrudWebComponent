/**
 * app.js — Main application logic
 * Connects Web Components to the REST API
 */

const API = "http://localhost:3000/api/users";

// DOM references
const userList = document.getElementById("userList");
const userForm = document.getElementById("userForm");
const toast = document.getElementById("toast");

/* ── Toast ────────────────────────────────── */
function showToast(msg, type = "") {
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

/* ── API Calls ────────────────────────────── */
async function fetchUsers() {
  try {
    const res = await fetch(API);
    const users = await res.json();
    userList.setUsers(users);
  } catch {
    showToast("Error al cargar usuarios", "error");
  }
}

async function createUser(data) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al crear usuario");
  }
  return res.json();
}

async function updateUser(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al actualizar usuario");
  }
  return res.json();
}

async function deleteUser(id) {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al eliminar usuario");
  }
  return res.json();
}

/* ── Event Listeners ──────────────────────── */

// form-save → create or update
document.addEventListener("form-save", async (e) => {
  const { id, user, email, phone } = e.detail;
  try {
    if (id) {
      await updateUser(id, { user, email, phone });
      showToast("✅ Usuario actualizado", "success");
    } else {
      await createUser({ user, email, phone });
      showToast("✅ Usuario creado", "success");
    }
    userForm.reset();
    await fetchUsers();
  } catch (err) {
    showToast(`❌ ${err.message}`, "error");
  }
});

// form-error → show validation toast
document.addEventListener("form-error", (e) => {
  showToast(`⚠️ ${e.detail.message}`, "error");
});

// user-edit → populate form
document.addEventListener("user-edit", (e) => {
  userForm.setUser(e.detail);
  // Scroll form into view on mobile
  document
    .querySelector(".form-section")
    .scrollIntoView({ behavior: "smooth" });
});

// user-delete → delete with confirmation
document.addEventListener("user-delete", async (e) => {
  const { id } = e.detail;
  if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;
  try {
    await deleteUser(id);
    showToast("🗑️ Usuario eliminado", "success");
    await fetchUsers();
  } catch (err) {
    showToast(`❌ ${err.message}`, "error");
  }
});

// form-reset
document.addEventListener("form-reset", () => {
  userForm.reset();
});

/* ── Init ─────────────────────────────────── */
fetchUsers();
