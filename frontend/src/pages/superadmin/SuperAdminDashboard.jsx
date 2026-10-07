import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import caseService from "../../services/case.service.js";
import adminService from "../../services/admin.service.js";
import StatCard from "../../components/common/StatCard.jsx";
import DeptBarChart from "../../components/superadmin/DeptBarChart.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    escalated: 0,
    pending: 0,
    inProgress: 0,
  });
  const [adminCount, setAdminCount] = useState(0);
  const [allCases, setAllCases] = useState([]);
  const [recentEscalated, setRecentEscalated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [statsRes, allCasesRes, adminsRes, escalatedRes] = await Promise.all([
          caseService.getStats(),
          caseService.getAllCases(),
          adminService.getAdmins(),
          caseService.getEscalatedCases(),
        ]);

        if (statsRes.success && statsRes.stats) {
          setStats({
            total: statsRes.stats.total || 0,
            resolved: statsRes.stats.resolved || 0,
            escalated: statsRes.stats.escalated || 0,
            pending: statsRes.stats.pending || 0,
            inProgress: statsRes.stats.inProgress || 0,
          });
        }

        if (adminsRes.success && adminsRes.admins) {
          setAdminCount(adminsRes.admins.length);
        }

        if (allCasesRes.success && allCasesRes.cases) {
          setAllCases(allCasesRes.cases);
        }

        if (escalatedRes.success && escalatedRes.cases) {
          setRecentEscalated(escalatedRes.cases.slice(0, 4));
        }
      } catch (err) {
        console.error("[SuperAdminDashboard] Error loading overview:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading campus-wide metrics & telemetry..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Top 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Grievances"
          value={stats.total}
          borderColor="border-black"
          subtext="Campus-wide submissions"
        />
        <StatCard
          label="Resolved Cases"
          value={stats.resolved}
          borderColor="border-green-500"
          subtext="Successfully closed"
        />
        <StatCard
          label="Active Escalations"
          value={stats.escalated}
          borderColor="border-red-500"
          subtext="Requires Super Admin action"
        />
        <StatCard
          label="Department Admins"
          value={adminCount}
          borderColor="border-blue-500"
          subtext="Active coordinators"
        />
      </div>

      {/* Main Row: 3D Department Bar Chart + Recent Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Cylinder Department Distribution Chart */}
        <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-3xl border border-white shadow-sm bg-white/80 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-gray-900">
                Department Distribution
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Total grievances filed per academic & campus department
              </p>
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {allCases.length} Total Records
            </span>
          </div>

          <DeptBarChart cases={allCases} />
        </div>

        {/* Recent Escalations Column */}
        <div className="glass-panel p-6 rounded-3xl border border-white shadow-sm bg-white/80 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif font-bold text-lg text-gray-900">
                Recent Escalations
              </h3>
              <Link
                to="/superadmin/escalated"
                className="text-xs font-bold text-red-600 hover:underline"
              >
                View All →
              </Link>
            </div>

            {recentEscalated.length === 0 ? (
              <EmptyState message="No escalated cases right now. All departments in order! 🎉" />
            ) : (
              <div className="space-y-3">
                {recentEscalated.map((c) => (
                  <div
                    key={c.caseId}
                    onClick={() =>
                      navigate(`/superadmin/cases/${c.caseId}`, {
                        state: { from: "overview" },
                      })
                    }
                    className="p-4 bg-gray-50/80 rounded-2xl border-l-4 border-red-500 cursor-pointer hover:bg-white hover:shadow-sm transition"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-gray-500">
                        #{c.caseId} • {c.department}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/superadmin/cases/${c.caseId}`, {
                            state: { from: "overview" },
                          });
                        }}
                        className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full hover:bg-red-100 transition"
                      >
                        Handle
                      </button>
                    </div>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {c.subject}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Shortcuts */}
          <div className="pt-6 border-t border-gray-100 mt-6 grid grid-cols-2 gap-2">
            <Link
              to="/superadmin/escalated"
              className="py-2.5 px-3 text-center text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 rounded-xl transition"
            >
              Escalated Issues
            </Link>
            <Link
              to="/superadmin/admins"
              className="py-2.5 px-3 text-center text-xs font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-xl transition"
            >
              Manage Admins
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
