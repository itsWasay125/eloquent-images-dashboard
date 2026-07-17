import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deleteImage,
  fetchCategories,
  fetchGalleryImages,
  fetchWhatsNewGalleryImages,
  getAuthSession,
  updateGalleryImageCategories,
  updateGalleryImageTitle,
  updateGalleryImageIsNew,
} from "../api/eloquentApi";
import EloquentImage from "../components/EloquentImage";
import MasterLayout from "../otherImages/MasterLayout";
import "./EloquentGalleryPage.css";

const swalOptions = {
  background: "#101722",
  color: "#f5f8fa",
  confirmButtonColor: "#3b586e",
  customClass: { popup: "eloquent-swal-popup" },
};

const GALLERY_PAGE_SIZE = 15;

function getImageName(image) {
  const name = image.originalName || image.fileName || image.filename || image.title;
  if (name?.trim()) return name.trim();
  return "Original name unavailable";
}

function toFiniteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function limitMetaTotal(meta = {}, maxTotalItems) {
  const safeMaxTotal = Math.max(0, Number(maxTotalItems) || 0);
  const serverTotal = toFiniteNumber(meta.totalItems);
  const totalItems = serverTotal === null ? safeMaxTotal : Math.min(serverTotal, safeMaxTotal);
  const nextMeta = { ...meta, totalItems };
  const itemsPerPage = toFiniteNumber(nextMeta.itemsPerPage);

  if (itemsPerPage && itemsPerPage > 0) {
    nextMeta.totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }

  const totalPages = toFiniteNumber(nextMeta.totalPages);
  const currentPage = toFiniteNumber(nextMeta.currentPage);
  if (totalPages && currentPage) {
    nextMeta.currentPage = Math.min(currentPage, totalPages);
  }

  return nextMeta;
}

function isMarkedNew(image) {
  return (
    image.isNew === true ||
    image.is_new === true ||
    String(image.isNew).toLowerCase() === "true" ||
    String(image.is_new).toLowerCase() === "true"
  );
}

function applyWhatsNewState(images, whatsNewIds) {
  return images.map((image) => {
    const isNew = whatsNewIds.has(String(image.id)) || isMarkedNew(image);
    return { ...image, isNew, is_new: isNew };
  });
}

const EloquentGalleryPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [loadingImages, setLoadingImages] = useState(true);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [savingTitleId, setSavingTitleId] = useState(null);
  const [editingCategoriesId, setEditingCategoriesId] = useState(null);
  const [editingCategoryIds, setEditingCategoryIds] = useState([]);
  const [savingCategoriesId, setSavingCategoriesId] = useState(null);
  const [whatsNewIds, setWhatsNewIds] = useState(() => new Set());

  const token = getAuthSession()?.token;

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories([...data].reverse());
  };

  const loadImages = useCallback(async (categoryId = activeCategory, pageNumber = page, options = {}) => {
    setLoadingImages(true);
    try {
      const [data, whatsNewImages] = await Promise.all([
        fetchGalleryImages({ categoryId, page: pageNumber, limit: GALLERY_PAGE_SIZE }),
        fetchWhatsNewGalleryImages(),
      ]);
      const nextWhatsNewIds = new Set(whatsNewImages.map((image) => String(image.id)));
      setWhatsNewIds(nextWhatsNewIds);

      const pageImages = options.deletedImageId
        ? data.images.filter((image) => String(image.id) !== String(options.deletedImageId))
        : data.images;
      const nextImages = applyWhatsNewState(pageImages, nextWhatsNewIds);
      const nextMeta =
        options.maxTotalItems === undefined
          ? data.meta
          : limitMetaTotal(data.meta, options.maxTotalItems);
      setImages(nextImages);
      setMeta(nextMeta);
      return { images: nextImages, meta: nextMeta };
    } finally {
      setLoadingImages(false);
    }
  }, [activeCategory, page]);

  useEffect(() => {
    loadCategories().catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    loadImages(activeCategory, page).catch((err) => setError(err.message));
  }, [activeCategory, loadImages, page]);

  const selectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setPage(1);
  };

  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      ...swalOptions,
      cancelButtonColor: "#273441",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#b84f57",
      confirmButtonText: "Delete",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      text: "This image will be permanently removed.",
      title: "Delete image?",
    });

    if (!confirmation.isConfirmed) return;

    setDeletingId(id);
    try {
      const currentTotal = toFiniteNumber(meta.totalItems);
      const maxTotalItemsAfterDelete = Math.max(0, (currentTotal ?? images.length) - 1);

      await deleteImage(id, token);
      setImages((current) => current.filter((image) => String(image.id) !== String(id)));
      setMeta((current) => limitMetaTotal(current, maxTotalItemsAfterDelete));
      await loadImages(activeCategory, page, {
        deletedImageId: id,
        maxTotalItems: maxTotalItemsAfterDelete,
      });
      await Swal.fire({
        ...swalOptions,
        icon: "success",
        title: "Image deleted",
        text: "The image has been removed from the gallery.",
      });
    } catch (err) {
      await Swal.fire({
        ...swalOptions,
        icon: "error",
        title: "Could not delete image",
        text: err.message || "Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const startEditTitle = (image) => {
    setEditingTitleId(image.id);
    setEditingTitle(getImageName(image));
  };

  const handleSaveTitle = async (imageId) => {
    const trimmed = editingTitle.trim();
    if (!trimmed) return;
    setSavingTitleId(imageId);
    try {
      const result = await updateGalleryImageTitle(imageId, trimmed, token);
      const updatedImage = result.data || {};
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, ...updatedImage, title: updatedImage.title || trimmed } : img
        )
      );
      setEditingTitleId(null);
    } catch (err) {
      await Swal.fire({
        ...swalOptions,
        icon: "error",
        title: "Could not update title",
        text: err.message || "Please try again.",
      });
    } finally {
      setSavingTitleId(null);
    }
  };

  const startEditCategories = (image) => {
    setEditingTitleId(null);
    setEditingCategoriesId(image.id);
    setEditingCategoryIds((image.categories || []).map((cat) => String(cat.id)));
  };

  const toggleEditCategory = (id) => {
    const categoryId = String(id);
    setEditingCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((item) => item !== categoryId)
        : [...current, categoryId]
    );
  };

  const handleSaveCategories = async (imageId) => {
    if (editingCategoryIds.length === 0) {
      await Swal.fire({
        ...swalOptions,
        icon: "info",
        title: "Select a category",
        text: "Choose at least one category before saving.",
      });
      return;
    }

    setSavingCategoriesId(imageId);
    try {
      await updateGalleryImageCategories(imageId, editingCategoryIds, token);
      setEditingCategoriesId(null);
      await loadImages(activeCategory, page);
    } catch (err) {
      await Swal.fire({
        ...swalOptions,
        icon: "error",
        title: "Could not update categories",
        text: err.message || "Please try again.",
      });
    } finally {
      setSavingCategoriesId(null);
    }
  };

  const handleToggleIsNew = async (image) => {
    const currentStatus = whatsNewIds.has(String(image.id)) || isMarkedNew(image);
    const newStatus = !currentStatus;
    try {
      // Optimistically update UI
      setWhatsNewIds((current) => {
        const next = new Set(current);
        if (newStatus) next.add(String(image.id));
        else next.delete(String(image.id));
        return next;
      });
      setImages((prev) =>
        prev.map((img) => (img.id === image.id ? { ...img, isNew: newStatus, is_new: newStatus } : img))
      );
      await updateGalleryImageIsNew(image.id, newStatus, token);
    } catch (err) {
      // Revert on error
      setWhatsNewIds((current) => {
        const next = new Set(current);
        if (currentStatus) next.add(String(image.id));
        else next.delete(String(image.id));
        return next;
      });
      setImages((prev) =>
        prev.map((img) => (img.id === image.id ? { ...img, isNew: currentStatus, is_new: currentStatus } : img))
      );
      await Swal.fire({
        ...swalOptions,
        icon: "error",
        title: "Could not update What's New status",
        text: err.message || "Please try again.",
      });
    }
  };

  return (
    <MasterLayout>
      <div className="eloquent-contact-heading">
        <div className="eloquent-page-head" style={{ margin: 0 }}>
          <span>Eloquent Images</span>
          <h2>Gallery</h2>
          <p>Upload, organize, and manage photography from one clean workspace.</p>
        </div>
        <button
          className="eloquent-btn eloquent-refresh-btn"
          onClick={() => navigate("/gallery/create")}
          type="button"
        >
          <Icon icon="solar:gallery-add-linear" width="18" />
          Upload Image
        </button>
      </div>

      {error && <div className="eloquent-alert error mt-4">{error}</div>}

      <section className="eloquent-panel eloquent-library-panel mt-4">
        <div className="eloquent-library-heading">
          <div>
            <span className="eloquent-section-icon">
              <Icon icon="solar:gallery-wide-linear" width="22" />
            </span>
            <div>
              <h3>Media Library</h3>
              <p>
                {loadingImages
                  ? "Loading images..."
                  : `${meta.totalItems ?? images.length} images in this collection`}
              </p>
            </div>
          </div>
        </div>

        <div className="eloquent-filter-row">
          <span>Filter by category</span>
          <div>
            <button
              className={`eloquent-chip ${activeCategory === "" ? "active" : ""}`}
              onClick={() => selectCategory("")}
              type="button"
            >
              All images
            </button>
            {categories.map((category) => (
              <button
                className={`eloquent-chip ${
                  String(activeCategory) === String(category.id) ? "active" : ""
                }`}
                key={category.id}
                onClick={() => selectCategory(category.id)}
                type="button"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loadingImages ? (
          <div className="eloquent-gallery-state">
            <Icon className="eloquent-contact-spinner" icon="solar:refresh-linear" width="28" />
            <strong>Loading media library...</strong>
          </div>
        ) : images.length === 0 ? (
          <div className="eloquent-gallery-state">
            <Icon icon="solar:gallery-remove-linear" width="32" />
            <strong>No images in this category</strong>
            <span>Upload an image or choose another category.</span>
          </div>
        ) : (
          <div className="eloquent-gallery-grid">
            {images.map((image) => {
              const isNew = isMarkedNew(image);

              return (
              <article className="eloquent-gallery-card" key={image.id}>
                <div className="eloquent-gallery-media">
                  <EloquentImage
                    alt={getImageName(image)}
                    className="eloquent-gallery-img"
                    src={image.imageUrl}
                  />
                  <span title={getImageName(image)}>{getImageName(image)}</span>
                </div>
                {editingCategoriesId === image.id ? (
                  <div className="eloquent-gallery-category-edit">
                    <div className="eloquent-field-label">
                      <span>Categories</span>
                      <small>{editingCategoryIds.length} selected</small>
                    </div>
                    <div className="eloquent-category-options">
                      {categories.map((category) => {
                        const selected = editingCategoryIds.includes(String(category.id));
                        return (
                          <button
                            className={selected ? "selected" : ""}
                            disabled={savingCategoriesId === image.id}
                            key={category.id}
                            onClick={() => toggleEditCategory(category.id)}
                            type="button"
                          >
                            <Icon
                              icon={selected ? "solar:check-circle-bold" : "solar:add-circle-linear"}
                              width="16"
                            />
                            {category.name}
                          </button>
                        );
                      })}
                      {categories.length === 0 && <span>No categories available.</span>}
                    </div>
                    <div className="eloquent-gallery-category-edit-actions">
                      <button
                        className="eloquent-btn eloquent-btn-secondary"
                        disabled={savingCategoriesId === image.id}
                        onClick={() => setEditingCategoriesId(null)}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="eloquent-btn"
                        disabled={savingCategoriesId === image.id || editingCategoryIds.length === 0}
                        onClick={() => handleSaveCategories(image.id)}
                        type="button"
                      >
                        <Icon
                          className={savingCategoriesId === image.id ? "eloquent-contact-spinner" : ""}
                          icon={savingCategoriesId === image.id ? "solar:refresh-linear" : "solar:check-circle-linear"}
                          width="16"
                        />
                        {savingCategoriesId === image.id ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                <div className="eloquent-gallery-card-body">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    {editingTitleId === image.id ? (
                      <div className="eloquent-gallery-title-edit">
                        <input
                          autoFocus
                          className="eloquent-gallery-title-input"
                          disabled={savingTitleId === image.id}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveTitle(image.id);
                            if (e.key === "Escape") setEditingTitleId(null);
                          }}
                          value={editingTitle}
                        />
                        <button
                          className="eloquent-gallery-title-save"
                          disabled={savingTitleId === image.id || !editingTitle.trim()}
                          onClick={() => handleSaveTitle(image.id)}
                          title="Save"
                          type="button"
                        >
                          <Icon
                            className={savingTitleId === image.id ? "eloquent-contact-spinner" : ""}
                            icon={savingTitleId === image.id ? "solar:refresh-linear" : "solar:check-read-linear"}
                            width="15"
                          />
                        </button>
                        <button
                          className="eloquent-gallery-title-cancel"
                          disabled={savingTitleId === image.id}
                          onClick={() => setEditingTitleId(null)}
                          title="Cancel"
                          type="button"
                        >
                          <Icon icon="solar:close-circle-linear" width="15" />
                        </button>
                      </div>
                    ) : (
                      <strong title={getImageName(image)}>{getImageName(image)}</strong>
                    )}
                    <small>
                      {image.categories?.length
                        ? image.categories.map((cat) => cat.name).join(", ")
                        : "Uncategorized"}
                    </small>
                  </div>
                  {editingTitleId !== image.id && (
                    <div className="eloquent-gallery-card-actions">
                      <button
                        className="eloquent-gallery-title-btn"
                        onClick={() => startEditTitle(image)}
                        title="Edit title"
                        type="button"
                      >
                        <Icon icon="solar:pen-linear" width="15" />
                      </button>
                      <button
                        className="eloquent-gallery-title-btn"
                        onClick={() => startEditCategories(image)}
                        title="Edit categories"
                        type="button"
                      >
                        <Icon icon="solar:tag-linear" width="15" />
                      </button>
                      <button
                        className="eloquent-gallery-delete-btn"
                        aria-label={`Delete ${getImageName(image)}`}
                        disabled={deletingId === image.id}
                        onClick={() => handleDelete(image.id)}
                        title="Delete image"
                        type="button"
                      >
                        <Icon
                          className={deletingId === image.id ? "eloquent-contact-spinner" : ""}
                          icon={
                            deletingId === image.id
                              ? "solar:refresh-linear"
                              : "solar:trash-bin-trash-linear"
                          }
                          width="18"
                        />
                      </button>
                    </div>
                  )}
                  <button
                    className={`eloquent-whats-new-toggle${isNew ? " is-active" : ""}`}
                    type="button"
                    onClick={() => handleToggleIsNew(image)}
                  >
                    <Icon
                      icon={isNew ? "solar:check-circle-bold" : "solar:check-circle-linear"}
                      width="16"
                    />
                    <span>{isNew ? "Added to What's New" : "Show in What's New"}</span>
                  </button>
                </div>
                )}
              </article>
              );
            })}
          </div>
        )}

        {!loadingImages && images.length > 0 && (
          <div className="eloquent-contact-pagination eloquent-gallery-pagination">
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

export default EloquentGalleryPage;
