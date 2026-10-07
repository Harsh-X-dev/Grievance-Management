import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import caseService from "../../services/case.service.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { DEPARTMENTS } from "../../constants/index.js";

export const EscalatedCases = () => {
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState("Escalated"); // 'Escalated' | 'Resolved'
  const [deptFilter, setDeptFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCases = useCallback(async () => {
    try {
      const filters = {
        status: filterMode === "Escalated" ? "Escalated" : "Resolved",
      };
      if (deptFilter !== "all") filters.department = deptFilter;
      if (searchQuery.trim()) filters.search = searchQuery.trim();

      const result = await caseService.getAllCases(filters);
      if (result.success && result.cases) {
        setCases(result.cases);
      }
    } catch (err) {
      console.error("[EscalatedCases] Error loading cases:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filterMode, deptFilter, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCases();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchCases]);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            Escalated Cases
          </h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700">
            {cases.length} {filterMode === "Escalated" ? "Active" : "Resolved"}
          </span>
        </div>

        {/* Toggle Filter: Escalated vs Resolved */}
        <div className="flex items-center gap-1 bg-gray-200/60 p-1 rounded-full self-start sm:self-auto">
          <button
            onClick={() => setFilterMode("Escalated")}
            className={`px-4 py-2 text-xs font-bold rounded-full transition ${
              filterMode === "Escalated"
                ? "bg-black text-white shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Active Escalations
          </button>
          <button
            onClick={() => setFilterMode("Resolved")}
            className={`px-4 py-2 text-xs font-bold rounded-full transition ${
              filterMode === "Resolved"
                ? "bg-black text-white shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Resolved Escalations
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between border border-white shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case ID, student, or subject..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 pl-10 text-xs outline-none focus:bg-white focus:border-black transition"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Department:
          </label>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs font-medium outline-none focus:bg-white focus:border-black transition"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white shadow-sm">
        {isLoading ? (
          <LoadingSpinner text="Loading escalated grievances..." />
        ) : cases.length === 0 ? (
          <EmptyState
            message={`No ${filterMode.toLowerCase()} cases found in this department filter.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Case ID</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cases.map((c) => (
                  <tr
                    key={c.caseId}
                    onClick={() =>
                      navigate(`/superadmin/cases/${c.caseId}`, {
                        state: { from: "escalated" },
                      })
                    }
                    className="hover:bg-gray-50/60 cursor-pointer transition group"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-gray-700 text-xs">
                      #{c.caseId}
                    </td>
                    <td className="px-6 py-4 font-bold text-black max-w-sm truncate">
                      {c.subject}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {c.department || "General"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={c.status} uppercase={true} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/superadmin/cases/${c.caseId}`, {
                            state: { from: "escalated" },
                          });
                        }}
                        className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-800 transition shadow-sm"
                      >
                        Manage →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscalatedCases;
