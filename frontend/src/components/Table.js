// frontend/src/components/Table.js
import React from "react";
import "bulma/css/bulma.min.css";

const Table = ({
  data,
  columns,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  if (!data || data.length === 0) {
    return <p>Tidak ada data untuk ditampilkan.</p>;
  }

  return (
    <>
      <div className="table-container">
        <table className="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav
          className="pagination is-centered"
          role="navigation"
          aria-label="pagination"
        >
          <button
            className="pagination-previous"
            onClick={onPrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="pagination-next"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
          >
            Next page
          </button>
          <ul className="pagination-list">
            <li>
              <span className="pagination-link is-current">
                Halaman {currentPage} dari {totalPages}
              </span>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Table;
