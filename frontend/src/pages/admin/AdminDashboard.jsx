import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import caseService from "../../services/case.service.js";
import StatCard from "../../components/common/StatCard.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    escalated: 0,
    resolved: 0,
  });
  const [pendingCases, setPendingCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, casesRes] = await Promise.all([
          caseService.getStats(),
          caseService.getDepartmentCases({ status: "Pending" }),
        ]);

        if (statsRes.success && statsRes.stats) {
          setStats({
            pending: statsRes.stats.pending || 0,
            inProgress: statsRes.stats.inProgress || 0,
            escalated: statsRes.stats.escalated || 0,
            resolved: statsRes.stats.resolved || 0,
          });
        }

        if (casesRes.success && casesRes.cases) {
          setPendingCases(casesRes.cases.slice(0, 4));
        }
      } catch (err) {
        console.error("[AdminDashboard] Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading department statistics..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Pending"
          value={stats.pending}
          borderColor="border-yellow-400"
          subtext="Awaiting initial review"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          borderColor="border-blue-400"
          subtext="Under active investigation"
        />
        <StatCard
          label="Escalated"
          value={stats.escalated}
          borderColor="border-red-500"
          subtext="Handled by Super Admin"
        />
        <StatCard
          label="Resolved"
          value={stats.resolved}
          borderColor="border-green-500"
          subtext="Closed & confirmed"
        />
      </div>

      {/* Pending Cases Quick Action Table */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-serif font-bold text-xl text-gray-900">
              Pending Department Cases
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Grievances awaiting your department's initial response
            </p>
          </div>
          <Link
            to="/admin/cases"
            className="text-xs font-bold text-black underline hover:text-gray-600 transition"
          >
            View All Department Cases →
          </Link>
        </div>

        {pendingCases.length === 0 ? (
          <EmptyState message="No pending cases in your department queue. All caught up!" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pendingCases.map((c) => (
                  <tr key={c.caseId} className="hover:bg-gray-50/60 transition group">
                    <td className="py-4 px-4 font-mono text-xs font-bold text-gray-900">
                      #{c.caseId}
                    </td>
                    <td className="py-4 px-4 text-gray-700 font-medium">{c.category}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/cases/${c.caseId}`)}
                        className="text-black font-medium text-xs border border-gray-200 px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition shadow-sm"
                      >
                        Open Case →
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

export default AdminDashboard;
