import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deleteCategory,
  fetchCategories,
  getAuthSession,
  updateCategory,
} from "../api/eloquentApi";
import MasterLayout from "../otherImages/MasterLayout";

const swalOptions = {
  background: "#101722",
  color: "#f5f8fa",
  confirmButtonColor: "#3b586e",
  customClass: { popup: "eloquent-swal-popup" },
};

const EloquentCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [loadError, setLoadError] = useState("");

  const token = getAuthSession()?.token;

  const loadCategories = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setLoadError(err.message || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;
    setActionId(id);
    try {
      await updateCategory({ id, name: editingName.trim() }, token);
      setEditingId(null);
      setEditingName("");
      await loadCategories();
      await Swal.fire({
        ...swalOptions,
        icon: "success",
        title: "Category updated",
        text: "Your changes have been saved.",
      });
    } catch (err) {
      await Swal.fire({
        ...swalOptions,
        icon: "error",
        title: "Could not update category",
        text: err.message || "Please try again.",
      });
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (category) => {
    const confirmation = await Swal.fire({
      ...swalOptions,
      cancelButtonColor: "#273441",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#b84f57",
      confirmButtonText: "Delete",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      text: `"${category.name}" will be permanently removed.`,
      title: "Delete category?",
    });

    if (!confirmation.isConfirmed) return;

    setActionId(category.id);
    try {
      await deleteCategory(category.id, token);
      await loadCategories();
      await Swal.fire({
        ...swalOptions,
        icon: "success",
        title: "Category deleted",
        text: "The category has been removed.",
      });
    } catch (err) {
      await Swal.fire({
        ...swalOptions,
        icon: "error",
        title: "Could not delete category",
        text: err.message || "Please try again.",
      });
    } finally {
      setActionId(null);
    }
  };

  return (
    <MasterLayout>
      <div className="eloquent-contact-heading">
        <div className="eloquent-page-head" style={{ margin: 0 }}>
          <span>Eloquent Images</span>
          <h2>Categories</h2>
          <p>Create and manage gallery and blog categories.</p>
        </div>
        <button
          className="eloquent-btn eloquent-refresh-btn"
          onClick={() => navigate("/categories/create")}
          type="button"
        >
          <Icon icon="solar:add-circle-linear" width="18" />
          Create Category
        </button>
      </div>

      {loadError && <div className="eloquent-alert error mt-4">{loadError}</div>}

      <section className="eloquent-panel mt-4">
        <div className="eloquent-panel-heading">
          <div>
            <span className="eloquent-section-icon">
              <Icon icon="solar:folder-open-linear" width="22" />
            </span>
            <div>
              <h3>Existing Categories</h3>
              <p>{loading ? "Loading categories..." : `${categories.length} categories available`}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="eloquent-gallery-state">
            <Icon className="eloquent-contact-spinner" icon="solar:refresh-linear" width="28" />
            <strong>Loading categories...</strong>
          </div>
        ) : (
          <div className="eloquent-category-list eloquent-category-list-clean">
            {categories.map((category) => {
              const isEditing = editingId === category.id;
              const isWorking = actionId === category.id;

              return (
                <article
                  className={`eloquent-category-item ${isEditing ? "is-editing" : ""}`}
                  key={category.id}
                >
                  {isEditing ? (
                    <>
                      <input
                        autoFocus
                        aria-label={`Edit ${category.name}`}
                        onChange={(event) => setEditingName(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") handleUpdate(category.id);
                          if (event.key === "Escape") cancelEdit();
                        }}
                        value={editingName}
                      />
                      <div className="eloquent-category-actions">
                        <button
                          className="eloquent-btn"
                          disabled={isWorking}
                          onClick={() => handleUpdate(category.id)}
                          type="button"
                        >
                          <Icon icon="solar:diskette-linear" width="16" />
                          {isWorking ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="eloquent-btn eloquent-btn-secondary"
                          disabled={isWorking}
                          onClick={cancelEdit}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <strong>{category.name}</strong>
                      <div className="eloquent-category-actions">
                        <button
                          className="eloquent-btn"
                          onClick={() => startEdit(category)}
                          type="button"
                        >
                          <Icon icon="solar:pen-new-square-linear" width="16" />
                          Edit
                        </button>
                        <button
                          className="eloquent-btn eloquent-btn-danger"
                          disabled={isWorking}
                          onClick={() => handleDelete(category)}
                          type="button"
                        >
                          <Icon icon="solar:trash-bin-trash-linear" width="16" />
                          {isWorking ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
            {categories.length === 0 && <p>No categories available.</p>}
          </div>
        )}
      </section>
    </MasterLayout>
  );
};

export default EloquentCategoriesPage;
