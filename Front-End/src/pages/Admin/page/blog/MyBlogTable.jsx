import React from 'react';
import { BASE_URL } from '../../../../url';
import { Eye, Pencil, Trash2, AlertCircle, CheckCheck, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyBlogTable = ({
  blogs = [],
  onDelete,
  startIndex = 0,
}) => {
  const navigate = useNavigate();

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/80x80?text=No+Img';
  };

  const handleDelete = (blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      onDelete(blog.post_id);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      draft: 'bg-gray-100 text-gray-700',
      pending_approval: 'bg-yellow-100 text-yellow-700',
      published: 'bg-green-100 text-green-700',
      archived: 'bg-red-100 text-red-700',
    };
    return statusColors[status] || 'bg-gray-400 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      draft: <AlertCircle size={13} />,
      pending_approval: <AlertCircle size={13} />,
      published: <CheckCheck size={13} />,
      archived: <Lock size={13} />,
    };
    return icons[status] || <AlertCircle size={13} />;
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Draft',
      pending_approval: 'Pending Approval',
      published: 'Published',
      archived: 'Archived',
    };
    return labels[status] || (status ? status : 'Unknown');
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-md border border-gray-200">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            {['No', 'Image', 'Title', 'Status', 'Created', 'Actions'].map((head) => (
              <th
                key={head}
                className="py-3 px-5 text-left text-sm font-semibold text-gray-600 tracking-wide"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {blogs.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                You haven't created any blogs yet.
              </td>
            </tr>
          ) : (
            blogs.map((blog, index) => (
              <tr key={blog.post_id || index} className="border-t hover:bg-gray-50 transition">
                <td className="py-3 px-5 text-sm text-gray-700">{startIndex + index + 1}</td>

                <td className="py-3 px-5">
                  {blog.cover_image ? (
                    <img
                      src={
                        blog.cover_image.startsWith('http')
                          ? blog.cover_image
                          : `${BASE_URL}/storage/${blog.cover_image}`
                      }
                      alt={blog.title}
                      loading="lazy"
                      className="h-16 w-auto object-contain rounded border border-gray-200"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="h-16 w-16 flex items-center justify-center bg-gray-100 border rounded text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </td>

                <td className="py-3 px-5 text-gray-800 text-sm font-medium">{blog.title}</td>

                <td className="py-3 px-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${getStatusColor(blog.status)}`}>
                    {getStatusIcon(blog.status)}
                    {getStatusLabel(blog.status)}
                  </span>
                </td>

                <td className="py-3 px-5 text-gray-600 text-sm">
                  {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : '-'}
                </td>

                <td className="py-3 px-5">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/admin/blogs/${blog.post_id}/edit`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => navigate(`/blog/${blog.slug}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>

                    <button
                      onClick={() => handleDelete(blog)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyBlogTable;
