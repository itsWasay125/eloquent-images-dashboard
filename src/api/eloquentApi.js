const API_BASE = "https://eloquent.koderspedia.online";
const AUTH_KEY = "eloquent_dashboard_auth";
const EXPIRED_FLAG_KEY = "eloquent_session_expired";
const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour

function forceSignOut() {
  clearAuthSession();
  localStorage.setItem(EXPIRED_FLAG_KEY, "1");
  // Send the user back to the sign-in page (avoid a redirect loop if already there).
  if (window.location.pathname !== "/") {
    window.location.replace("/");
  }
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  // An expired/invalid token returns 401 — only force a sign-out if we actually
  // had a session (so a wrong-password 401 on the login page is left alone).
  if (response.status === 401 && getAuthToken()) {
    forceSignOut();
    throw new Error(data.message || "Your session has expired. Please sign in again.");
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
}

function normalizeToken(value) {
  if (typeof value !== "string") return "";

  const token = value.trim().replace(/^Bearer\s+/i, "").trim();
  return ["", "undefined", "null"].includes(token.toLowerCase()) ? "" : token;
}

// Read a JWT's `exp` claim and tell whether it has already expired.
function isJwtExpired(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === "number" && Date.now() >= payload.exp * 1000;
  } catch {
    return false; // Can't decode — don't treat as expired on this basis.
  }
}

