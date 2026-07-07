import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createCategory, getAuthSession } from "../api/eloquentApi";
import MasterLayout from "../otherImages/MasterLayout";

const swalOptions = {
  background: "#101722",
  color: "#f5f8fa",
  confirmButtonColor: "#3b586e",
  customClass: { popup: "eloquent-swal-popup" },
};

const EloquentCategoryCreatePage = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = getAuthSession()?.token;

  const handleCreate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createCategory({ name: categoryName }, token);
      setCategoryName("");
      await Swal.fire({
        ...swalOptions,
        icon: "success",
        title: "Category created",
        text: "The new category is ready to use.",
      });
      navigate("/categories");
    } catch (err) {
      await Swal.fire({
        ...swalOptions,
        icon: "error",
        title: "Could not create category",
        text: err.message || "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MasterLayout>
      <div className="eloquent-blog-edit-header">
        <div className="eloquent-page-head" style={{ margin: 0 }}>
          <span>Eloquent Images / Categories</span>
          <h2>Create Category</h2>
          <p>Add a category for organizing gallery images and blog posts.</p>
        </div>
        <button
          className="eloquent-btn eloquent-btn-secondary"
          onClick={() => navigate("/categories")}
          style={{ flexShrink: 0 }}
          type="button"
        >
          <Icon icon="solar:alt-arrow-left-linear" width="16" />
          Back to Categories
        </button>
      </div>

      <form
        className="eloquent-panel eloquent-form eloquent-category-create"
        onSubmit={handleCreate}
        style={{ marginTop: "22px" }}
      >
        <div className="eloquent-panel-heading">
          <div>
            <span className="eloquent-section-icon">
              <Icon icon="solar:folder-with-files-linear" width="22" />
            </span>
            <div>
              <h3>Create Category</h3>
              <p>Add a simple category name for organizing content.</p>
            </div>
          </div>
        </div>
        <div className="eloquent-category-create-row">
          <div>
            <label>Category Name</label>
            <input
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="Landscape"
              required
              value={categoryName}
            />
          </div>
          <button className="eloquent-btn" disabled={submitting} type="submit">
            <Icon icon="solar:add-circle-linear" width="18" />
            {submitting ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </MasterLayout>
  );
};

export default EloquentCategoryCreatePage;
