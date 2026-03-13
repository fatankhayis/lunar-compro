import React from 'react';
import { BASE_URL } from '../../../../url';

const PartnershipTable = ({ partners = [], onEdit, onDelete, startIndex = 0 }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/80x80?text=No+Img';
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-md border border-gray-200">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            {['No', 'Image', 'Name', 'Category', 'Actions'].map((head) => (
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
          {partners.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                No partnerships available.
              </td>
            </tr>
          ) : (
            partners.map((p, index) => (
              <tr key={p.id || index} className="border-t hover:bg-gray-50 transition">
                {/* ✅ Nomor urut berlanjut antar halaman */}
                <td className="py-3 px-5 text-sm text-gray-700">{startIndex + index + 1}</td>

                <td className="py-3 px-5">
                  {p.partner_image ? (
                    <img
                      src={
                        p.partner_image.startsWith('http')
                          ? p.partner_image
                          : `${BASE_URL}/storage/${p.partner_image}`
                      }
                      alt={p.name}
                      loading="lazy"
                      className="h-20 w-auto object-contain rounded border border-gray-200"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="h-20 w-20 flex items-center justify-center bg-gray-100 border rounded text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </td>

                <td className="py-3 px-5 text-gray-800 text-sm font-medium">{p.name}</td>

                <td className="py-3 px-5 text-gray-600 text-sm">{p.category?.name || '-'}</td>

                <td className="py-3 px-5 space-x-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PartnershipTable;