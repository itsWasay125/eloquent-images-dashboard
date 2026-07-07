import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { fetchContacts, getAuthSession } from "../api/eloquentApi";
import MasterLayout from "../otherImages/MasterLayout";

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const EloquentContactFormPage = () => {
  const [contacts, setContacts] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const token = getAuthSession()?.token;

  const loadContacts = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError("");

    try {
      const response = await fetchContacts(token, page);
      setContacts(response.contacts);
      setMeta(response.meta);
    } catch (err) {
      setError(err.message || "Unable to load contact submissions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, token]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const filteredContacts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return contacts;

    return contacts.filter((contact) =>
      [
        contact.firstName,
        contact.lastName,
        contact.email,
        contact.phoneNumber,
        contact.message,
      ].some((value) => String(value || "").toLowerCase().includes(term))
    );
  }, [contacts, search]);

  const latestContact = contacts[0];

  return (
    <MasterLayout>
      <div className="eloquent-contact-heading">
        <div className="eloquent-page-head">
          <span>Eloquent Images</span>
          <h2>Contact Submissions</h2>
          <p>Review messages submitted through the website contact form.</p>
        </div>
        <button
          className="eloquent-btn eloquent-refresh-btn"
          disabled={loading || refreshing}
          onClick={() => loadContacts(true)}
          type="button"
        >
          <Icon icon="solar:refresh-linear" width="19" />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="eloquent-contact-stats">
        <div className="eloquent-contact-stat">
          <span className="eloquent-contact-stat-icon">
            <Icon icon="solar:inbox-line-linear" width="24" />
          </span>
          <div>
            <small>Total Inquiries</small>
            <strong>{meta.totalItems ?? contacts.length}</strong>
          </div>
        </div>
        <div className="eloquent-contact-stat">
          <span className="eloquent-contact-stat-icon">
            <Icon icon="solar:letter-linear" width="24" />
          </span>
          <div>
            <small>Showing Now</small>
            <strong>{contacts.length}</strong>
          </div>
        </div>
        <div className="eloquent-contact-stat">
          <span className="eloquent-contact-stat-icon">
            <Icon icon="solar:clock-circle-linear" width="24" />
          </span>
          <div>
            <small>Latest Message</small>
            <strong className="eloquent-contact-stat-date">
              {latestContact ? formatDate(latestContact.createdAt) : "No messages"}
            </strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="eloquent-alert error mt-4">
          {error}
          <button onClick={() => loadContacts()} type="button">
            Try again
          </button>
        </div>
      )}

      <section className="eloquent-panel eloquent-contact-panel mt-4">
        <div className="eloquent-contact-toolbar">
          <div>
            <h3>Website Inquiries</h3>
            <p>
              {filteredContacts.length} of {meta.totalItems ?? contacts.length} messages
            </p>
          </div>
          <label className="eloquent-contact-search">
            <Icon icon="solar:magnifer-linear" width="20" />
            <input
              aria-label="Search contact submissions"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email or message"
              type="search"
              value={search}
            />
          </label>
        </div>

        {loading ? (
          <div className="eloquent-contact-state">
            <Icon className="eloquent-contact-spinner" icon="solar:refresh-linear" width="30" />
            <strong>Loading contact submissions...</strong>
            <span>Fetching the latest messages from the website.</span>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="eloquent-contact-state">
            <Icon icon="solar:letter-opened-linear" width="34" />
            <strong>{search ? "No matching messages" : "No contact submissions yet"}</strong>
            <span>
              {search
                ? "Try another name, email address, phone number or keyword."
                : "New website inquiries will appear here."}
            </span>
          </div>
        ) : (
          <div className="eloquent-contact-table-wrap">
            <table className="eloquent-contact-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>
                      <div className="eloquent-contact-person">
                        <span className="eloquent-contact-avatar">
                          {contact.firstName?.[0] || ""}
                          {contact.lastName?.[0] || ""}
                        </span>
                        <div>
                          <strong>
                            {[contact.firstName, contact.lastName]
                              .filter(Boolean)
                              .join(" ") || "Unknown contact"}
                          </strong>
                          <a href={`mailto:${contact.email}`}>{contact.email || "No email"}</a>
                        </div>
                      </div>
                    </td>
                    <td>
                      {contact.phoneNumber ? (
                        <a className="eloquent-contact-phone" href={`tel:${contact.phoneNumber}`}>
                          <Icon icon="solar:phone-linear" width="17" />
                          {contact.phoneNumber}
                        </a>
                      ) : (
                        <span className="eloquent-contact-muted">Not provided</span>
                      )}
                    </td>
                    <td>
                      <p className="eloquent-contact-message">{contact.message || "No message"}</p>
                    </td>
                    <td>
                      <span className="eloquent-contact-date">
                        <Icon icon="solar:calendar-linear" width="16" />
                        {formatDate(contact.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && contacts.length > 0 && (
          <div className="eloquent-contact-pagination">
            <span>
              Page {meta.currentPage ?? page} of {meta.totalPages ?? 1}
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
                disabled={page >= (meta.totalPages ?? 1)}
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

export default EloquentContactFormPage;
