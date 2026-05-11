import React from 'react';
import { User, Book, Pencil, Trash2 } from 'lucide-react';

const UserTable = ({ users = [], onEdit, onDelete, startIndex = 0 }) => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-md border border-gray-200">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            {['No', 'Name', 'Email', 'Role', 'Actions'].map((head) => (
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
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                No users available.
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id || index} className="border-t hover:bg-gray-50 transition">
                <td className="py-3 px-5 text-sm text-gray-700">{startIndex + index + 1}</td>

                <td className="py-3 px-5 text-gray-800 text-sm font-medium">{user.name}</td>

                <td className="py-3 px-5 text-gray-600 text-sm">{user.email}</td>

                <td className="py-3 px-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                      user.role === 'super_admin'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user.role === 'super_admin' ? (
                      <>
                        <User size={14} />
                        Super Admin
                      </>
                    ) : (
                      <>
                        <Book size={14} />
                        Blog Author
                      </>
                    )}
                  </span>
                </td>

                <td className="py-3 px-5">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user)}
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

export default UserTable;
