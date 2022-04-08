import React, { useState, useEffect } from "react";
import "./table.css";

const Table = () => {
  const [data, setData] = useState(null);
  const [searchStr, setSearchStr] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      ).then((response) => response.json());
      setLoading(false);

      setData(res);
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (data) => {
    try {
      if (data && data?.length > 0) {
        const columns = data[0] && Object.keys(data[0]);

        return data.filter((row) => {
          return columns.some((column) => {
            return (
              row?.[column]
                ?.toString()
                ?.toLowerCase()
                ?.indexOf(searchStr?.toLowerCase()) > -1
            );
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const COLUMNS = [
    { id: "0", name: "srno", label: "Sr.No" },
    { id: "1", name: "name", label: "Name" },
    { id: "2", name: "email", label: "Email" },
    { id: "3", name: "phone", label: "Phone" },
    { id: "4", name: "address", label: "Address" },
  ];

  const paginationGroup = () => {
    let start = Math.floor((currentPage - 1) / rowsPerPage) * rowsPerPage;
    return new Array(rowsPerPage).fill().map((_, i) => start + i + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => page - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((page) => page + 1);
  };

  return (
    <>
      <div className="container">
        <div className="filter">
          <input
            type="text"
            placeholder="Search"
            value={searchStr}
            onChange={(event) => setSearchStr(event.target.value)}
          />
        </div>
        {loading && (
          <div>
            <b>Loading...</b>
          </div>
        )}
        <table className="table">
          <thead>
            <tr>
              {COLUMNS.map((column, i) => {
                return <th key={i + column.id}>{column.label}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {data && data?.length > 0
              ? handleSearch(
                  data?.slice(
                    currentPage === 1 ? 0 : currentPage * rowsPerPage,
                    currentPage * rowsPerPage + rowsPerPage
                  )
                )?.map((row, i) => {
                  return (
                    <tr key={i + row.id}>
                      <td>{row.id}</td>
                      <td>{row.name}</td>
                      <td>{row.email}</td>
                      <td>{row.phone}</td>
                      <td>{row.address?.city}</td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>

        <div className="pagination">
          <ul>
            {currentPage > 1 && (
              <li onClick={() => goToPreviousPage()}>
                <button type="button">Previous</button>
              </li>
            )}
            {paginationGroup()?.map((item, index) => (
              <li key={index} onClick={() => setCurrentPage(item)}>
                <button
                  type="button"
                  className={currentPage === item ? "active-page" : ""}
                >
                  {item}
                </button>
              </li>
            ))}
            {currentPage < rowsPerPage && (
              <li onClick={() => goToNextPage()}>
                <button type="button">Next</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Table;
