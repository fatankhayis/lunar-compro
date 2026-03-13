import React from "react";

const TestimonialTable = ({ testimonials, onEdit, onDelete, startIndex = 0 }) => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-md border border-gray-200 p-3">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {["No", "Name", "Role", "Testimonial", "Video", "Actions"].map((head) => (
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
          {testimonials.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-10 text-gray-400 text-sm">
                💬 No testimonials yet.
              </td>
            </tr>
          ) : (
            testimonials.map((t, index) => (
              <tr key={t.id || index} className="border-t hover:bg-gray-50 transition">
                <td className="py-3 px-5 text-gray-500 text-sm">{startIndex + index + 1}</td>
                <td className="py-3 px-5 text-gray-800 font-medium text-sm">{t.name}</td>
                <td className="py-3 px-5 text-gray-600 text-sm">{t.role}</td>
                <td className="py-3 px-5 text-gray-700 text-sm max-w-[400px] whitespace-normal break-words">
                  {t.testimonial}
                </td>
                <td className="py-3 px-5 text-sm">
                  {t.video_url ? (
                    <a href={t.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Video
                    </a>
                  ) : "-"}
                </td>
                <td className="py-3 px-5 space-x-2 text-center">
                  <button
                    onClick={() => onEdit(t.id)}
                    className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 cursor-pointer"
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

export default TestimonialTable;
