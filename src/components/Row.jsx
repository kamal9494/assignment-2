import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";

const Row = ({ user, handleSelectRow, selectedRows, handleDelete,  }) => {
  return (
    <div className="w-full bg-gray-100 border py-3 px-2 flex justify-around hover:bg-gray-200">
      <div className="flex justify-center items-center">
        <input type="checkbox" checked={selectedRows.includes(user)} onChange={() => handleSelectRow(user)} />
      </div>
      <div className="w-[25%]">{user.name}</div>
      <div className="w-[25%]">{user.email}</div>
      <div className="w-[20%]">{user.role}</div>
      <div className="w-[10%] flex gap-1">
        <div className="bg-white rounded border p-1">
          <IoCreateOutline className="cursor-pointer" size={22} />
        </div>
        <div className="bg-white rounded border p-1">
          <MdDeleteOutline className="text-red-500 cursor-pointer" size={22} />
        </div>
      </div>
    </div>
  );
};

export default Row;
