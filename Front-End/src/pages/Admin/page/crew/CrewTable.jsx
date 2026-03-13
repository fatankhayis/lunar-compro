import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateCrew } from '../../services/api';

const CrewTable = ({ crewList, onEdit, onDelete, setCrewList }) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    // Reorder UI
    const reordered = Array.from(crewList);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);

    const updated = reordered.map((crew, index) => ({
      ...crew,
      order_by: index + 1,
    }));

    setCrewList(updated);
    setIsSaving(true);

    try {
      // Create array of promises for all updates
      const updatePromises = updated.map((crew) => 
        updateCrew(crew.id, { order_by: crew.order_by })
      );

      // Wait for ALL updates to complete
      await Promise.all(updatePromises);

      // Toast only appears after all are successful
      toast.success('Crew order updated successfully!');
      
    } catch (err) {
      console.error('Error updating crew order:', err);
      toast.error('Failed to update order on server!');
    } finally {
      setIsSaving(false);
    }
  };

  React.useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-md border border-gray-200 p-3">
      {isSaving && (
        <div className="text-sm text-bgone mb-2 animate-pulse font-medium">
          Saving crew order...
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="crew-table">
          {(provided) => (
            <table
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="min-w-full table-auto border-collapse"
            >
              {/* Header */}
              <thead className="bg-gray-50">
                <tr>
                  {['No', 'Image', 'Name', 'Title', 'Role', 'Actions'].map((head) => (
                    <th
                      key={head}
                      className="py-3 px-5 text-left text-sm font-semibold text-gray-600 tracking-wide border-b"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {crewList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400 text-sm">
                      🚀 No crew members added yet.
                    </td>
                  </tr>
                ) : (
                  crewList.map((crew, index) => (
                    <Draggable key={crew.id} draggableId={crew.id.toString()} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border-t hover:bg-gray-50 transition-colors duration-200"
                        >
                          {/* Drag handle */}
                          <td
                            {...provided.dragHandleProps}
                            className="py-3 px-5 text-gray-500 text-sm align-middle cursor-grab active:cursor-grabbing"
                          >
                            <GripHorizontal className="w-4 h-4 inline-block mr-2" />
                            {index + 1}
                          </td>

                          {/* Image */}
                          <td className="py-3 px-5 align-middle">
                            {crew.image ? (
                              <img
                                src={crew.image}
                                alt={crew.name}
                                loading='lazy'
                                className="object-cover rounded-lg border border-gray-200 h-[70px] w-[70px]"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/80x80?text=No+Img';
                                }}
                              />
                            ) : (
                              <div className="bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs h-[70px] w-[70px]">
                                No Image
                              </div>
                            )}
                          </td>

                          {/* Name */}
                          <td className="py-3 px-5 text-gray-800 font-medium text-sm align-middle">
                            {crew.name}
                          </td>

                          {/* Title */}
                          <td className="py-3 px-5 text-gray-500 italic text-sm align-middle">
                            {crew.title || '-'}
                          </td>

                          {/* Role */}
                          <td className="py-3 px-5 text-gray-600 text-sm align-middle">
                            {crew.role}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-5 space-x-2 align-middle">
                            <button
                              onClick={() => onEdit(index)}
                              className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDelete(index)}
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

export default CrewTable;