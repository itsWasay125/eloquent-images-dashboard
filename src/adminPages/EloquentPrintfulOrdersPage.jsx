import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { fetchPrintfulOrders, getAuthSession } from "../api/eloquentApi";
import MasterLayout from "../otherImages/MasterLayout";

const PAGE_SIZE = 10;

const formatDate = (unixSeconds) => {
  if (!unixSeconds) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(unixSeconds * 1000));
};

const formatMoney = (amount, currency = "USD") => {
  const value = Number(amount);
  if (Number.isNaN(value)) return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
};

const EloquentPrintfulOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const token = getAuthSession()?.token;

  const loadOrders = useCallback(
    async (isRefresh = false) => {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError("");
      try {
        const { orders: list } = await fetchPrintfulOrders(token);
        setOrders(list);
      } catch (err) {
        setError(err.message || "Unable to load Printful orders.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((order) =>
      [order.recipient?.email, order.recipient?.name, order.status, String(order.id)].some(
        (value) => String(value || "").toLowerCase().includes(term)
      )
    );
  }, [orders, search]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const pagedOrders = useMemo(
    () => filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredOrders, page]
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
          <h2>Printful Orders</h2>
          <p>Orders placed by customers, with a link to open each on Printful.</p>
        </div>
        <button
          className="eloquent-btn eloquent-refresh-btn"
          disabled={loading || refreshing}
          onClick={() => loadOrders(true)}
          type="button"
        >
          <Icon icon="solar:refresh-linear" width="19" />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="eloquent-contact-stats">
        <div className="eloquent-contact-stat">
          <span className="eloquent-contact-stat-icon">
            <Icon icon="solar:bag-check-linear" width="24" />
          </span>
          <div>
            <small>Total Orders</small>
            <strong>{orders.length}</strong>
          </div>
        </div>
        <div className="eloquent-contact-stat">
          <span className="eloquent-contact-stat-icon">
            <Icon icon="solar:clock-circle-linear" width="24" />
          </span>
          <div>
            <small>Latest Order</small>
            <strong className="eloquent-contact-stat-date">
              {orders[0] ? formatDate(orders[0].created) : "No orders"}
            </strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="eloquent-alert error mt-4">
          {error}
          <button onClick={() => loadOrders()} type="button">
            Try again
          </button>
        </div>
      )}

      <section className="eloquent-panel eloquent-contact-panel eloquent-printful-orders-panel mt-4">
        <div className="eloquent-contact-toolbar">
          <div>
            <h3>Customer Orders</h3>
            <p>
              {filteredOrders.length} of {orders.length} orders
            </p>
          </div>
          <label className="eloquent-contact-search">
            <Icon icon="solar:magnifer-linear" width="20" />
            <input
              aria-label="Search orders"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search email, name, status or order ID"
              type="search"
              value={search}
            />
          </label>
        </div>

        {loading ? (
          <div className="eloquent-contact-state">
            <Icon className="eloquent-contact-spinner" icon="solar:refresh-linear" width="30" />
            <strong>Loading orders...</strong>
            <span>Fetching the latest orders from Printful.</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="eloquent-contact-state">
            <Icon icon="solar:bag-cross-linear" width="34" />
            <strong>{search ? "No matching orders" : "No orders yet"}</strong>
            <span>
              {search
                ? "Try another email, name, status or order ID."
                : "Customer orders will appear here."}
            </span>
          </div>
        ) : (
          <div className="eloquent-contact-table-wrap eloquent-printful-orders-wrap">
            <table className="eloquent-contact-table eloquent-printful-orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Placed</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((order) => {
                  const recipient = order.recipient || {};
                  const firstItem = order.items?.[0];
                  const extraItems = (order.items?.length || 0) - 1;
                  return (
                    <tr key={order.id}>
                      <td>
                        <div className="eloquent-contact-person">
                          <span className="eloquent-contact-avatar">
                            {(recipient.name || recipient.email || "U").slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <strong>{recipient.name || "Unknown"}</strong>
                            <a href={`mailto:${recipient.email}`}>
                              {recipient.email || "No email"}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td>
                        {firstItem ? (
                          <div className="eloquent-order-item">
                            {firstItem.product?.image && (
                              <img src={firstItem.product.image} alt={firstItem.name} />
                            )}
                            <div>
                              <strong>{firstItem.name}</strong>
                              <span className="eloquent-contact-muted">
                                Qty {firstItem.quantity}
                                {extraItems > 0 ? ` · +${extraItems} more` : ""}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="eloquent-contact-muted">No items</span>
                        )}
                      </td>
                      <td>
                        <span className="eloquent-user-role">{order.status || "—"}</span>
                      </td>
                      <td>
                        <strong className="eloquent-order-total">
                          {formatMoney(order.costs?.total, order.costs?.currency)}
                        </strong>
                      </td>
                      <td>
                        <span className="eloquent-contact-date">
                          <Icon icon="solar:calendar-linear" width="16" />
                          {formatDate(order.created)}
                        </span>
                      </td>
                      <td>
                        {order.dashboard_url ? (
                          <a
                            className="eloquent-order-link"
                            href={order.dashboard_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Icon icon="solar:square-top-down-linear" width="16" />
                            View on Printful
                          </a>
                        ) : (
                          <span className="eloquent-contact-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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

export default EloquentPrintfulOrdersPage;
