import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import caseService from "../../services/case.service.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ active: 0, resolved: 0, total: 0 });
  const [recentCases, setRecentCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, casesRes] = await Promise.all([
          caseService.getStats(),
          caseService.getMyCases(),
        ]);

        if (statsRes.success && statsRes.stats) {
          const { total = 0, pending = 0, inProgress = 0, resolved = 0 } = statsRes.stats;
          setStats({
            active: pending + inProgress,
            resolved,
            total,
          });
        }

        if (casesRes.success && casesRes.cases) {
          setRecentCases(casesRes.cases.slice(0, 3));
        }
      } catch (err) {
        console.error("[StudentDashboard] Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading dashboard metrics..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Active Concerns"
          value={stats.active}
          borderColor="border-yellow-400"
          subtext="Pending & In-Progress cases"
        />
        <StatCard
          label="Resolved"
          value={stats.resolved}
          borderColor="border-green-500"
          subtext="Successfully closed issues"
        />
        <StatCard
          label="Total Filed"
          value={stats.total}
          borderColor="border-black"
          subtext="All grievances submitted"
        />
      </div>

      {/* Quick Action Banner */}
      <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-white via-white to-gray-50 border border-white shadow-sm">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Have an unresolved academic or campus issue?
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            Submit a formal grievance directly to the responsible university department. Track every update in real-time.
          </p>
        </div>
        <Link
          to="/student/new-grievance"
          className="bg-black text-white px-7 py-3 rounded-full text-sm font-bold hover:bg-gray-800 hover:scale-105 transition shadow-lg flex-shrink-0"
        >
          + File New Grievance
        </Link>
      </div>

      {/* Recent Grievances Table */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-serif font-bold text-xl text-gray-900">Recent Cases</h3>
            <p className="text-xs text-gray-500 mt-0.5">Your latest filed grievances</p>
          </div>
          <Link
            to="/student/cases"
            className="text-xs font-bold text-black underline hover:text-gray-600 transition"
          >
            View All Cases →
          </Link>
        </div>

        {recentCases.length === 0 ? (
          <EmptyState
            message="No cases yet. File your first grievance!"
            action={
              <Link
                to="/student/new-grievance"
                className="inline-block bg-black text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition"
              >
                File Grievance
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentCases.map((c) => (
                  <tr key={c.caseId} className="hover:bg-gray-50/60 transition group">
                    <td className="py-4 px-4 text-gray-600 font-medium">{c.category}</td>
                    <td className="py-4 px-4 font-semibold text-black max-w-xs truncate">
                      {c.subject}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => navigate(`/student/cases/${c.caseId}`)}
                        className="text-xs font-bold underline text-black hover:text-gray-600 transition"
                      >
                        Check →
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

export default StudentDashboard;
