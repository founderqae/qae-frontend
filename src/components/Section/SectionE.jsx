import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SectionE = ({ formData = {}, setFormData, onNext, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [researchData, setResearchData] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);

  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch year configuration
        const yearRes = await fetch('http://localhost:5000/api/config/year', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!yearRes.ok) {
          throw new Error('Failed to fetch year configuration');
        }
        const yearData = await yearRes.json();
        const fetchedYears = [yearData.p, yearData.pMinus1, yearData.pMinus2];
        setYears(fetchedYears);

        // Initialize empty data structure
        const emptyYears = fetchedYears.reduce((acc, y) => ({ ...acc, [y]: '' }), {});

        // Fetch Section E data
        const sectionRes = await fetch('http://localhost:5000/api/submit/submissions/section-e', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let sectionData = null;
        if (sectionRes.ok) {
          sectionData = await sectionRes.json();
          setSubmissionId(sectionData.submissionId);
        }

        // Map fetched data or use empty
        const journals = {
          sci: { ...emptyYears },
          scie: { ...emptyYears },
          scopus: { ...emptyYears },
        };
        const patents = {
          published: { ...emptyYears },
          granted: { ...emptyYears },
          commercialized: { ...emptyYears },
        };
        const incubation = {
          centers: { ...emptyYears },
        };

        // Helper to get unique particulars and sum amounts per year
        const getArrayData = (items) => {
          const projectsMap = new Map();
          items.forEach((item) => {
            const key = item.particular;
            if (!projectsMap.has(key)) {
              projectsMap.set(key, fetchedYears.reduce((acc, y) => ({ ...acc, [y]: 0 }), {}));
            }
            const amounts = projectsMap.get(key);
            amounts[item.year] += item.amount;
          });
          let arrayData = Array.from(projectsMap, ([particular, amounts], index) => ({
            id: index + 1,
            particular,
            ...fetchedYears.reduce((acc, y) => ({ ...acc, [y]: amounts[y].toString() }), {}),
          }));
          if (arrayData.length === 0) {
            arrayData = [
              { id: 1, particular: '', ...emptyYears },
              { id: 2, particular: '', ...emptyYears },
            ];
          }
          return arrayData;
        };

        let conferences = [
          { id: 1, particular: 'Scopus Indexed', ...emptyYears },
        ];
        let projects = getArrayData(sectionData?.researchProjects || []);
        let grants = getArrayData(sectionData?.researchGrants || []);
        let consultancy = getArrayData(sectionData?.consultancies || []);
        let seedMoney = getArrayData(sectionData?.seedMoneys || []);

        if (sectionData) {
          // Map journals
          sectionData.journalPublications.forEach((jp) => {
            journals.sci[jp.year] = jp.sci.toString();
            journals.scie[jp.year] = jp.scieWos.toString();
            journals.scopus[jp.year] = jp.scopus.toString();
          });
          // Map conferences (sum if multiple, but since no particular, use first row)
          sectionData.conferenceBooks.forEach((cb) => {
            conferences[0][cb.year] = (parseInt(conferences[0][cb.year] || 0) + cb.scopus).toString();
          });
          // Map patents
          sectionData.patents.forEach((pt) => {
            patents.published[pt.year] = pt.published.toString();
            patents.granted[pt.year] = pt.granted.toString();
            patents.commercialized[pt.year] = pt.commercialized.toString();
          });
          // Incubation
          sectionData.incubationCentres.forEach((ic) => {
            incubation.centers[ic.year] = ic.count.toString();
          });
        }

        setResearchData({
          journals,
          conferences,
          patents,
          projects,
          grants,
          consultancy,
          seedMoney,
          incubation,
          sectionEDriveLink: sectionData?.sectionEDriveLink || '',
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handlers for input changes
  const handleInputChange = (section, field, year, value) => {
    setResearchData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...prev[section][field],
          [year]: value,
        },
      },
    }));
  };

  const handleArrayInputChange = (section, id, field, value) => {
    setResearchData((prev) => ({
      ...prev,
      [section]: prev[section].map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      ),
    }));
  };

  // Add and remove rows for array-based sections
  const addRow = (section) => {
    const newId = Math.max(...researchData[section].map((row) => row.id), 0) + 1;
    const emptyYears = years.reduce((acc, y) => ({ ...acc, [y]: '' }), {});
    setResearchData((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        { id: newId, particular: '', ...emptyYears },
      ],
    }));
  };

  const removeRow = (section) => {
    setResearchData((prev) => ({
      ...prev,
      [section]: prev[section].slice(0, -1),
    }));
  };

  // Calculate patent percentage
  const calculatePatentPercentage = (year) => {
    const published = parseInt(researchData.patents.published[year]) || 0;
    const granted = parseInt(researchData.patents.granted[year]) || 0;
    return published > 0 ? ((granted / published) * 100).toFixed(1) : '0.0';
  };

  // Calculate totals for array-based sections
  const calculateTotal = (section) => {
    return years.reduce((totals, year) => ({
      ...totals,
      [year]: researchData[section].reduce((sum, item) => sum + (parseFloat(item[year]) || 0), 0),
    }), {});
  };

  // Calculate overall total for incubation centers
  const calculateIncubationTotal = () => {
    return years.reduce((sum, year) => sum + (parseInt(researchData.incubation.centers[year]) || 0), 0);
  };

  // Sync with formData
  useEffect(() => {
    if (researchData) {
      setFormData({
        ...formData,
        research: researchData,
      });
    }
  }, [researchData, setFormData, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        journalPublications: years.map((year) => ({
          year,
          sci: parseInt(researchData.journals.sci[year]) || 0,
          scieWos: parseInt(researchData.journals.scie[year]) || 0,
          scopus: parseInt(researchData.journals.scopus[year]) || 0,
        })),
        conferenceBooks: years.map((year) => ({
          year,
          scopus: researchData.conferences.reduce((sum, row) => sum + (parseInt(row[year]) || 0), 0),
        })),
        patents: years.map((year) => ({
          year,
          published: parseInt(researchData.patents.published[year]) || 0,
          granted: parseInt(researchData.patents.granted[year]) || 0,
          percentage: parseFloat(calculatePatentPercentage(year)) || 0,
          commercialized: parseInt(researchData.patents.commercialized[year]) || 0,
        })),
        researchProjects: researchData.projects.flatMap((row) =>
          years.map((year) => {
            const amount = parseFloat(row[year]) || 0;
            if (amount > 0 && row.particular.trim()) {
              return { particular: row.particular, year, amount };
            }
            return null;
          })
        ).filter(Boolean),
        researchGrants: researchData.grants.flatMap((row) =>
          years.map((year) => {
            const amount = parseFloat(row[year]) || 0;
            if (amount > 0 && row.particular.trim()) {
              return { particular: row.particular, year, amount };
            }
            return null;
          })
        ).filter(Boolean),
        consultancies: researchData.consultancy.flatMap((row) =>
          years.map((year) => {
            const amount = parseFloat(row[year]) || 0;
            if (amount > 0 && row.particular.trim()) {
              return { particular: row.particular, year, amount };
            }
            return null;
          })
        ).filter(Boolean),
        seedMoneys: researchData.seedMoney.flatMap((row) =>
          years.map((year) => {
            const amount = parseFloat(row[year]) || 0;
            if (amount > 0 && row.particular.trim()) {
              return { particular: row.particular, year, amount };
            }
            return null;
          })
        ).filter(Boolean),
        incubationCentres: years.map((year) => ({
          year,
          count: parseInt(researchData.incubation.centers[year]) || 0,
        })),
        sectionEDriveLink: researchData.sectionEDriveLink,
      };

      const method = submissionId ? 'PUT' : 'POST';
      const res = await fetch('http://localhost:5000/api/submit/submissions/section-e', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to submit');
      }

      const resData = await res.json();
      setSubmissionId(resData.submissionId);
      alert(method === 'POST' ? "Section E submitted successfully" : "Section E updated successfully");
      onNext(); // Proceed to next step after successful submission
    } catch (error) {
      console.error('Error submitting Section E:', error);
      alert("Failed to submit Section E");
    } finally {
      setLoading(false);
    }
  };

  if (!researchData || years.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Section E: Research
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Provide detailed information about research activities, including publications, patents, grants, consultancy, and incubation centers for the last three academic years.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Publication of Journals */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Publication of Journals</h2>
              <p className="text-teal-100">Details of journal publications for the last three academic years</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Sl.No</th>
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Journals</th>
                      {years.map((year) => (
                        <th key={year} className="text-center p-4 font-semibold text-gray-900 border-b border-teal-200">
                          {year}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, journal: 'SCI Indexed', key: 'sci' },
                      { id: 2, journal: 'SCIE/WoS Indexed', key: 'scie' },
                      { id: 3, journal: 'Scopus Indexed', key: 'scopus' },
                    ].map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-gray-900">{item.id}</td>
                        <td className="p-4 text-gray-900 font-medium">{item.journal}</td>
                        {years.map((year) => (
                          <td key={year} className="p-4">
                            <input
                              type="number"
                              placeholder="0"
                              value={researchData.journals[item.key][year]}
                              onChange={(e) => handleInputChange('journals', item.key, year, e.target.value)}
                              className="w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Publication of Conference/Book Chapters */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Publication of Conference/Book Chapters</h2>
              <p className="text-teal-100">Details of conference papers and book chapters for the last three academic years</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Sl.No</th>
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Conference/Book Chapters</th>
                      {years.map((year) => (
                        <th key={year} className="text-center p-4 font-semibold text-gray-900 border-b border-teal-200">
                          {year}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {researchData.conferences.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-gray-900">{row.id}</td>
                        <td className="p-4">
                          <input
                            type="text"
                            placeholder="Enter details"
                            value={row.particular}
                            onChange={(e) => handleArrayInputChange('conferences', row.id, 'particular', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          />
                        </td>
                        {years.map((year) => (
                          <td key={year} className="p-4">
                            <input
                              type="number"
                              placeholder="0"
                              value={row[year]}
                              onChange={(e) => handleArrayInputChange('conferences', row.id, year, e.target.value)}
                              className="w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => addRow('conferences')}
                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    + Add more rows if required
                  </button>
                  {researchData.conferences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow('conferences')}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      - Remove last row
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details of Patents and Its Grant */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Details of Patents and Its Grant</h2>
              <p className="text-teal-100">Details of patents published, granted, and commercialized</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Sl.No</th>
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Particulars</th>
                      {years.map((year) => (
                        <th key={year} className="text-center p-4 font-semibold text-gray-900 border-b border-teal-200">
                          {year}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, particular: 'No. of patents published', key: 'published' },
                      { id: 2, particular: 'No. of patents granted', key: 'granted' },
                      { id: 3, particular: 'Percentage', key: 'percentage' },
                      { id: 4, particular: 'No. of patents commercialized', key: 'commercialized' },
                    ].map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-gray-900">{item.id}</td>
                        <td className="p-4 text-gray-900 font-medium">{item.particular}</td>
                        {years.map((year) => (
                          <td key={year} className="p-4">
                            {item.key === 'percentage' ? (
                              <div className="px-3 py-2 text-center bg-gray-100 rounded-lg text-gray-700 font-medium">
                                {calculatePatentPercentage(year)}%
                              </div>
                            ) : (
                              <input
                                type="number"
                                placeholder="0"
                                value={researchData.patents[item.key][year]}
                                onChange={(e) => handleInputChange('patents', item.key, year, e.target.value)}
                                className="w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Details of Research Projects */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Details of Research Projects (Government Only)</h2>
              <p className="text-teal-100">Government-funded research projects</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Sl.No</th>
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Particulars</th>
                      {years.map((year) => (
                        <th key={year} className="text-center p-4 font-semibold text-gray-900 border-b border-teal-200">
                          {year} (₹)
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {researchData.projects.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-gray-900">{row.id}</td>
                        <td className="p-4">
                          <input
                            type="text"
                            placeholder="Enter project details"
                            value={row.particular}
                            onChange={(e) => handleArrayInputChange('projects', row.id, 'particular', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          />
                        </td>
                        {years.map((year) => (
                          <td key={year} className="p-4">
                            <input
                              type="number"
                              placeholder="0"
                              value={row[year]}
                              onChange={(e) => handleArrayInputChange('projects', row.id, year, e.target.value)}
                              className="w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-teal-50 font-semibold">
                      <td className="p-4 text-gray-900" colSpan="2">Total</td>
                      {years.map((year) => (
                        <td key={year} className="p-4 text-center text-gray-900">
                          ₹{calculateTotal('projects')[year].toLocaleString('en-IN')}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => addRow('projects')}
                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    + Add more rows if required
                  </button>
                  {researchData.projects.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeRow('projects')}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      - Remove last row
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details of Research Grants */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Details of Research Grants (Government Only)</h2>
              <p className="text-teal-100">Government-funded grants for FDP/STTP and others</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Sl.No</th>
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Particulars</th>
                      {years.map((year) => (
                        <th key={year} className="text-center p-4 font-semibold text-gray-900 border-b border-teal-200">
                          {year} (₹)
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {researchData.grants.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-gray-900">{row.id}</td>
                        <td className="p-4">
                          <input
                            type="text"
                            placeholder="Enter grant details"
                            value={row.particular}
                            onChange={(e) => handleArrayInputChange('grants', row.id, 'particular', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          />
                        </td>
                        {years.map((year) => (
                          <td key={year} className="p-4">
                            <input
                              type="number"
                              placeholder="0"
                              value={row[year]}
                              onChange={(e) => handleArrayInputChange('grants', row.id, year, e.target.value)}
                              className="w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-teal-50 font-semibold">
                      <td className="p-4 text-gray-900" colSpan="2">Total</td>
                      {years.map((year) => (
                        <td key={year} className="p-4 text-center text-gray-900">
                          ₹{calculateTotal('grants')[year].toLocaleString('en-IN')}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => addRow('grants')}
                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    + Add more rows if required
                  </button>
                  {researchData.grants.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeRow('grants')}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      - Remove last row
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details of Consultancy Works */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Details of Consultancy Works by Faculty/Student</h2>
              <p className="text-teal-100">Consultancy works including private research grants</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Sl.No</th>
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Particulars</th>
                      {years.map((year) => (
                        <th key={year} className="text-center p-4 font-semibold text-gray-900 border-b border-teal-200">
                          {year} (₹)
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {researchData.consultancy.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-gray-900">{row.id}</td>
                        <td className="p-4">
                          <input
                            type="text"
                            placeholder="Enter consultancy details"
                            value={row.particular}
                            onChange={(e) => handleArrayInputChange('consultancy', row.id, 'particular', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          />
                        </td>
                        {years.map((year) => (
                          <td key={year} className="p-4">
                            <input
                              type="number"
                              placeholder="0"
                              value={row[year]}
                              onChange={(e) => handleArrayInputChange('consultancy', row.id, year, e.target.value)}
                              className="w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-teal-50 font-semibold">
                      <td className="p-4 text-gray-900" colSpan="2">Total</td>
                      {years.map((year) => (
                        <td key={year} className="p-4 text-center text-gray-900">
                          ₹{calculateTotal('consultancy')[year].toLocaleString('en-IN')}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => addRow('consultancy')}
                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    + Add more rows if required
                  </button>
                  {researchData.consultancy.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeRow('consultancy')}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      - Remove last row
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details of Seed Money */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Details of Seed Money Received and Utilized</h2>
              <p className="text-teal-100">Seed money received and utilized by faculty</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Sl.No</th>
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Particulars</th>
                      {years.map((year) => (
                        <th key={year} className="text-center p-4 font-semibold text-gray-900 border-b border-teal-200">
                          {year} (₹)
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {researchData.seedMoney.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-gray-900">{row.id}</td>
                        <td className="p-4">
                          <input
                            type="text"
                            placeholder="Enter seed money details"
                            value={row.particular}
                            onChange={(e) => handleArrayInputChange('seedMoney', row.id, 'particular', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          />
                        </td>
                        {years.map((year) => (
                          <td key={year} className="p-4">
                            <input
                              type="number"
                              placeholder="0"
                              value={row[year]}
                              onChange={(e) => handleArrayInputChange('seedMoney', row.id, year, e.target.value)}
                              className="w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-teal-50 font-semibold">
                      <td className="p-4 text-gray-900" colSpan="2">Total</td>
                      {years.map((year) => (
                        <td key={year} className="p-4 text-center text-gray-900">
                          ₹{calculateTotal('seedMoney')[year].toLocaleString('en-IN')}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => addRow('seedMoney')}
                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    + Add more rows if required
                  </button>
                  {researchData.seedMoney.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeRow('seedMoney')}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      - Remove last row
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details of Incubation Centres */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Details of Incubation Centres</h2>
              <p className="text-teal-100">Incubation centers registered with MSME/DPIIT</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="text-left p-4 font-semibold text-gray-900 border-b border-teal-200">Particulars</th>
                      {years.map((year) => (
                        <th key={year} className="text-center p-4 font-semibold text-gray-900 border-b border-teal-200">
                          {year}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 text-gray-900 font-medium">No. of Centres</td>
                      {years.map((year) => (
                        <td key={year} className="p-4">
                          <input
                            type="number"
                            placeholder="0"
                            value={researchData.incubation.centers[year]}
                            onChange={(e) => handleInputChange('incubation', 'centers', year, e.target.value)}
                            className="w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          />
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-teal-50 font-semibold">
                      <td className="p-4 text-gray-900">Overall Total</td>
                      <td className="p-4 text-center text-gray-900" colSpan={years.length}>
                        {calculateIncubationTotal()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section E Drive Link */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Drive Link</h2>
            <p className="text-gray-600 mb-6">Provide a common Google Drive link for verification of all Section E data</p>
            <input
              type="text"
              placeholder="https://drive.google.com/..."
              value={researchData.sectionEDriveLink}
              onChange={(e) => setResearchData((prev) => ({ ...prev, sectionEDriveLink: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Section D
              </button>
            )}
            <div className="flex space-x-4 ml-auto">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <>
                    Complete Application
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="text-center mt-12 pt-8 border-t border-teal-200">
          <p className="text-gray-600">
            Need help? Contact our support team at{" "}
            <a href="mailto:founderqae@gmail.com" className="text-teal-600 hover:text-teal-700 font-medium">
              founderqae@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionE;