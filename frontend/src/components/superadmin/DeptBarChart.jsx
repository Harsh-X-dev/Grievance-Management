import React from "react";
import { DEPARTMENTS } from "../../constants/index.js";

const COLORS = ["#9dd2f3", "#f1d141", "#a8da42", "#efa36a", "#3cc6bd"];

const SHORT_NAMES = [
  "Academic\nAffairs",
  "Administration Department",
  "Facilities & Infrastructure",
  "IT\nSupport",
  "Student\nWelfare",
];

const GRADIENT_STOPS =
  "rgba(0,0,0,0.15) 0%, rgba(255,255,255,0.7) 20%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.2) 100%";

export const DeptBarChart = ({ cases = [] }) => {
  // Count per department
  const counts = {};
  DEPARTMENTS.forEach((d) => (counts[d] = 0));
  cases.forEach((c) => {
    if (counts[c.department] !== undefined) {
      counts[c.department]++;
    }
  });

  const max = Math.max(...Object.values(counts), 1);
  const MAX_BAR_PX = 160;
  const COL_W = 75;
  const BAR_W = 46;
  const TOTAL_H = MAX_BAR_PX + 70;

  return (
    <div style={{ position: "relative", width: "100%", height: `${TOTAL_H}px`, marginTop: "10px" }}>
      {/* Background Grid Lines */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: "20px",
          paddingBottom: "40px",
        }}
      >
        <div style={{ borderTop: "1px solid #f3f4f6", width: "100%" }}></div>
        <div style={{ borderTop: "1px solid #f3f4f6", width: "100%" }}></div>
        <div style={{ borderTop: "1px solid #f3f4f6", width: "100%" }}></div>
        <div style={{ borderTop: "1px dashed #e5e7eb", width: "100%" }}></div>
      </div>

      {/* 3D Cylinders */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          width: "100%",
          height: "100%",
          alignItems: "stretch",
          paddingTop: "10px",
        }}
      >
        {DEPARTMENTS.map((dept, i) => {
          const count = counts[dept] || 0;
          const barH = Math.max(Math.round((count / max) * MAX_BAR_PX), 10);
          const label = SHORT_NAMES[i];
          const color = COLORS[i];

          return (
            <div
              key={dept}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: `${COL_W}px`,
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "#374151",
                  lineHeight: 1.2,
                  marginBottom: "8px",
                }}
              >
                {count}
              </span>
              <div style={{ flex: 1 }}></div>

              <div
                style={{
                  position: "relative",
                  width: `${BAR_W}px`,
                  height: `${barH}px`,
                  backgroundColor: color,
                  backgroundImage: `linear-gradient(to right, ${GRADIENT_STOPS})`,
                  borderRadius: "0 0 6px 6px",
                  boxShadow: "2px 5px 8px rgba(0,0,0,0.15)",
                  transition: "height 0.55s cubic-bezier(.4,0,.2,1)",
                }}
              >
                {/* 3D Top Cap */}
                <div
                  style={{
                    position: "absolute",
                    top: "-7px",
                    left: 0,
                    width: "100%",
                    height: "14px",
                    backgroundColor: color,
                    borderRadius: "50%",
                    backgroundImage: `linear-gradient(to right, ${GRADIENT_STOPS})`,
                    boxShadow:
                      "inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0,0,0,0.1)",
                    zIndex: 2,
                  }}
                ></div>
              </div>

              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#6b7280",
                  textAlign: "center",
                  lineHeight: 1.3,
                  marginTop: "12px",
                  width: `${COL_W}px`,
                  whiteSpace: "pre-line",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeptBarChart;
