/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/PostList.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../api/apiClient";
import useApi from "../hooks/useApi";
import { PostsContext } from "../contexts/PostsContext";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";

export default function PostList() {
  const { call, loading, error } = useApi();
  const { posts, setPosts } = useContext(PostsContext);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    const data = await call(() =>
      api.get(`/posts?page=${page}&q=${encodeURIComponent(q)}`)
    );
    setPosts(data.posts);
    setPages(data.pages);
  };

  const handleDelete = async (id) => {
    const prev = posts.slice();
    setPosts(prev.filter((p) => p._id !== id));
    try {
      await call(() => api.delete(`/posts/${id}`));
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setPosts(prev);
      alert("Delete failed");
    }
  };

  if (loading && posts.length === 0) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Search */}
      <div className="flex mb-4 gap-2">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {
            setPage(1);
            fetchPosts();
          }}
        >
          Search
        </button>
      </div>

      {/* Error */}
      {error && <div className="text-red-500 mb-4">{JSON.stringify(error)}</div>}

      {/* Posts List */}
      <ul className="space-y-4">
        {posts.map((p) => (
          <li
            key={p._id}
            className="p-4 border rounded shadow-sm hover:shadow-md transition"
          >
            <Link to={`/post/${p._id}`} className="text-xl font-bold text-blue-600">
              {p.title}
            </Link>
            <p className="text-gray-500 text-sm">by {p.author?.name || "Unknown"}</p>
            <div className="mt-2 flex gap-2">
              <Link
                to={`/edit/${p._id}`}
                className="px-2 py-1 bg-yellow-400 text-white rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(p._id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination page={page} pages={pages} onPage={(p) => setPage(p)} />
      </div>
    </div>
  );
}
