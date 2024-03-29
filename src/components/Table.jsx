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
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsOnPage = 10;
  const [editableRows, setEditableRows] = useState({});

  useEffect(() => {
    axios
      .get(API)
      .then((res) => {
        setIsLoading(false);
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

  const handleDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePage = (num) => {
    setCurrentPage(num);
  };

  const handleSelectAll = () => {
    if (
      selectedRows.length === itemsOnPage ||
      selectedRows.length === filteredData.length
    )
      setSelectedRows([]);
    else
      setSelectedRows(
        filteredData.slice(
          (currentPage - 1) * itemsOnPage,
          currentPage * itemsOnPage
        )
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
    // console.log(rowId);
    setEditableRows((prev) => ({ ...prev, [rowId]: true }));
    // console.log(editableRows);
  };

  const handleSave = (rowId) => {
    if (!validateRow(rowId)) {
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
  };

  const handleClear = () => {
    setSearch("");
    setSelectedRows([]);
    setFilteredData(data);
  };

  const totalPages = Math.ceil(filteredData.length / itemsOnPage);
  return (
    <>
      <div className="p-2">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2">
            <input
              type="text"
              className="border-2 rounded w-[250px] py-2 px-3 shadow text-gray-700 leading-tight focus:outline-[gray]"
              placeholder="Search any value"
              onChange={handleChange}
              value={search}
              onKeyDown={handleDown}
            />
            {search.length !== 0 && (
              <div className="flex items-center">
                <IoMdClose
                  size={25}
                  className="cursor-pointer"
                  onClick={handleClear}
                />
              </div>
            )}
            <button
              className="search-icon p-2 bg-gray-500 rounded-md text-white"
              onClick={handleSearch}
            >
              <CiSearch size={25} />
            </button>
          </div>
          <button className="bulk-delete bulk bg-[#f7a3a9] p-2 rounded cursor-pointer text-white">
            <MdDeleteOutline size={25} onClick={handleBulkDelete} />
          </button>
        </div>
        <div className="overflow-auto rounded-lg shadow mt-3">
          {isLoading ? (
            <div className="w-full text-center">Loading...</div>
          ) : (
            <table className="w-full border">
              <thead className="bg-[#BDD5EA] border-2">
                <tr className="p-2 text-sm font-semibold tracking-wide text-left">
                  <th className="p-3 text-sm font-semibold tracking-wide text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === itemsOnPage ||
                        (selectedRows.length !== 0 &&
                          filteredData.length === selectedRows.length)
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
                  .slice(
                    (currentPage - 1) * itemsOnPage,
                    currentPage * itemsOnPage
                  )
                  .map((user) => {
                    return (
                      <tr
                        key={user.id}
                        className={`${
                          selectedRows.includes(user) ? "bg-gray-300" : ""
                        } border-2`}
                      >
                        <td className="p-2 px-3 text-sm">
                          <input
                            key={user.id}
                            type="checkbox"
                            checked={selectedRows.includes(user)}
                            onChange={() => handleSelectRow(user)}
                          />
                        </td>
                        <td className="p-2 px-3 text-sm">
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
                        <td className="p-2 px-3 text-sm">
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
                        <td className="p-2 px-3 text-sm">
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
                        <td className="p-2 px-3 text-sm flex gap-2">
                          {/* {editableRows[user.id] ? (
                          
                        ) : (
                          
                        )} */}
                          <button
                            title="edit"
                            className={`edit ${
                              editableRows[user.id]
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            } bg-white rounded border p-1`}
                            onClick={() => handleEdit(user.id)}
                          >
                            <IoCreateOutline size={22} />
                          </button>

                          <button
                            title="save"
                            className={`save ${
                              !editableRows[user.id]
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            } rounded border p-1 bg-yellow-300`}
                            onClick={() => handleSave(user.id)}
                          >
                            Save
                          </button>
                          <button
                            title="delete"
                            className="delete bg-white rounded border p-1"
                            onClick={() => handleDelete(user.id)}
                          >
                            <MdDeleteOutline
                              className="text-red-500"
                              size={22}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
          {filteredData.length === 0 && (
            <div className="w-full flex items-center justify-center">
              No Item
            </div>
          )}
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
          className="bg-red-500 p-2 mx-4 rounded cursor-pointer text-white"
          onClick={handleSelectedDelete}
        >
          Delete Selected
        </button>
      </div>
    </>
  );
};

export default Table;
