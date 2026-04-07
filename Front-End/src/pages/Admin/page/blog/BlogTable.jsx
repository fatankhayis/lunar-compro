import React from 'react';

const formatDate = (value) => {
  if (!value) return '-';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString();
  } catch {
    return String(value);
  }
};

const BlogTable = ({ posts, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-md border border-gray-200 p-3">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {['Title', 'Slug', 'Published', 'Updated', 'Actions'].map((head) => (
              <th
                key={head}
                className="py-3 px-5 text-left text-sm font-semibold text-gray-600 tracking-wide border-b"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {[...posts]
            .sort((a, b) => (b.id || 0) - (a.id || 0))
            .map((post) => (
              <tr
                key={post.id}
                className="border-t hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-5 text-gray-800 font-medium text-sm align-middle max-w-[420px]">
                  <div className="line-clamp-2">{post.title}</div>
                </td>
                <td className="py-3 px-5 text-gray-600 text-sm align-middle max-w-[240px]">
                  <div className="line-clamp-1">{post.slug}</div>
                </td>
                <td className="py-3 px-5 text-sm align-middle">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      post.is_published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {post.is_published ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td className="py-3 px-5 text-gray-600 text-sm align-middle">
                  {formatDate(post.updated_at)}
                </td>
                <td className="py-3 px-5 space-x-2 align-middle text-center whitespace-nowrap">
                  <button
                    onClick={() => onEdit(post.id)}
                    className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(post.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogTable;
