import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { saveAs } from "file-saver";
import { PDFDocument, StandardFonts } from "pdf-lib";
import Papa from "papaparse";


interface COA {
  account_id: number;
  account_number: string;
  account_name: string;
  account_type: string;
  is_active: boolean;
  centre: number;
  app_balance?: string;
  bank_balance?: string;
}

const COAList: React.FC = () => {
  const [coaList, setCoaList] = useState<COA[]>([]);
  const [filteredList, setFilteredList] = useState<COA[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showActive, setShowActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [centreName, setCentreName] = useState("Centre");
  const [sortField, setSortField] = useState<string>("account_number");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const toggleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    fetchCOAs();
    fetchCentreName();
  }, []);

  useEffect(() => {
    fetchCOAs(currentPage);
  }, [sortField, sortDirection]);
  

  // ✅ Fetch Centre Name
  const fetchCentreName = async () => {
    try {
      const centreId = sessionStorage.getItem("centreId");
      if (!centreId) {
        console.error("Centre ID not found in sessionStorage");
        return;
      }
  
      const response = await apiClient.get(`/api/centres/${centreId}/`);  // ✅ New API route
      setCentreName(response.data.name);
    } catch (error) {
      console.error("Error fetching centre name:", error);
    }
  };
  
  

  // ✅ Fetch COAs with Balances
  const fetchCOAs = async (page = 1) => {
    try {
      const centreId = sessionStorage.getItem("centreId");
      if (!centreId) {
        console.error("Centre ID not found in sessionStorage");
        return;
      }

      const coaResponse = await apiClient.get(`/api/coa/?centre=${centreId}&page=${page}`);
      let coaData: COA[] = coaResponse.data.results || [];

      const balanceResponse = await apiClient.get(`/api/account_balances/?centre=${centreId}`);
      let balanceData = balanceResponse.data.results || [];

      // ✅ Merge COA list with balances
      const mergedData = coaData.map((coa) => {
        const balance = balanceData.find((b: any) => b.account === coa.account_id);
        return {
          ...coa,
          app_balance: balance ? balance.app_balance : "N/A",
          bank_balance: ["Bank", "Credit Card"].includes(coa.account_type) ? balance?.bank_balance || "N/A" : "-",
        };
      });

      const sortedData = [...mergedData].sort((a, b) => {
        const aVal = a[sortField as keyof COA];
        const bVal = b[sortField as keyof COA];
      
        if (aVal === undefined || bVal === undefined) return 0;
      
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
      
        if (typeof aVal === "boolean" && typeof bVal === "boolean") {
          return sortDirection === "asc"
            ? Number(aVal) - Number(bVal)
            : Number(bVal) - Number(aVal);
        }
      
        return 0;
      });

      setCoaList(sortedData);
      setFilteredList(sortedData);

      setTotalPages(Math.ceil(coaResponse.data.count / 50));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching COAs or balances:", error);
    }
  };

  // ✅ Handle Pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchCOAs(newPage);
    }
  };

  // ✅ Export CSV with Centre Name
  const exportCSV = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    const fileName = `COA_${centreName.replace(/\s+/g, "_")}_${dateStr}.csv`;

    const csvData = Papa.unparse(
      filteredList.map(({ account_number, account_name, account_type, is_active, app_balance, bank_balance }) => ({
        Account_Number: account_number,
        Account_Name: account_name,
        Type: account_type,
        Status: is_active ? "Active" : "Inactive",
        App_Balance: app_balance,
        Bank_Balance: bank_balance,
      }))
    );

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  };

  // ✅ Export PDF with Centre Name
  const exportPDF = async () => {
  const dateStr  = new Date().toISOString().split("T")[0];
  const fileName = `COA_${centreName.replace(/\s+/g, "_")}_${dateStr}.pdf`;

  const pdf  = await PDFDocument.create();
  let   page = pdf.addPage([595, 842]);     // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let   y    = 800;

  const line = (txt: string, size = 12) =>
    page.drawText(txt, { x: 40, y, size, font });

  line(`Chart of Accounts – ${centreName}`, 14);
  y -= 24;

  const cols = [40, 140, 320, 400, 470, 540];          // adjust if needed
  const drawRow = (cells: (string | number)[], bold = false) => {
    cells.forEach((c, i) =>
      page.drawText(String(c), { x: cols[i], y, size: 9, font })
    );
    y -= 14;
    if (y < 50) { page = pdf.addPage([595, 842]); y = 800; }
  };

  drawRow(
    ["Acct #", "Name", "Type", "Status", "App Bal", "Bank Bal"],
    true
  );

  filteredList.forEach((c) =>
    drawRow([
      c.account_number,
      c.account_name,
      c.account_type,
      c.is_active ? "Active" : "Inactive",
      c.app_balance ?? "-",
      c.bank_balance ?? "-"
    ])
  );

  const blob = new Blob([await pdf.save()], { type: "application/pdf" });
  Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: fileName
  }).click();
};


  return (
    <div>
      <h2>Chart of Accounts List - {centreName}</h2>

      {/* Filtering Controls */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by Account Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="Revenue">Revenue</option>
          <option value="Expense">Expense</option>
          <option value="Asset">Asset</option>
          <option value="Liability">Liability</option>
          <option value="Equity">Equity</option>
          <option value="Bank">Bank</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Cost of Good Sold">Cost of Good Sold</option>
        </select>
        <label>
          <input type="checkbox" checked={showActive} onChange={() => setShowActive(!showActive)} /> Show Active Only
        </label>
      </div>

      {/* Export Buttons */}
      <button onClick={exportCSV}>Export CSV</button>
      <button onClick={exportPDF}>Export PDF</button>

      {/* COA Table */}
      <table>
      <thead>
        <tr>
          <th onClick={() => toggleSort("account_number")}>
            Account Number {sortField === "account_number" && (sortDirection === "asc" ? "▲" : "▼")}
          </th>
          <th onClick={() => toggleSort("account_name")}>
            Account Name {sortField === "account_name" && (sortDirection === "asc" ? "▲" : "▼")}
          </th>
          <th onClick={() => toggleSort("account_type")}>
            Type {sortField === "account_type" && (sortDirection === "asc" ? "▲" : "▼")}
          </th>
          <th onClick={() => toggleSort("is_active")}>
            Status {sortField === "is_active" && (sortDirection === "asc" ? "▲" : "▼")}
          </th>
          <th>App Balance</th>
          <th>Bank Balance</th>
        </tr>
      </thead>

        <tbody>
          {filteredList.map((coa) => (
            <tr key={coa.account_id}>
              <td>{coa.account_number}</td>
              <td>{coa.account_name}</td>
              <td>{coa.account_type}</td>
              <td>{coa.is_active ? "Active" : "Inactive"}</td>
              <td>{coa.app_balance}</td>
              <td>{coa.bank_balance}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default COAList;
