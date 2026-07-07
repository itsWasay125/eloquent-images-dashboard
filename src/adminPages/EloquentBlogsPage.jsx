import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from "sweetalert2";
import MasterLayout from "../otherImages/MasterLayout";
import EloquentImage from "../components/EloquentImage";
import { deleteBlog, fetchBlogs, getAuthToken } from "../api/eloquentApi";

const swalOptions = {
  background: "#1e1e1e",
  color: "#f5f8fa",
  confirmButtonColor: "#3b586e",
  customClass: { popup: "eloquent-swal-popup" },
};

function stripHtml(html = "") {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const EloquentBlogsPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingBlogId, setDeletingBlogId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      setBlogs(await fetchBlogs());
    } catch (err) {
      setError(err.message || "Unable to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (blog) => {
    const result = await Swal.fire({
      ...swalOptions,
      icon: "warning",
      title: "Delete blog?",
      text: `"${blog.title}" will be permanently deleted.`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });
    if (!result.isConfirmed) return;

    setDeletingBlogId(blog.id);
    try {
      await deleteBlog(blog.id, getAuthToken());
      await loadData();
      await Swal.fire({
        ...swalOptions,
        icon: "success",
        title: "Deleted",
        text: "The blog post has been removed.",
      });
    } catch (err) {
      await Swal.fire({
        ...swalOptions,
        icon: "error",
        title: "Delete failed",
        text: err.message || "Please try again.",
      });
    } finally {
      setDeletingBlogId(null);
    }
  };

  return (
    <MasterLayout>
      <div className="eloquent-contact-heading">
        <div className="eloquent-page-head" style={{ margin: 0 }}>
          <span>Eloquent Images</span>
          <h2>Blogs</h2>
          <p>Create and manage blog posts.</p>
        </div>
        <button
          className="eloquent-btn eloquent-refresh-btn"
          onClick={() => navigate("/blogs/create")}
          type="button"
        >
          <Icon icon="solar:add-circle-linear" width="18" />
          Create Blog
        </button>
      </div>

      {error && (
        <div className="eloquent-alert error" style={{ marginTop: "18px" }}>
          {error}
          <button onClick={loadData} type="button">
            Try again
          </button>
        </div>
      )}

      <section
        className="eloquent-panel eloquent-contact-panel"
        style={{ marginTop: "22px" }}
      >
        <div className="eloquent-contact-toolbar">
          <div>
            <h3>All Blog Posts</h3>
            <p>
              {loading
                ? "Loading..."
                : `${blogs.length} post${blogs.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            className="eloquent-btn eloquent-refresh-btn eloquent-btn-secondary"
            disabled={loading}
            onClick={loadData}
            type="button"
          >
            <Icon icon="solar:refresh-linear" width="17" />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="eloquent-contact-state">
            <Icon
              className="eloquent-contact-spinner"
              icon="solar:refresh-linear"
              width="30"
            />
            <strong>Loading blogs...</strong>
            <span>Fetching blog posts from the API.</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="eloquent-contact-state">
            <Icon icon="solar:document-text-linear" width="34" />
            <strong>No blog posts yet</strong>
            <span>Click "Create Blog" to publish your first post.</span>
          </div>
        ) : (
          <div className="eloquent-contact-table-wrap">
            <table className="eloquent-contact-table eloquent-blog-table">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <div className="eloquent-blog-table-post">
                        <div className="eloquent-blog-table-thumb">
                          <EloquentImage
                            alt={blog.title}
                            src={blog.featuredImage || blog.featured_image}
                          />
                        </div>
                        <div>
                          <strong className="eloquent-blog-table-title">
                            {blog.title}
                          </strong>
                          <span className="eloquent-blog-table-preview">
                            {stripHtml(blog.content).slice(0, 100)}
                            {stripHtml(blog.content).length > 100 ? "..." : ""}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="eloquent-contact-muted">
                        {blog.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`eloquent-blog-status ${(
                          blog.status || "active"
                        ).toLowerCase()}`}
                      >
                        {blog.status || "ACTIVE"}
                      </span>
                    </td>
                    <td>
                      <div className="eloquent-blog-table-actions">
                        <button
                          className="eloquent-btn"
                          onClick={() =>
                            navigate(`/blogs/edit/${blog.id}`, {
                              state: { blog },
                            })
                          }
                          type="button"
                        >
                          <Icon icon="solar:pen-linear" width="14" />
                          Edit
                        </button>
                        <button
                          className="eloquent-btn eloquent-btn-danger"
                          disabled={deletingBlogId === blog.id}
                          onClick={() => handleDelete(blog)}
                          type="button"
                        >
                          <Icon
                            className={deletingBlogId === blog.id ? "eloquent-contact-spinner" : ""}
                            icon="solar:trash-bin-minimalistic-linear"
                            width="14"
                          />
                          {deletingBlogId === blog.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </MasterLayout>
  );
};

export default EloquentBlogsPage;
