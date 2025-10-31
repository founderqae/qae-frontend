import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  FileDown,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../public/bglessqae.png"; // Adjust path if needed

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("engineering");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString() );
  const [bandFilter, setBandFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRankingReleased, setIsRankingReleased] = useState(false);
  const [colleges, setColleges] = useState([]);

  // ✅ Fetch rankings for selected year + category
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);

        // ✅ Check release status
        const statusRes = await axios.get(
          "https://qae-server.vercel.app/api/rankings/release-status",
          { params: { year: selectedYear } }
        );

        const released = statusRes.data?.isReleased || false;
        setIsRankingReleased(released);

        if (!released) {
          setColleges([]);
          return;
        }

        // ✅ Fetch all released rankings by year
        const res = await axios.get("https://qae-server.vercel.app/api/rankings/all", {
          params: { year: selectedYear },
        });

        const data = Array.isArray(res.data) ? res.data : [];

        // ✅ Filter by category
        const filteredByCategory = data.filter((college) =>
          activeTab === "engineering"
            ? college.category === "ENGINEERING"
            : college.category === "ARTS_SCIENCE"
        );

        // ✅ Map clean data
        setColleges(
          filteredByCategory.map((college) => ({
            name: college.collegeName,
            state: college.state,
            band: college.band || "N/A",
            website: college.website || "#",
            category: college.category,
            year: college.year || selectedYear,
          }))
        );
      } catch (error) {
        console.error("Error fetching rankings:", error);
        setColleges([]);
        setIsRankingReleased(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [selectedYear, activeTab]);

  // ✅ Generate unique states for filter dropdown
  const states = useMemo(() => {
    const uniqueStates = new Set(colleges.map((college) => college.state));
    return ["all", ...Array.from(uniqueStates)].sort();
  }, [colleges]);

  // ✅ Generate last 6 years
  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => (current - i).toString());
  }, []);

  // ✅ Apply search, filters, sorting
  const filteredData = useMemo(() => {
    let filtered = colleges.filter((college) => {
      const matchesSearch =
        college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.state.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState =
        selectedState === "all" || college.state === selectedState;
      const matchesYear = college.year.toString() === selectedYear;
      const matchesBand =
        bandFilter === "all" || college.band === bandFilter;
      return matchesSearch && matchesState && matchesYear && matchesBand;
    });

    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "state") {
      filtered.sort((a, b) => a.state.localeCompare(b.state));
    } else if (sortBy === "band") {
      const bandOrder = { "A++": 3, "A+": 2, A: 1 };
      filtered.sort((a, b) => (bandOrder[b.band] || 0) - (bandOrder[a.band] || 0));
    }

    return filtered;
  }, [colleges, searchQuery, selectedState, selectedYear, bandFilter, sortBy]);

  const getBandStyle = (band) => {
    if (band === "A++") return "text-yellow-500 font-bold";
    if (band === "A+") return "text-slate-500 font-bold";
    if (band === "A") return "text-amber-700 font-bold";
    return "text-gray-700 font-bold";
  };

  // ✅ Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const title = `QAE ${
      activeTab === "engineering" ? "Engineering" : "Arts & Science"
    } Colleges - ${selectedYear}`;
    const date = new Date().toLocaleDateString();

    doc.addImage(logo, "PNG", 14, 10, 20, 20);
    doc.setFontSize(20);
    doc.setTextColor(13, 148, 136);
    doc.text(title, 50, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 50, 30);

    const tableData = filteredData.map((college, index) => [
      index + 1,
      college.name,
      college.state,
      college.band,
      college.website,
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["S.No", "College Name", "State", "Band", "Website"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [13, 148, 136],
        textColor: 255,
      },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    doc.save(
      `${activeTab}_colleges_leaderboard_${selectedYear}_${date.replace(
        /\//g,
        "-"
      )}.pdf`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("engineering")}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
              activeTab === "engineering"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Engineering Colleges
          </button>
          <button
            onClick={() => setActiveTab("arts")}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
              activeTab === "arts"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Arts & Science Colleges
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading rankings...</p>
          </div>
        ) : !isRankingReleased ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Filter className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">
              Rankings Not Released
            </h2>
            <p className="text-slate-600 mt-2">
              The college rankings are not available yet. Please check back
              later.
            </p>
          </div>
        ) : (
          <>
            {/* Search + Filter Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search colleges or states..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-700"
                  />
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExportPDF}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                >
                  <FileDown className="w-5 h-5" />
                  Export PDF
                </button>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-slate-700 font-medium"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  {/* State Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      State
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-700"
                    >
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state === "all" ? "All States" : state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-700"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Band Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Band
                    </label>
                    <select
                      value={bandFilter}
                      onChange={(e) => setBandFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-700"
                    >
                      <option value="all">All Bands</option>
                      <option value="A++">A++ (Highest)</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-700"
                    >
                      <option value="name">Name (A–Z)</option>
                      <option value="state">State (A–Z)</option>
                      <option value="band">Band (High → Low)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Table Section */}
            <div className="mb-4 text-slate-600 font-medium">
              Showing {filteredData.length} of {colleges.length} colleges
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-teal-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">S.No</th>
                      <th className="px-6 py-4 text-left font-semibold">
                        College Name
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">State</th>
                      <th className="px-6 py-4 text-left font-semibold">Band</th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Website
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.length > 0 ? (
                      filteredData.map((college, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-slate-800">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-800">
                            {college.name}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {college.state}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-lg ${getBandStyle(college.band)}`}>
                              {college.band}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={college.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium"
                            >
                              Visit
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-lg font-medium text-slate-700">
                            No colleges found
                          </p>
                          <p className="text-sm text-slate-500">
                            Try adjusting your filters or search query
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
