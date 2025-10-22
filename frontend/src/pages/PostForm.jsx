/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
// src/pages/PostForm.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/apiClient";
import useApi from "../hooks/useApi";
import { PostsContext } from "../contexts/PostsContext";

export default function PostForm({ edit = false }) {
  const { id } = useParams();
  const { call, loading, error } = useApi();
  const { categories } = useContext(PostsContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(['Technology', 
  'Business', 
  'Lifestyle', 
  'Health', 
  'Travel', 
  'Education', 
  'Food']);
  const [file, setFile] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    if (edit && id) load();
  }, [id]);

  const load = async () => {
    const data = await call(() => api.get(`/posts/${id}`));
    setTitle(data.post.title);
    setContent(data.post.content);
    setSelectedCategories((data.post.categories || []).map((c) => c._id));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      selectedCategories.forEach((c) => formData.append("categories", c));
      if (file) formData.append("featuredImage", file);
      let res;
      if (edit)
        res = await call(() =>
          api.put(`/posts/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        );
      else
        res = await call(() =>
          api.post("/posts", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        );
      nav(`/post/${res._id || res.post._id}`);
    } catch (err) {}
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {edit ? "Edit Post" : "Create Post"}
      </h1>
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Content</label>
          <textarea
            className="w-full p-2 border rounded h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Categories</label>
          <select
            multiple
            value={selectedCategories}
            onChange={(e) =>
              setSelectedCategories(
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            className="w-full p-2 border rounded"
          >
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {edit ? "Update Post" : "Create Post"}
        </button>
        {error && <div className="text-red-500 mt-2">{JSON.stringify(error)}</div>}
      </form>
    </div>
  );
}
