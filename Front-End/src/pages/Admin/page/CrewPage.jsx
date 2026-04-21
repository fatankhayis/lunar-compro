import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  getCrew,
  createCrew,
  updateCrew,
  deleteCrew,
  getCrewById,
} from "../services/api";
import CrewTable from "./crew/CrewTable";
import CrewModal from "./crew/CrewModal";
import { BASE_URL } from "../../../url";

const CrewPage = () => {
  const [crewList, setCrewList] = useState(() => {
    // 🔹 Load cache from sessionStorage (if available)
    const cached = sessionStorage.getItem("crew_cache");
    return cached ? JSON.parse(cached) : [];
  });

  const [form, setForm] = useState({
    name: "",
    title: "",
    role: "",
    image: null,
    order_by: 0,
  });

  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(crewList.length === 0);
  const fetchedRef = useRef(false); // ✅ Prevent duplicate fetching
  const hasShownEmptyToastRef = useRef(false);

  // ==============================
  // 🧩 Fetch Crew Data (only once)
  // ==============================
  useEffect(() => {
    if (fetchedRef.current || crewList.length > 0) return; // ⛔ Skip refetch
    fetchedRef.current = true;

    const fetchCrew = async () => {
      try {
        setLoading(true);
        const data = await getCrew();
        const mapped = (data || []).map((c) => ({
          id: c.crew_id,
          name: c.name,
          title: c.title,
          role: c.role,
          order_by: c.order_by,
          image: c.crew_image ? `${BASE_URL}/storage/${c.crew_image}` : null,
        }));
        setCrewList(mapped);
        sessionStorage.setItem("crew_cache", JSON.stringify(mapped)); // 💾 Cache data

        if (!hasShownEmptyToastRef.current && mapped.length === 0) {
          hasShownEmptyToastRef.current = true;
          toast("No crew members yet. Add a crew member to see this feature in action.");
        }
      } catch (err) {
        toast.error("Failed to load crew data!", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCrew();
  }, []);

  // ==============================
  // ✏️ Add / Edit Crew
  // ==============================
  const handleSubmit = async (data) => {
    try {
      const orderValue = Number(data.order_by) || 0;

      const duplicate = crewList.some(
        (c, i) => c.order_by === orderValue && (editIndex === null || i !== editIndex)
      );

      if (duplicate) {
        toast.error(`Order ${orderValue} is already used by another crew member!`);
        return;
      }

      let updatedList = [...crewList];

      if (editIndex !== null) {
        const target = crewList[editIndex];
        const updatedCrew = await updateCrew(target.id, data);

        updatedList[editIndex] = {
          id: updatedCrew.crew_id,
          name: updatedCrew.name,
          title: updatedCrew.title,
          role: updatedCrew.role,
          order_by: updatedCrew.order_by,
          image: updatedCrew.crew_image
            ? `${BASE_URL}/storage/${updatedCrew.crew_image}`
            : target.image,
        };
        toast.success("Crew member updated successfully!");
      } else {
        const newCrew = await createCrew(data);
        updatedList.push({
          id: newCrew.crew_id,
          name: newCrew.name,
          title: newCrew.title,
          role: newCrew.role,
          order_by: newCrew.order_by,
          image: newCrew.crew_image
            ? `${BASE_URL}/storage/${newCrew.crew_image}`
            : null,
        });
        toast.success("Crew member added successfully!");
      }

      setCrewList(updatedList);
      sessionStorage.setItem("crew_cache", JSON.stringify(updatedList)); // 🔁 Update cache
      setForm({ name: "", title: "", role: "", image: null, order_by: 0 });
      setEditIndex(null);
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save crew data!", err);
    }
  };

  // ==============================
  // ✏️ Edit Crew
  // ==============================
  const handleEdit = async (index) => {
    try {
      const id = crewList[index].id;
      const crewData = await getCrewById(id);
      const imageUrl = crewData.crew_image
        ? `${BASE_URL}/storage/${crewData.crew_image}`
        : null;

      setForm({
        name: crewData.name,
        title: crewData.title,
        role: crewData.role,
        image: imageUrl,
        order_by: crewData.order_by,
      });
      setEditIndex(index);
      setIsModalOpen(true);
    } catch {
      toast.error("Failed to load crew data from server!");
    }
  };

  // ==============================
  // 🗑️ Delete Crew
  // ==============================
  const handleDelete = async (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this crew member?");
    if (!confirmed) return;

    try {
      const id = crewList[index].id;
      await deleteCrew(id);
      const newList = crewList.filter((_, i) => i !== index);
      setCrewList(newList);
      sessionStorage.setItem("crew_cache", JSON.stringify(newList));
      toast.success("Crew member deleted successfully!");
    } catch {
      toast.error("Failed to delete crew member!");
    }
  };

  // ==============================
  // 🧩 RENDER
  // ==============================
  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Crew Management</h1>
        <button
          onClick={() => {
            setEditIndex(null);
            const nextOrder =
              crewList.length > 0
                ? Math.max(...crewList.map((c) => Number(c.order_by) || 0)) + 1
                : 1;
            setForm({ name: "", title: "", role: "", image: null, order_by: nextOrder });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-bgtre text-white rounded-md hover:bg-bgfor transition cursor-pointer"
        >
          + Add Crew
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {!loading && crewList.length === 0 && (
        <p className="text-gray-500 italic">No crew members yet.</p>
      )}

      {!loading && crewList.length > 0 && (
        <CrewTable
          crewList={crewList}
          onEdit={handleEdit}
          onDelete={handleDelete}
          setCrewList={setCrewList}
        />
      )}

      {isModalOpen && (
        <CrewModal
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
          editIndex={editIndex}
        />
      )}
    </div>
  );
};

export default CrewPage;
