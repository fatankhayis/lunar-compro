import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { updateProject } from "../../services/api";

const ProjectTable = ({ projects, onEdit, onDelete, setProjects }) => {
  const [isSaving, setIsSaving] = React.useState(false);

  // Drag & drop handler
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(projects);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);

    const updated = reordered.map((project, index) => ({
      ...project,
      order_by: index + 1,
    }));

    setProjects(updated);

    setIsSaving(true);
    try {
      for (const project of updated) {
        await updateProject(project.id, { order_by: project.order_by });
      }
      toast.success("Project order updated successfully!", { duration: 3000 });
    } catch (err) {
      toast.error("Failed to update project order on server!", err, { duration: 3000 });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-md border border-gray-200 p-3">
      {isSaving && (
        <div className="text-sm text-bgone mb-2 animate-pulse font-medium">
          Saving project order...
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="project-table">
          {(provided) => (
            <table
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="min-w-full table-auto border-collapse"
            >
              <thead className="bg-gray-50">
                <tr>
                  {["No", "Image", "Name", "Description", "Link", "Actions"].map(
                    (head) => (
                      <th
                        key={head}
                        className="py-3 px-5 text-left text-sm font-semibold text-gray-600 tracking-wide border-b"
                      >
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400 text-sm">
                      🚀 No projects added yet.
                    </td>
                  </tr>
                ) : (
                  [...projects]
                    .sort((a, b) => a.order_by - b.order_by)
                    .map((project, index) => (
                      <Draggable
                        key={project.id}
                        draggableId={project.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border-t hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td
                              {...provided.dragHandleProps}
                              className="py-3 px-5 text-gray-500 text-sm align-middle cursor-grab active:cursor-grabbing"
                            >
                              <GripHorizontal className="w-4 h-4 inline-block mr-2 align-middle" />
                              {index + 1}
                            </td>

                            <td className="py-3 px-5 align-middle">
                              {project.image ? (
                                <img
                                  src={project.image}
                                  alt={project.name}
                                  loading="lazy"
                                  className="object-cover rounded-lg border border-gray-200 h-[70px] w-[70px]"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://via.placeholder.com/80x80?text=No+Img";
                                  }}
                                />
                              ) : (
                                <div className="bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs h-[70px] w-[70px]">
                                  No Image
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-5 text-gray-800 font-medium text-sm align-middle">
                              {project.name}
                            </td>

                            <td className="py-3 px-5 text-gray-600 text-sm align-middle max-w-[300px] whitespace-normal break-words">
                              {project.description}
                            </td>

                            <td className="py-3 px-5 text-blue-600 text-sm align-middle">
                              {project.link ? (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  View →
                                </a>
                              ) : (
                                "-"
                              )}
                            </td>

                            <td className="py-3 px-5 space-x-2 align-middle text-center">
                              <button
                                onClick={() => onEdit(project.id)}
                                className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => onDelete(project.id)}
                                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))
                )}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ProjectTable;
