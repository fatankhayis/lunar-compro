import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../../../utils/cropImage';
import { removeBackground } from '@imgly/background-removal';

export default function CrewModal({ form, setForm, onSubmit, onClose, editIndex }) {
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempImageSrc(url);
    }
  };

  const handleRemoveBg = async () => {
    if (!tempImageSrc) return;
    try {
      setIsRemovingBg(true);
      const toastId = toast.loading('Memproses AI... (Tunggu sebentar ya, pertama kali mungkin agak lama)');
      const imageBlob = await removeBackground(tempImageSrc);
      const url = URL.createObjectURL(imageBlob);
      setTempImageSrc(url);
      toast.success('Background berhasil dihapus!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error('Gagal menghapus background.');
    } finally {
      setIsRemovingBg(false);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role) return toast.error('Name and Role are required');

    let finalForm = { ...form };

    if (tempImageSrc && croppedAreaPixels) {
      try {
        const croppedImageFile = await getCroppedImg(tempImageSrc, croppedAreaPixels);
        finalForm.image = croppedImageFile;
      } catch (err) {
        console.error(err);
        return toast.error('Failed to crop image');
      }
    }

    onSubmit(finalForm);
  };

  const previewImage = form.image instanceof File ? URL.createObjectURL(form.image) : form.image;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {editIndex !== null && editIndex !== undefined ? 'Edit Crew Member' : 'Add Crew Member'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'title', 'role'].map((field) => (
            <Input
              key={field}
              label={capitalize(field)}
              name={field}
              value={form[field] || ''}
              onChange={handleChange}
              placeholder={`${capitalize(field)}`}
            />
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <label className="mt-1 inline-block px-4 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
              Upload Image
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            
            {tempImageSrc ? (
              <div className="mt-2 flex flex-col gap-2">
                <div className="relative w-full h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgLz4KPHBhdGggZD0iTTAgMGgxMHYxMEgwem0xMCAxMGgxMHYxMEgxMHoiIGZpbGw9IiNlNWU1ZTUiIC8+Cjwvc3ZnPg==')] rounded overflow-hidden">
                  <Cropper
                    image={tempImageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={3 / 4}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                  {isRemovingBg && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="flex flex-col items-center">
                        <svg className="animate-spin h-8 w-8 text-bgtre mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm font-semibold text-gray-800">Menghapus Background...</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600 block mb-1">Zoom</label>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      onChange={(e) => setZoom(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveBg}
                    disabled={isRemovingBg}
                    className="mt-4 px-3 py-1.5 text-sm bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 shadow-md transition-all flex items-center gap-1 cursor-pointer"
                  >
                    ✨ Hapus BG
                  </button>
                </div>
              </div>
            ) : previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-24 h-32 object-cover rounded"
              />
            ) : null}
            
            <p className="text-xs text-gray-500 mt-1">Recommended: PNG with transparent background.</p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-bgtre text-white rounded-md hover:bg-bgfor transition cursor-pointer"
            >
              {editIndex !== null && editIndex !== undefined ? 'Update Crew' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input {...props} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
    </div>
  );
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
