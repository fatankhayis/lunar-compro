import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../services/api";
import ProjectTable from "./project/ProjectTable";
import ProjectModal from "./project/ProjectModal";
import { BASE_URL } from "../../../url";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    link: "",
    image: null,
    order_by: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(
          data.map((p) => ({
            id: p.project_id,
            name: p.title,
            description: p.description,
            link: p.link,
            order_by: p.order_by,
            image: p.project_image
              ? `${BASE_URL}/storage/${p.project_image}`
              : null,
          }))
        );
      } catch (err) {
        toast.error("Failed to load projects!", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Submit Add / Update project
  const handleSubmit = async (data) => {
    try {
      const submitData = { ...data, order_by: Number(data.order_by) || 0 };

      if (editingId) {
        const updated = await updateProject(editingId, submitData);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? {
                  id: updated.project_id,
                  name: updated.title,
                  description: updated.description,
                  link: updated.link,
                  order_by: updated.order_by,
                  image: updated.project_image
                    ? `${BASE_URL}/storage/${updated.project_image}`
                    : p.image,
                }
              : p
          )
        );
        toast.success("Project successfully updated!");
      } else {
        const created = await createProject(submitData);
        setProjects((prev) => [
          ...prev,
          {
            id: created.project_id,
            name: created.title,
            description: created.description,
            link: created.link,
            order_by: created.order_by,
            image: created.project_image
              ? `${BASE_URL}/storage/${created.project_image}`
              : null,
          },
        ]);
        toast.success("Project successfully added!");
      }

      // Reset form
      setForm({ name: "", description: "", link: "", image: null, order_by: 0 });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save project!", err.response?.data || err);
    }
  };

  // Edit project by ID
  const handleEdit = async (id) => {
    try {
      const projectData = await getProjectById(id);
      setForm({
        name: projectData.title,
        description: projectData.description,
        link: projectData.link || "",
        order_by: projectData.order_by,
        image: projectData.project_image
          ? `${BASE_URL}/storage/${projectData.project_image}`
          : null,
      });
      setEditingId(id);
      setIsModalOpen(true);
    } catch (err) {
      toast.error("Failed to load project data from server!", err);
    }
  };

  // Delete project by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project successfully deleted!");
    } catch (err) {
      toast.error("Failed to delete project!", err);
    }
  };

  // Add new project
  const handleAddNew = () => {
    const nextOrder =
      projects.length > 0
        ? Math.max(...projects.map((p) => Number(p.order_by) || 0)) + 1
        : 1;

    setForm({ name: "", description: "", link: "", image: null, order_by: nextOrder });
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Project Management</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-bgtre text-white rounded-md hover:bg-bgfor transition cursor-pointer"
        >
          + Add Project
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {!loading && projects.length === 0 && (
        <p className="text-gray-500 italic">No projects available.</p>
      )}
      {!loading && projects.length > 0 && (
        <ProjectTable
          projects={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
          setProjects={setProjects}
        />
      )}

      {isModalOpen && (
        <ProjectModal
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
          editIndex={editingId}
        />
      )}
    </div>
  );
};

export default ProjectPage;
