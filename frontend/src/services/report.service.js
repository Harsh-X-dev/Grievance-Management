import API, { BASE_URL } from "./api.js";

export const reportService = {
  /**
   * Download a binary report file (Excel or PDF)
   * @param {object} params - { period, format, department? }
   */
  downloadReport: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        searchParams.append(k, v);
      }
    });

    const qs = searchParams.toString();
    const url = `${BASE_URL}/reports/download${qs ? "?" + qs : ""}`;
    const token = API.getToken();

    try {
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
          success: false,
          message: data.message || `Download failed with HTTP ${res.status}`,
        };
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match
        ? match[1]
        : `report.${params.format === "pdf" ? "pdf" : "xlsx"}`;

      const downloadUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true, filename };
    } catch (err) {
      console.error("[ReportService] Download failed:", err);
      return {
        success: false,
        message: "Cannot connect to server. Report download failed.",
      };
    }
  },
};

export default reportService;
