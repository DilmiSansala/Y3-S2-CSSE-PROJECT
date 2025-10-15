const WasteRequest = require("../models/WasteRequest");


exports.getPeakMonitoring = async (req, res) => {
  try {
    const wasteRequests = await WasteRequest.find().populate("collectionCenter");

    if (!wasteRequests.length) {
      return res.status(200).json([]); // empty is OK for the UI
    }

    const peakData = {};
    for (const r of wasteRequests) {
      const date = (r.collectionDate ? new Date(r.collectionDate) : new Date())
        .toISOString().split("T")[0];
      const time = (r.collectionTime || "00:00").trim();
      const center = r.collectionCenter?.name || "Unknown Center";

      if (!peakData[date]) peakData[date] = {};
      if (!peakData[date][time]) peakData[date][time] = {};
      if (!peakData[date][time][center]) peakData[date][time][center] = 0;

      const qn = Number(r.quantity);
      peakData[date][time][center] += Number.isFinite(qn) ? qn : 0;
    }

    const peakPeriods = [];
    for (const d of Object.keys(peakData)) {
      for (const t of Object.keys(peakData[d])) {
        for (const c of Object.keys(peakData[d][t])) {
          peakPeriods.push({ date: d, time: t, center: c, totalQuantity: peakData[d][t][c] });
        }
      }
    }

    // highest first (optional)
    peakPeriods.sort((a, b) => b.totalQuantity - a.totalQuantity);

    return res.status(200).json(peakPeriods);
  } catch (error) {
    console.error("Peak monitoring failed:", error);
    return res.status(500).json({ message: "Failed to calculate peak periods.", error: String(error?.message || error) });
  }
};