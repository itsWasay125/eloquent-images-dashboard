import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  fetchCategories,
  getAuthSession,
  uploadImages,
} from "../api/eloquentApi";
import MasterLayout from "../otherImages/MasterLayout";
import { addGalleryWatermark } from "../utils/watermarkImage";

const emptyUpload = {
  categoryIds: [],
  files: [],
};

const swalOptions = {
  background: "#101722",
  color: "#f5f8fa",
  confirmButtonColor: "#3b586e",
  customClass: { popup: "eloquent-swal-popup" },
};

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  const workerCount = Math.max(1, Math.min(limit, items.length));
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

const EloquentGalleryCreatePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [upload, setUpload] = useState(emptyUpload);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [uploadStep, setUploadStep] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const token = getAuthSession()?.token;

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories([...data].reverse()))
      .catch((err) => setError(err.message || "Unable to load categories."));
  }, []);

  const handleUploadChange = (event) => {
    const { files, name, value } = event.target;

    if (name === "files") {
      setUpload((current) => ({ ...current, files: Array.from(files) }));
      return;
    }

    setUpload((current) => ({ ...current, [name]: value }));
  };

  const toggleUploadCategory = (id) => {
    const categoryId = String(id);
    setUpload((current) => ({
      ...current,
      categoryIds: current.categoryIds.includes(categoryId)
        ? current.categoryIds.filter((item) => item !== categoryId)
        : [...current.categoryIds, categoryId],
    }));
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;

    if (!upload.files?.length) {
      await Swal.fire({
        ...swalOptions,
        icon: "info",
        title: "Select images",
        text: "Please select at least one image before uploading.",
      });
      return;
    }

    if (upload.categoryIds.length === 0) {
      await Swal.fire({
        ...swalOptions,
        icon: "info",
        title: "Select a category",
        text: "Choose at least one category before uploading.",
      });
      return;
    }

    const total = upload.files.length;
    setUploadProgress({ done: 0, total });
    setSubmitting(true);
    try {
      setUploadStep("Applying watermarks...");
      const watermarkedFiles = await mapWithConcurrency(upload.files, 3, addGalleryWatermark);
      setUploadProgress({ done: 0, total });
      setUploadStep("Uploading...");
      await uploadImages(
        {
          categoryIds: upload.categoryIds,
          files: watermarkedFiles,
          onProgress: (done, totalCount) => setUploadProgress({ done, total: totalCount }),
        },
        token
      );
      setUpload(emptyUpload);
      formElement.reset();
      await Swal.fire({
        ...swalOptions,
        icon: "success",
        title: `${total} image${total > 1 ? "s" : ""} uploaded`,
        text: "Your images are now available in the gallery.",
      });
      navigate("/gallery");
    } catch (err) {
      await Swal.fire({
        ...swalOptions,
        icon: "error",
        title: "Upload failed",
        text: err.message || "Please try again.",
      });
    } finally {
      setSubmitting(false);
      setUploadStep("");
      setUploadProgress({ done: 0, total: 0 });
    }
  };

  return (
    <MasterLayout>
      <div className="eloquent-blog-edit-header">
        <div className="eloquent-page-head" style={{ margin: 0 }}>
          <span>Eloquent Images / Gallery</span>
          <h2>Upload Image</h2>
          <p>Choose image files and assign categories before publishing.</p>
        </div>
        <button
          className="eloquent-btn eloquent-btn-secondary"
          onClick={() => navigate("/gallery")}
          style={{ flexShrink: 0 }}
          type="button"
        >
          <Icon icon="solar:alt-arrow-left-linear" width="16" />
          Back to Gallery
        </button>
      </div>

      {error && <div className="eloquent-alert error mt-4">{error}</div>}

      <form
        className="eloquent-panel eloquent-form eloquent-upload-panel"
        onSubmit={handleUpload}
        style={{ marginTop: "22px" }}
      >
        <div className="eloquent-panel-heading">
          <div>
            <span className="eloquent-section-icon">
              <Icon icon="solar:cloud-upload-linear" width="22" />
            </span>
            <div>
              <h3>Upload New Image</h3>
              <p>Choose files and assign categories. Each original filename is saved as its title.</p>
            </div>
          </div>
        </div>

        <div className="eloquent-upload-grid">
          <div className="eloquent-upload-fields">
            <div>
              <label>Choose Images</label>
              <label className="eloquent-file-picker">
                <input
                  accept="image/*"
                  multiple
                  name="files"
                  onChange={handleUploadChange}
                  required
                  type="file"
                />
                <span className="eloquent-file-picker-icon">
                  <Icon icon="solar:gallery-add-linear" width="24" />
                </span>
                <span>
                  <strong>
                    {upload.files?.length > 0
                      ? `${upload.files.length} image${upload.files.length > 1 ? "s" : ""} selected`
                      : "Select image files"}
                  </strong>
                  <small>JPG, PNG or WEBP - Multiple allowed</small>
                </span>
                <em>Browse</em>
              </label>
            </div>
            <button className="eloquent-btn" disabled={submitting} type="submit">
              <Icon icon="solar:check-circle-linear" width="18" />
              {submitting
                ? uploadProgress.total > 1
                  ? `${uploadStep || "Uploading..."} ${uploadProgress.done}/${uploadProgress.total}`
                  : uploadStep || "Uploading..."
                : "Submit"}
            </button>
          </div>

          <div className="eloquent-category-picker">
            <div className="eloquent-field-label">
              <span>Categories</span>
              <small>{upload.categoryIds.length} selected</small>
            </div>
            <div className="eloquent-category-options">
              {categories.map((category) => {
                const selected = upload.categoryIds.includes(String(category.id));
                return (
                  <button
                    className={selected ? "selected" : ""}
                    key={category.id}
                    onClick={() => toggleUploadCategory(category.id)}
                    type="button"
                  >
                    <Icon
                      icon={selected ? "solar:check-circle-bold" : "solar:add-circle-linear"}
                      width="18"
                    />
                    {category.name}
                  </button>
                );
              })}
              {categories.length === 0 && <span>No categories available.</span>}
            </div>
          </div>
        </div>
      </form>
    </MasterLayout>
  );
};

export default EloquentGalleryCreatePage;
