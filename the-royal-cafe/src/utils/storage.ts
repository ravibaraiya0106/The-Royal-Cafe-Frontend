// src/utils/storage.ts

/* ================= SET AUTH ================= */
export const setAuth = (token: string, user: unknown) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

/* ================= GET USER ================= */
export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/* ================= GET TOKEN ================= */
export const getToken = () => {
  return localStorage.getItem("token");
};

/* ================= CLEAR AUTH (IMPORTANT) ================= */
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/* ================= LOGOUT ================= */
export const logout = () => {
  clearAuth();

  // trigger UI update
  window.dispatchEvent(new Event("authChanged"));
};
