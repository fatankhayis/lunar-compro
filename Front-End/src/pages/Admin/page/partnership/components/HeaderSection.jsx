import React from 'react';

const HeaderSection = ({ onOpenCategoryModal, onOpenPartnershipModal }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800">Partnership Management</h1>
      <div className="flex gap-3">
        <button
          onClick={onOpenCategoryModal}
          className="px-4 py-2 bg-bgone text-white rounded-md hover:bg transition cursor-pointer"
        >
          + Category
        </button>
        <button
          onClick={onOpenPartnershipModal}
          className="px-4 py-2 bg-bgtre text-white rounded-md hover:bg-bgfor transition cursor-pointer"
        >
          + Partnership
        </button>
      </div>
    </div>
  );
};

export default HeaderSection;