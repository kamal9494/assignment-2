import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import { MdDeleteOutline } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { CiSearch } from "react-icons/ci";

const API =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
const Table = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const page = 10;
  const [editableRows, setEditableRows] = useState({});

  useEffect(() => {
    axios
      .get(API)
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSearch = () => {
    const fData = data.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
    setFilteredData(fData);
    setCurrentPage(1);
  };

  const handlePage = (num) => {
    setCurrentPage(num);
  };

  const handleSelectAll = () => {
    if (
      selectedRows.length === page ||
      selectedRows.length === filteredData.length
    )
      setSelectedRows([]);
    else
      setSelectedRows(
        filteredData.slice((currentPage - 1) * page, currentPage * page)
      );
  };

  const handleSelectRow = (row) => {
    if (selectedRows.includes(row))
      setSelectedRows(
        selectedRows.filter((selectedRow) => selectedRow !== row)
      );
    else setSelectedRows([...selectedRows, row]);
  };

  const handleSelectedDelete = () => {
    const updatedData = data.filter((user) => !selectedRows.includes(user));
    const updatedFilteredData = filteredData.filter(
      (user) => !selectedRows.includes(user)
    );
    setData(updatedData);
    setFilteredData(updatedData);
    setSelectedRows([]);
  };

  const handleDelete = (id) => {
    const updatedSelectedData = selectedRows.filter((user) => user.id !== id);
    const updatedData = data.filter((user) => user.id !== id);
    setSelectedRows(updatedSelectedData);
    setData(updatedData);
    setFilteredData(updatedData);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleEdit = (rowId) => {
    console.log(rowId);
    setEditableRows((prev) => ({ ...prev, [rowId]: true }));
    console.log(editableRows);
  };

  const handleSave = (rowId) => {
    // Assuming you have a form validation function
    if (!validateRow(rowId)) {
      // Handle validation error, e.g., show an alert
      alert("Please fill in all fields.");
      return;
    }

    const updatedData = data.map((row) =>
      row.id === rowId
        ? {
            ...row,
            name: document.getElementById(`name-${rowId}`).value,
            email: document.getElementById(`email-${rowId}`).value,
            role: document.getElementById(`role-${rowId}`).value,
          }
        : row
    );
    setFilteredData(updatedData);
    setData(updatedData);
    setEditableRows((prev) => ({ ...prev, [rowId]: false }));
  };

  const validateRow = (rowId) => {
    const name = document.getElementById(`name-${rowId}`).value.trim();
    const email = document.getElementById(`email-${rowId}`).value.trim();
    const role = document.getElementById(`role-${rowId}`).value.trim();
    return name !== "" && email !== "" && role !== "";
  };

  const handleBulkDelete = () => {
    setData([]);
    setFilteredData([]);
  }

  const totalPages = Math.ceil(filteredData.length / page);
  return (
    <>
      <div className="p-2">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2">
            <input
              type="text"
              className="border-2 rounded w-[300px] py-2 px-3 shadow text-gray-700 leading-tight focus:outline-[gray]"
              placeholder="Search any value"
              onChange={handleChange}
              value={search}
              // onKeyUp={handleSearch}
            />
            {search.length !== 0 && (
              <div className="flex items-center">
                <IoMdClose size={25} className="cursor-pointer" onClick={() => setSearch('')}/>
              </div>
            )}
            <button
              className="search-icon p-2 bg-gray-500 rounded-md text-white"
              onClick={handleSearch}
            >
              <CiSearch size={25}/>
            </button>
          </div>
          <button className="bulk-delete bulk bg-[#f7a3a9] p-1 rounded cursor-pointer text-white">
            <MdDeleteOutline size={25} onClick={handleBulkDelete} />
          </button>
        </div>
        <div className="overflow-auto rounded-lg shadow mt-3">
          <table className="w-full border">
            <thead className="bg-[#BDD5EA] border-2">
              <tr className="p-2 text-sm font-semibold tracking-wide text-left">
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === page ||
                      selectedRows.length === filteredData.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-3 text-sm tracking-wide text-left font-bold">
                  Name
                </th>
                <th className="p-3 text-sm tracking-wide text-left font-bold">
                  Email
                </th>
                <th className="p-3 text-sm tracking-wide text-left font-bold">
                  Role
                </th>
                <th className="p-3 text-sm tracking-wide text-left font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData
                .slice((currentPage - 1) * page, currentPage * page)
                .map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className={`${
                        selectedRows.includes(user) ? "bg-gray-300" : ""
                      } border-2`}
                    >
                      <td className="p-2 px-3 text-sm whitespace-nowrap">
                        <input
                          key={user.id}
                          type="checkbox"
                          checked={selectedRows.includes(user)}
                          onChange={() => handleSelectRow(user)}
                        />
                      </td>
                      <td className="p-2 px-3 text-sm whitespace-nowrap">
                        {editableRows[user.id] ? (
                          <input
                            className="w-[100%] p-1 bg-gray-100 border"
                            type="text"
                            id={`name-${user.id}`}
                            defaultValue={user.name}
                          />
                        ) : (
                          user.name
                        )}
                      </td>
                      <td className="p-2 px-3 text-sm whitespace-nowrap">
                        {editableRows[user.id] ? (
                          <input
                            className="w-[100%] border bg-gray-100 p-1"
                            type="text"
                            id={`email-${user.id}`}
                            defaultValue={user.email}
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td className="p-2 px-3 text-sm whitespace-nowrap">
                        {editableRows[user.id] ? (
                          <input
                            className="w-[100%] bg-gray-100 border p-1"
                            type="text"
                            id={`role-${user.id}`}
                            defaultValue={user.role}
                          />
                        ) : (
                          user.role
                        )}
                      </td>
                      <td className="p-2 px-3 text-sm whitespace-nowrap flex gap-2">
                        {editableRows[user.id] ? (
                          <button
                            title="save"
                            className="save bg-white rounded border p-1 bg-yellow-300"
                            onClick={() => handleSave(user.id)}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            title="edit"
                            className="edit bg-white rounded border p-1"
                            onClick={() => handleEdit(user.id)}
                          >
                            <IoCreateOutline
                              className="cursor-pointer"
                              size={22}
                            />
                          </button>
                        )}
                        <button
                          title="delete"
                          className="delete bg-white rounded border p-1"
                          onClick={() => handleDelete(user.id)}
                        >
                          <MdDeleteOutline
                            className="text-red-500 cursor-pointer"
                            size={22}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        totalUsers={filteredData.length}
        selectedRows={selectedRows.length}
        totalPages={totalPages}
        handlePage={handlePage}
        currentPage={currentPage}
      />
      <div>
        <button
          title="delete selected"
          className="bg-red-500 p-1 mx-4 rounded cursor-pointer text-white"
          onClick={handleSelectedDelete}
        >
          Delete Selected
        </button>
      </div>
    </>
  );
};

export default Table;
