import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from "sweetalert2";
import { deleteUser, fetchAllUsers, getAuthSession } from "../api/eloquentApi";
import MasterLayout from "../otherImages/MasterLayout";

const PAGE_SIZE = 10;

const swalOptions = {
  background: "#101722",
  color: "#f5f8fa",
  confirmButtonColor: "#3b586e",
  customClass: { popup: "eloquent-swal-popup" },
};

const initialsOf = (name = "", email = "") => {
  const source = (name || email || "U").trim();
  const parts = source.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
};

const EloquentUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);
  const token = getAuthSession()?.token;

  const loadUsers = useCallback(
    async (isRefresh = false) => {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError("");
      try {
        const data = await fetchAllUsers(token);
        setUsers(data);
      } catch (err) {
        setError(err.message || "Unable to load users.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (user) => {
    const label = user.name || user.email || `user #${user.id}`;
    const confirmation = await Swal.fire({
      ...swalOptions,
      cancelButtonColor: "#273441",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#b84f57",
      confirmButtonText: "Delete",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      text: `${label} will be permanently removed.`,
      title: "Delete user?",
    });

    if (!confirmation.isConfirmed) return;

    setDeletingId(user.id);
    setError("");
    try {
      await deleteUser(user.id, token);
      setUsers((current) => current.filter((u) => u.id !== user.id));
      await Swal.fire({
        ...swalOptions,
        icon: "success",
        title: "User deleted",
        text: `${label} has been removed.`,
      });
    } catch (err) {
      await Swal.fire({
        ...swalOptions,
        icon: "error",
        title: "Could not delete user",
        text: err.message || "Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) =>
      [user.name, user.email, user.role].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [users, search]);

  const adminCount = useMemo(
    () => users.filter((u) => String(u.role || "").toLowerCase() === "admin").length,
    [users]
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const pagedUsers = useMemo(
    () => filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredUsers, page]
  );

  // Reset to the first page whenever the search narrows the list.
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <MasterLayout>
      <div className="eloquent-contact-heading">
        <div className="eloquent-page-head">
          <span>Eloquent Images</span>
          <h2>All Users</h2>
          <p>Everyone who has registered an account on the website.</p>
        </div>
        <button
          className="eloquent-btn eloquent-refresh-btn"
          disabled={loading || refreshing}
          onClick={() => loadUsers(true)}
          type="button"
        >
          <Icon icon="solar:refresh-linear" width="19" />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="eloquent-contact-stats">
        <div className="eloquent-contact-stat">
          <span className="eloquent-contact-stat-icon">
            <Icon icon="solar:users-group-rounded-linear" width="24" />
          </span>
          <div>
            <small>Total Users</small>
            <strong>{users.length}</strong>
          </div>
        </div>
        <div className="eloquent-contact-stat">
          <span className="eloquent-contact-stat-icon">
            <Icon icon="solar:shield-user-linear" width="24" />
          </span>
          <div>
            <small>Admins</small>
            <strong>{adminCount}</strong>
          </div>
        </div>
        <div className="eloquent-contact-stat">
          <span className="eloquent-contact-stat-icon">
            <Icon icon="solar:user-linear" width="24" />
          </span>
          <div>
            <small>Customers</small>
            <strong>{users.length - adminCount}</strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="eloquent-alert error mt-4">
          {error}
          <button onClick={() => loadUsers()} type="button">
            Try again
          </button>
        </div>
      )}

      <section className="eloquent-panel eloquent-contact-panel mt-4">
        <div className="eloquent-contact-toolbar">
          <div>
            <h3>Registered Users</h3>
            <p>
              {filteredUsers.length} of {users.length} users
            </p>
          </div>
          <label className="eloquent-contact-search">
            <Icon icon="solar:magnifer-linear" width="20" />
            <input
              aria-label="Search users"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email or role"
              type="search"
              value={search}
            />
          </label>
        </div>

        {loading ? (
          <div className="eloquent-contact-state">
            <Icon className="eloquent-contact-spinner" icon="solar:refresh-linear" width="30" />
            <strong>Loading users...</strong>
            <span>Fetching the registered accounts.</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="eloquent-contact-state">
            <Icon icon="solar:users-group-rounded-linear" width="34" />
            <strong>{search ? "No matching users" : "No users yet"}</strong>
            <span>
              {search
                ? "Try another name, email address or role."
                : "Registered accounts will appear here."}
            </span>
          </div>
        ) : (
          <div className="eloquent-contact-table-wrap">
            <table className="eloquent-contact-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>User ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedUsers.map((user) => (
                  <tr key={user.id || user.email}>
                    <td>
                      <div className="eloquent-contact-person">
                        <span className="eloquent-contact-avatar">
                          {initialsOf(user.name, user.email)}
                        </span>
                        <div>
                          <strong>{user.name || "Unnamed user"}</strong>
                          <a href={`mailto:${user.email}`}>{user.email || "No email"}</a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`eloquent-user-role ${
                          String(user.role || "").toLowerCase() === "admin" ? "is-admin" : ""
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    <td>
                      <span className="eloquent-contact-muted">#{user.id}</span>
                    </td>
                    <td>
                      {String(user.role || "").toLowerCase() === "admin" ? (
                        <span className="eloquent-contact-muted">—</span>
                      ) : (
                        <div className="eloquent-user-actions">
                          <button
                            className="eloquent-user-action delete"
                            type="button"
                            title="Delete user"
                            disabled={deletingId === user.id}
                            onClick={() => handleDelete(user)}
                          >
                            <Icon
                              icon={
                                deletingId === user.id
                                  ? "solar:refresh-linear"
                                  : "solar:trash-bin-trash-linear"
                              }
                              width="18"
                            />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="eloquent-contact-pagination">
            <span>
              Page {page} of {totalPages}
            </span>
            <div>
              <button
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                type="button"
              >
                <Icon icon="solar:alt-arrow-left-linear" width="17" />
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                type="button"
              >
                Next
                <Icon icon="solar:alt-arrow-right-linear" width="17" />
              </button>
            </div>
          </div>
        )}
      </section>
    </MasterLayout>
  );
};

export default EloquentUsersPage;
