import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import caseService from "../../services/case.service.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { formatShortDate } from "../../utils/formatters.js";

export const StudentCases = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const result = await caseService.getMyCases();
        if (result.success && result.cases) {
          setCases(result.cases);
        }
      } catch (err) {
        console.error("[StudentCases] Error fetching cases:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, []);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesStatus =
        statusFilter === "All Status" || c.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.caseId?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [cases, statusFilter, searchQuery]);

  if (isLoading) {
    return <LoadingSpinner text="Loading your cases..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">My Grievances</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Track and manage all cases filed by your account
          </p>
        </div>
        <Link
          to="/student/new-grievance"
          className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-gray-800 transition shadow-md self-start sm:self-auto"
        >
          + File Grievance
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between border border-white shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, subject, or category..."
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
            Filter:
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
        {filteredCases.length === 0 ? (
          <EmptyState
            message={
              searchQuery || statusFilter !== "All Status"
                ? "No grievances match your search or filter criteria."
                : "No cases found. You haven't filed any grievances yet."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Case ID</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCases.map((c) => (
                  <tr
                    key={c.caseId}
                    onClick={() => navigate(`/student/cases/${c.caseId}`)}
                    className="hover:bg-gray-50/60 cursor-pointer transition group"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">
                      #{c.caseId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-black max-w-sm truncate">
                      {c.subject}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {c.category}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs font-medium">
                      {formatShortDate(c.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-bold underline text-black group-hover:text-gray-600 transition">
                        View Details →
                      </span>
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

export default StudentCases;
