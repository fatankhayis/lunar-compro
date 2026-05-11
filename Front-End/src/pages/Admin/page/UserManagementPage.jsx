import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import UserTable from './blog/UserTable';
import UserModal from './blog/UserModal';
import API from '../services/api';
import { getAllUsers, createUser, updateUser, deleteUser } from '../services/userApi';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'blog_author' });
  const [editId, setEditId] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    current_page: 1,
    next_page_url: null,
    prev_page_url: null,
    per_page: 10,
  });

  const hasShownEmptyToastRef = useRef(false);

  const fetchUsers = async (pageUrl = null) => {
    try {
      setLoading(true);
      let url = pageUrl || '/api/users?page=1&per_page=10';

      const res = await API.get(url);
      const data = res.data?.data;
      const list = data?.data || [];

      if (!hasShownEmptyToastRef.current && list.length === 0) {
        hasShownEmptyToastRef.current = true;
        toast('No users yet. Add a user to see this feature in action.');
      }

      setUsers(
        list.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
        }))
      );

      setPageInfo({
        current_page: data?.current_page || 1,
        next_page_url: data?.next_page_url,
        prev_page_url: data?.prev_page_url,
        per_page: data?.per_page || 10,
      });
    } catch (err) {
      toast.error('Failed to load user data');
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (formData) => {
    if (!formData.name || !formData.email || !formData.role) {
      return toast.error('Name, email, and role are required!');
    }
    if (!editId && !formData.password) {
      return toast.error('Password is required for new users!');
    }

    try {
      setLoading(true);
      if (editId) {
        const updatePayload = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          updatePayload.password = formData.password;
        }
        await updateUser(editId, updatePayload);
        toast.success('User successfully updated');
      } else {
        await createUser(formData);
        toast.success('User successfully added');
      }
      setIsModalOpen(false);
      setForm({ name: '', email: '', password: '', role: 'blog_author' });
      setEditId(null);
      fetchUsers();
    } catch (err) {
      const errorMessage = err?.errors
        ? Object.values(err.errors).flat()[0]
        : err?.message || 'Failed to save user data';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setEditId(user.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;
    try {
      setLoading(true);
      await deleteUser(user.id);
      toast.success('User successfully deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStartIndex = () => {
    return (pageInfo.current_page - 1) * pageInfo.per_page;
  };

  return (
    <div className="p-3">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => {
            setForm({ name: '', email: '', password: '', role: 'blog_author' });
            setEditId(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-bgtre text-white rounded-md hover:bg-bgfor transition cursor-pointer"
        >
          + Create User
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : users.length > 0 ? (
        <>
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            startIndex={calculateStartIndex()}
          />

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={!pageInfo.prev_page_url}
              onClick={() => fetchUsers(pageInfo.prev_page_url)}
              className={`px-4 py-2 rounded-md ${
                pageInfo.prev_page_url
                  ? 'bg-bgtre text-white hover:bg-bgfor'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              Prev
            </button>

            <span className="text-gray-700 font-medium">
              Page {pageInfo.current_page}
            </span>

            <button
              disabled={!pageInfo.next_page_url}
              onClick={() => fetchUsers(pageInfo.next_page_url)}
              className={`px-4 py-2 rounded-md ${
                pageInfo.next_page_url
                  ? 'bg-bgtre text-white hover:bg-bgfor'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-gray-400">
          <p>No users available.</p>
        </div>
      )}

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={form}
        isEditing={editId !== null}
      />
    </div>
  );
};

export default UserManagementPage;
