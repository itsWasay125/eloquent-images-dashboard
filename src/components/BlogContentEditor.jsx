import React from "react";
import ReactQuill from "react-quill-new";

const modules = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
];

export function isBlogContentEmpty(content = "") {
  if (/<(?:img|video|iframe)\b/i.test(content)) return false;

  return content
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim() === "";
}

const BlogContentEditor = ({ onChange, value }) => (
  <div className="eloquent-blog-editor">
    <ReactQuill
      formats={formats}
      modules={modules}
      onChange={onChange}
      placeholder="Write the blog content..."
      theme="snow"
      value={value}
    />
  </div>
);

export default BlogContentEditor;
