import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import caseService from "../../services/case.service.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

export const AdminCases = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDepartmentCases = useCallback(async () => {
    try {
      const filters = {};
      if (statusFilter !== "All Status") filters.status = statusFilter;
      if (searchQuery.trim()) filters.search = searchQuery.trim();

      const result = await caseService.getDepartmentCases(filters);
      if (result.success && result.cases) {
        setCases(result.cases);
      }
    } catch (err) {
      console.error("[AdminCases] Error fetching cases:", err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDepartmentCases();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchDepartmentCases]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            Department Case List
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and respond to grievances submitted to your department
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
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
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs font-medium outline-none focus:bg-white focus:border-black transition"
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white shadow-sm">
        {isLoading ? (
          <LoadingSpinner text="Filtering cases..." />
        ) : cases.length === 0 ? (
          <EmptyState message="No cases found matching your filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Case ID</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cases.map((c) => {
                  const studentName = c.student?.name || c.studentName || "Student";
                  const initial = studentName.charAt(0).toUpperCase();

                  return (
                    <tr
                      key={c.caseId}
                      onClick={() => navigate(`/admin/cases/${c.caseId}`)}
                      className="hover:bg-gray-50/60 cursor-pointer transition group"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-gray-700 text-xs">
                        #{c.caseId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 leading-tight">
                              {studentName}
                            </p>
                            <p className="text-[11px] text-gray-400">{c.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-black max-w-sm truncate">
                        {c.subject}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={c.status} uppercase={true} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/cases/${c.caseId}`);
                          }}
                          className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-800 transition shadow-sm"
                        >
                          Manage →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCases;
