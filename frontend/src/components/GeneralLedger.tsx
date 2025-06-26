import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GeneralLedger.css'; // optional
import { PDFDocument, StandardFonts } from "pdf-lib";
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';


interface Account {
  account_id: number;
  account_number: string;
  account_name: string;
}

interface LedgerLine {
  line_id: number;
  journal_entry: string;
  memo: string | null;
  debit: string | null;
  credit: string | null;
  running_balance: string;
}

const GeneralLedger: React.FC = () => {
  const [searchParams] = useSearchParams();
  const fromTrialBalance = searchParams.get('fromTrialBalance') === 'true';
  const defaultAccount = searchParams.get('account');
  const defaultStart = searchParams.get('start');
  const defaultEnd = searchParams.get('end');

  const [accountId, setAccountId] = useState<number | ''>(defaultAccount ? Number(defaultAccount) : '');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [ledgerData, setLedgerData] = useState<LedgerLine[]>([]);
  const [startDate, setStartDate] = useState(defaultStart || '');
  const [endDate, setEndDate] = useState(defaultEnd || '');
  const navigate = useNavigate();



  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    const centreId = sessionStorage.getItem('centreId');
  
    // Load chart of accounts
    axios.get(`/api/chart-of-accounts/?centre=${centreId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const sortedAccounts = res.data.sort((a: Account, b: Account) =>
        Number(a.account_number) - Number(b.account_number)
      );
      setAccounts(sortedAccounts);
    });
  
    // 💾 Load and store centre name
    axios.get(`/api/centres/`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const centre = res.data.find((c: any) => c.id.toString() === centreId);
      if (centre) {
        sessionStorage.setItem("centreName", centre.name);
      }
    });
  
  }, []);

  useEffect(() => {
    if (accountId) {
      fetchLedger();
    }
  }, [accountId, startDate, endDate]);
  
  
  const openJournalModal = (entryId: number) => {
    navigate(`/journal/${entryId}?account=${accountId}&start=${startDate}&end=${endDate}`);
  };
  
  
  const exportToPDF = async () => {
    const pdf   = await PDFDocument.create();
    let   page  = pdf.addPage([595, 842]);       // A4
    const font  = await pdf.embedFont(StandardFonts.Helvetica);
    let   y     = 800;                           // cursor

    const line = (txt: string, size = 10) =>
      page.drawText(txt, { x: 40, y, size, font });

    const centre   = sessionStorage.getItem("centreName") || "Unknown Centre";
    const prepared = sessionStorage.getItem("username")    || "Admin User";
    const rangeLbl = startDate && endDate ? `As of: ${startDate} – ${endDate}` : "";

    line("General Ledger Report", 14); y -= 20;
    line(`Centre: ${centre}`);               y -= 14;
    if (rangeLbl) { line(rangeLbl); y -= 14; }
    line(`Generated On: ${new Date().toLocaleString()}`);  y -= 14;
    line(`Prepared By: ${prepared}`);                      y -= 24;

    const col = [40, 140, 300, 380, 450, 520];
    ["Date","Entry","Memo","Debit","Credit","Balance"]
      .forEach((h,i)=>page.drawText(h,{x:col[i],y,size:10,font}));
    y -= 16;

    ledgerData.forEach(r => {
      [
        r.journal_entry.split(" on ")[1],
        r.journal_entry.split(" on ")[0],
        r.memo || "-",
        r.debit || "-",
        r.credit || "-",
        r.running_balance
      ].forEach((cell,i)=>page.drawText(String(cell),{x:col[i],y,size:10,font}));
      y -= 14;
      if (y < 50) { page = pdf.addPage([595,842]); y = 800; }
    });

    const blob = new Blob([await pdf.save()], { type: "application/pdf" });
    Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `general_ledger_${startDate||"all"}_${endDate||"all"}.pdf`
    }).click();
  };
  

  const fetchLedger = () => {
    if (!accountId) return;
  
    const token = sessionStorage.getItem('accessToken');
    const storedCentreId = sessionStorage.getItem('centreId');
    let url = `/api/ledger/account/${accountId}/`;
    const params = new URLSearchParams();

    if (storedCentreId) {
      params.append('journal_entry__centre', storedCentreId);
    }
    if (startDate) {
      params.append('start_date', startDate);
    }
    if (endDate) {
      params.append('end_date', endDate);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

  
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setLedgerData(res.data);
    });
  };
  

  return (
    <div className="ledger-container">
      <h2>General Ledger</h2>

      <div className="ledger-filters">
        <select
          value={accountId}
          onChange={(e) => setAccountId(Number(e.target.value))}
        >
          <option value="">Select Account</option>
          {accounts.map((a) => (
            <option key={a.account_id} value={a.account_id}>
              {a.account_number} - {a.account_name}
            </option>
          ))}
        </select>

        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>

        <label>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>


        <button onClick={fetchLedger}>Load Ledger</button>
      </div>

      <button onClick={exportToPDF}>Export PDF</button>

      {ledgerData.length > 0 && (
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Entry</th>
              <th>Memo</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {ledgerData.map((line) => (
              <tr key={line.line_id}>
                <td>{line.journal_entry?.split(' on ')[1]}</td>
                <td>
                <button onClick={() => openJournalModal(line.journal_id)}>
                  {line.journal_entry.split(' on ')[0]}
                </button>

                </td>

                <td>{line.memo || '-'}</td>
                <td>{line.debit || '-'}</td>
                <td>{line.credit || '-'}</td>
                <td>{line.running_balance}</td>
              </tr>
            ))}
            {fromTrialBalance && (
              <button onClick={() => navigate('/trial-balance')} style={{ marginBottom: "1rem" }}>
                ← Back to Trial Balance
              </button>
            )}

          </tbody>
        </table>
      )}
    </div>
  );
};

export default GeneralLedger;