function authHeaders(token) {
  const authToken =
    normalizeToken(localStorage.getItem("token")) ||
    normalizeToken(token) ||
    normalizeToken(getAuthSession()?.token);

  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

function getImageTitleFromFile(file) {
  return file.name.replace(/\.[^/.]+$/, "");
}

function getImageDisplayName(image = {}) {
  return (
    image.originalName ||
    image.fileName ||
    image.filename ||
    image.title ||
    ""
  ).replace(/\.[^/.]+$/, "");
}

function getIdValue(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function collectUploadedImageIds(payload, fileTitle, ids = new Set()) {
  if (!payload || typeof payload !== "object") return ids;

  if (Array.isArray(payload)) {
    payload.forEach((item) => collectUploadedImageIds(item, fileTitle, ids));
    return ids;
  }

  const id = getIdValue(payload.id || payload.imageId || payload.image_id);
  const looksLikeImage =
    payload.imageUrl ||
    payload.url ||
    payload.path ||
    payload.originalName ||
    payload.fileName ||
    payload.filename ||
    payload.title === fileTitle ||
    getImageDisplayName(payload) === fileTitle;

  if (id && looksLikeImage) {
    ids.add(id);
  }

  Object.values(payload).forEach((value) => {
    if (value && typeof value === "object") {
      collectUploadedImageIds(value, fileTitle, ids);
    }
  });

  return ids;
}

async function clearWhatsNewForImages(imageIds, token) {
  const ids = Array.isArray(imageIds) ? imageIds : Array.from(imageIds || []);
  const uniqueIds = [...new Set(ids.map(getIdValue).filter(Boolean))];
  if (!uniqueIds.length) return;

  await Promise.all(
    uniqueIds.map((id) => updateGalleryImageIsNew(id, false, token).catch(() => null))
  );
}

async function clearUploadedFilesFromWhatsNew(files, token) {
  const uploadedTitles = new Set(files.map(getImageTitleFromFile));
  if (!uploadedTitles.size) return;

  const whatsNewImages = await fetchWhatsNewGalleryImages().catch(() => []);
  const imageIds = whatsNewImages
    .filter((image) => uploadedTitles.has(getImageDisplayName(image)))
    .map((image) => image.id);

  await clearWhatsNewForImages(imageIds, token);
}

export function getAuthSession() {
  try {
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return null;

    const parsedSession = JSON.parse(session);

    if (parsedSession?.expiresAt && Date.now() > parsedSession.expiresAt) {
      localStorage.setItem(EXPIRED_FLAG_KEY, "1");
      clearAuthSession();
      return null;
    }

    const token =
      normalizeToken(localStorage.getItem("token")) ||
      normalizeToken(parsedSession?.token);

    // Treat an expired JWT as no session so protected routes send the user to login.
    if (token && isJwtExpired(token)) {
      localStorage.setItem(EXPIRED_FLAG_KEY, "1");
      clearAuthSession();
      return null;
    }

    return { ...parsedSession, token };
  } catch {
    return null;
  }
}

export function consumeSessionExpiredFlag() {
  const expired = localStorage.getItem(EXPIRED_FLAG_KEY) === "1";
  if (expired) localStorage.removeItem(EXPIRED_FLAG_KEY);
  return expired;
}

export function getAuthToken() {
  return (
    normalizeToken(localStorage.getItem("token")) ||
    normalizeToken(getAuthSession()?.token)
  );
}

export function saveAuthSession(session) {
  const normalizedSession = {
    ...session,
    token: normalizeToken(session.token),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  localStorage.removeItem(EXPIRED_FLAG_KEY);
  localStorage.setItem(AUTH_KEY, JSON.stringify(normalizedSession));
  localStorage.setItem("token", normalizedSession.token);
  localStorage.setItem("role", normalizedSession.user?.role?.toLowerCase() || "admin");
  localStorage.setItem("user", JSON.stringify(normalizedSession.user || {}));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const data = await parseResponse(response);
  const payload = data.data && typeof data.data === "object" ? data.data : data;
  const token = normalizeToken(
    payload.token || payload.accessToken || payload.access_token || data.token
  );
  if (!token) {
    throw new Error("Login succeeded but no authentication token was returned.");
  }

  const session = { token, user: payload.user || data.user };
  saveAuthSession(session);
  return session;
}

// ── Blogs ────────────────────────────────────────────────

export async function fetchBlogs() {
  const response = await fetch(`${API_BASE}/api/Blogs`);
  const data = await parseResponse(response);
  return Array.isArray(data.data) ? data.data : [];
}

export async function createBlog(blog, token) {
  const formData = new FormData();
  formData.append("title", blog.title);
  formData.append("content", blog.content);
  formData.append("status", blog.status);
  formData.append("categoryId", blog.categoryId);
  if (blog.featuredImage) formData.append("featuredImage", blog.featuredImage);

  const response = await fetch(`${API_BASE}/api/blogs`, {
    method: "POST",
    headers: { Accept: "application/json", ...authHeaders(token) },
    body: formData,
  });
  return parseResponse(response);
}

export async function updateBlog(blog, token) {
  const formData = new FormData();
  formData.append("title", blog.title);
  formData.append("content", blog.content);
  formData.append("status", blog.status);
  if (blog.categoryId !== null && blog.categoryId !== undefined && blog.categoryId !== "") {
    formData.append("categoryId", String(blog.categoryId));
  }
  if (blog.featuredImage) formData.append("featuredImage", blog.featuredImage);

  const response = await fetch(`${API_BASE}/api/blogs/${blog.id}`, {
    method: "PUT",
    headers: { Accept: "application/json", ...authHeaders(token) },
    body: formData,
  });
  return parseResponse(response);
}

export async function deleteBlog(id, token) {
  const blogId = Number(id);
  if (!Number.isInteger(blogId) || blogId <= 0) {
    throw new Error("Invalid blog ID");
  }

  const response = await fetch(`${API_BASE}/api/blogs/${blogId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...authHeaders(token),
    },
  });
  return parseResponse(response);
}

// ── Categories ───────────────────────────────────────────

export async function fetchCategories() {
  const response = await fetch(`${API_BASE}/api/Categories`);
  const data = await parseResponse(response);
  return Array.isArray(data.categories) ? data.categories : [];
}

export async function createCategory(category, token) {
  const response = await fetch(`${API_BASE}/api/categories`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(category),
  });
  return parseResponse(response);
}

export async function updateCategory({ id, name }, token) {
  const response = await fetch(`${API_BASE}/api/categories`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify({ id: String(id), name }),
  });
  return parseResponse(response);
}

export async function deleteCategory(id, token) {
  const response = await fetch(`${API_BASE}/api/categories`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify({ id: Number(id) }),
  });
  return parseResponse(response);
}

// ── Gallery Images ────────────────────────────────────────

export async function fetchGalleryImages({ categoryId, page = 1, limit = 15 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    _: String(Date.now()),
  });
  if (categoryId) params.set("categoryId", categoryId);
  const response = await fetch(`${API_BASE}/api/images?${params.toString()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const data = await parseResponse(response);
  return {
    images: Array.isArray(data.data) ? data.data : [],
    meta: data.meta || {},
  };
}

export async function fetchWhatsNewGalleryImages({ limit = 1000 } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    is_new: "true",
    _: String(Date.now()),
  });
  const response = await fetch(`${API_BASE}/api/images?${params.toString()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const data = await parseResponse(response);
  return Array.isArray(data.data) ? data.data : [];
}

export async function uploadImage({ categoryIds, file }, token) {
  const formData = new FormData();
  const fileTitle = getImageTitleFromFile(file);
  formData.append("image", file);
  formData.append("title", fileTitle);
  formData.append("is_new", "false");
  formData.append("isNew", "false");
  formData.append("isNewImage", "false");
  formData.append("is_new_image", "false");
  formData.append("show_in_whats_new", "false");
  formData.append("showInWhatsNew", "false");
  if (categoryIds?.length) {
    categoryIds.forEach((id) => formData.append("categoryIds[]", Number(id)));
  }
  const response = await fetch(`${API_BASE}/api/images`, {
    method: "POST",
    headers: { Accept: "application/json", ...authHeaders(token) },
    body: formData,
  });
  const result = await parseResponse(response);
  await clearWhatsNewForImages(collectUploadedImageIds(result, fileTitle), token);

  return result;
}

export async function uploadImages({ categoryIds, files, onProgress, concurrency = 3 }, token) {
  const results = new Array(files.length);
  let nextIndex = 0;
  let done = 0;

  async function worker() {
    while (nextIndex < files.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await uploadImage({ categoryIds, file: files[index] }, token);
      done += 1;
      onProgress?.(done, files.length);
    }
  }

  const workerCount = Math.max(1, Math.min(concurrency, files.length));
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  await clearUploadedFilesFromWhatsNew(files, token);

  return results;
}

export async function deleteImage(id, token) {
  const imageId = Number(id);
  if (!Number.isInteger(imageId) || imageId <= 0) {
    throw new Error("Invalid image ID");
  }

  const response = await fetch(`${API_BASE}/api/images`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify({ id: imageId }),
  });
  return parseResponse(response);
}

export async function updateGalleryImage(id, payload, token) {
  const imageId = Number(id);
  if (!Number.isInteger(imageId) || imageId <= 0) {
    throw new Error("Invalid image ID");
  }

  const response = await fetch(`${API_BASE}/api/images/${imageId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function updateGalleryImageTitle(id, title, token) {
  return updateGalleryImage(id, { title }, token);
}

export async function updateGalleryImageCategories(id, categoryIds, token) {
  const categoryId = (categoryIds || [])
    .map(Number)
    .filter((value) => Number.isInteger(value) && value > 0);
  return updateGalleryImage(id, { categoryId }, token);
}

export async function updateGalleryImageIsNew(id, is_new, token) {
  const imageId = Number(id);
  if (!Number.isInteger(imageId) || imageId <= 0) {
    throw new Error("Invalid image ID");
  }

  const response = await fetch(`${API_BASE}/api/images/${imageId}/is-new`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify({ is_new }),
  });
  return parseResponse(response);
}

// ── Blog Gallery Images ───────────────────────────────────

export async function addBlogImages(blogId, files, token) {
  const formData = new FormData();
  files.forEach((file) => formData.append("s3_images", file));
  const response = await fetch(`${API_BASE}/api/blogs/images/${blogId}`, {
    method: "POST",
    headers: { Accept: "application/json", ...authHeaders(token) },
    body: formData,
  });
  return parseResponse(response);
}

export async function deleteBlogImage(imageId, token) {
  const response = await fetch(`${API_BASE}/api/blogs/images/${imageId}`, {
    method: "DELETE",
    headers: { Accept: "application/json", ...authHeaders(token) },
  });
  return parseResponse(response);
}

// ── Users ─────────────────────────────────────────────────

export async function fetchAllUsers(token) {
  const response = await fetch(`${API_BASE}/api/get-all-users`, {
    headers: {
      Accept: "application/json",
      ...authHeaders(token),
    },
  });
  const data = await parseResponse(response);
  // The list may arrive under `data`, `users`, or as the root array.
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.users)) return data.users;
  return [];
}

export async function deleteUser(id, token) {
  const response = await fetch(`${API_BASE}/api/users-delete/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...authHeaders(token),
    },
  });
  return parseResponse(response);
}

// ── Printful Orders ───────────────────────────────────────

export async function fetchPrintfulOrders(token) {
  // Pull a large page so the dashboard can paginate client-side over all orders.
  const response = await fetch(`${API_BASE}/api/printful-orders?limit=100`, {
    headers: {
      Accept: "application/json",
      ...authHeaders(token),
    },
  });
  const data = await parseResponse(response);
  // Orders live under data.data.result; paging under data.data.paging.
  const result = data?.data?.result;
  return {
    orders: Array.isArray(result) ? result : [],
    paging: data?.data?.paging || {},
  };
}

// Contact submissions

export async function fetchContacts(token, page = 1) {
  const params = new URLSearchParams({ page: String(page) });
  const response = await fetch(`${API_BASE}/api/contact?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      ...authHeaders(token),
    },
  });
  const data = await parseResponse(response);

  return {
    contacts: Array.isArray(data.data) ? data.data : [],
    meta: data.meta || {},
  };
}
