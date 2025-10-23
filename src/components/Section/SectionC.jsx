
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const SectionC = ({ formData = {}, setFormData, onNext, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [sectionCDriveLink, setSectionCDriveLink] = useState('');
  const [years, setYears] = useState([]);
  const [existingData, setExistingData] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch year configuration and section data
  useEffect(() => {
    const fetchYearConfig = async () => {
      try {
        const yearRes = await axios.get('https://qae-server.vercel.app/api/config/year', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const yearConfig = yearRes.data;
        const yrs = [yearConfig.p, yearConfig.pMinus1, yearConfig.pMinus2];
        setYears(yrs);
        setLoading(true);
        // Fetch section C data after years are set
        const currentYear = new Date().getFullYear();
        const sectionRes = await axios.get(`https://qae-server.vercel.app/api/submit/submissions/section-c?year=${currentYear}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = sectionRes.data;
        setExistingData(!!data.submissionId);

        // Set states from data
        if (data) {
          // Specialization Data (admissions)
          const deptsMap = {};
          data.admissions.forEach(a => {
            if (!deptsMap[a.departmentName]) {
              deptsMap[a.departmentName] = { department: a.departmentName, ...yrs.reduce((acc, y) => ({ ...acc, [y]: { intake: '', filled: '' } }), {}) };
            }
            deptsMap[a.departmentName][a.year].intake = a.intake;
            deptsMap[a.departmentName][a.year].filled = a.filled;
          });
          const specData = Object.values(deptsMap).map((d, idx) => ({ id: idx + 1, ...d }));
          setSpecializationData(specData.length ? specData : initialSpecializationData);

          // Faculty Data
          const facultyMap = {};
          data.facultyDetails.forEach(f => {
            if (!facultyMap[f.departmentName]) {
              facultyMap[f.departmentName] = { department: f.departmentName, intake: f.intake, ...yrs.reduce((acc, y) => ({ ...acc, [y]: { prof: '', asp: '', ap: '' } }), {}) };
            }
            facultyMap[f.departmentName][f.year].prof = f.professors;
            facultyMap[f.departmentName][f.year].asp = f.associateProfessors;
            facultyMap[f.departmentName][f.year].ap = f.assistantProfessors;
          });
          const facData = Object.values(facultyMap).map((d, idx) => ({ id: idx + 1, ...d }));
          setFacultyData(facData.length ? facData : initialFacultyData);

          // PhD Data
          const phd = yrs.reduce((acc, y) => ({ ...acc, [y]: { total: '', phd: '' } }), {});
          data.phdInfos.forEach(p => {
            phd[p.year].total = p.totalFaculties;
            phd[p.year].phd = p.phdHolders;
          });
          setPhdData(phd);

          // Additional Academic
          setAdditionalAcademicData({
            avgTeachingExperience: data.averageTeachingExperience || '',
            creditsEarned: data.noOfCreditsEarned || '',
            contactHours: data.noOfContactHours || '',
            facultyBelowFeedbackThreshold: data.noOfFacultyBelowThreshold || '',
          });

          // Placement Data
          const placeMap = {};
          data.placements.forEach(pl => {
            if (!placeMap[pl.departmentName]) {
              placeMap[pl.departmentName] = { department: pl.departmentName, ...yrs.reduce((acc, y) => ({ ...acc, [y]: { a: '', b: '', c: '' } }), {}) };
            }
            placeMap[pl.departmentName][pl.year].a = pl.placements;
            placeMap[pl.departmentName][pl.year].b = pl.higherEducation;
            placeMap[pl.departmentName][pl.year].c = pl.entrepreneurship;
          });
          const placeData = Object.values(placeMap).map((d, idx) => ({ id: idx + 1, ...d }));
          setPlacementData(placeData.length ? placeData : initialPlacementData);

          // Placement Summary
          const sumMap = {};
          data.studentCounts.forEach(sc => {
            if (!sumMap[sc.departmentName]) {
              sumMap[sc.departmentName] = { department: sc.departmentName, ...yrs.reduce((acc, y) => ({ ...acc, [y]: { n: '', x: '' } }), {}) };
            }
            sumMap[sc.departmentName][sc.year].n = sc.n;
            sumMap[sc.departmentName][sc.year].x = sc.x;
          });
          const sumData = Object.values(sumMap).map((d, idx) => ({ id: idx + 1, ...d }));
          setPlacementSummaryData(sumData.length ? sumData : initialPlacementSummaryData);

          // MoU Data
          const mou = yrs.reduce((acc, y) => ({ ...acc, [y]: '' }), {});
          data.activeMoUs.forEach(am => {
            mou[am.year] = am.count;
          });
          setMouData(mou);

          // Foreign MoU
          const foreignData = data.moUForeignUniversities.map((m, idx) => ({
            id: idx + 1,
            university: m.universityName,
            country: m.country,
            validUpto: m.validUpto ? m.validUpto.split('T')[0] : '',
            link: m.link,
          }));
          setForeignMouData(foreignData.length ? foreignData : initialForeignMouData);

          // Salary Data
          const sal = yrs.reduce((acc, y) => ({ ...acc, [y]: { highest: '', lowest: '', median: '', mean: '' } }), {});
          data.placementSalaries.forEach(ps => {
            sal[ps.year] = { highest: ps.highest, lowest: ps.lowest, median: ps.median, mean: ps.mean };
          });
          setSalaryData(sal);

          // Student Contacts
          const contacts = data.studentContacts.map((s, idx) => ({
            id: idx + 1,
            nameAndDept: s.nameAndDept,
            email: s.email,
          }));
          setStudentContacts(contacts.length ? contacts : initialStudentContacts);

          // Other Info
          setOtherInfo({
            implementingNEP: data.implementingNEP,
            implementingMEME: data.implementingMEME,
            interCollegeCompetitions: data.interCollegeCompetitions || '',
            intraCollegeCompetitions: data.intraCollegeCompetitions || '',
            noOfClubs: data.noOfClubs || '',
            mentorMenteeSystem: data.mentorMenteeSystem || '',
            studentCounsellor: data.studentCounsellor,
            noOfProgramsConducted: data.noOfProgramsConducted || '',
            hasForeignMous: data.moUForeignUniversities.length > 0,
            hasLanguageTraining: !!data.foreignLanguageTraining,
            foreignLanguageLink: data.foreignLanguageTraining || '',
          });
          setSectionCDriveLink(data.sectionCDriveLink || '');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchYearConfig();
  }, []);

  // Initial data creators
  const createInitialRow = (id, yearObj) => ({ id, department: '', ...yearObj });
  const initialSpecializationData = years.length ? [1, 2].map(id => createInitialRow(id, years.reduce((acc, y) => ({ ...acc, [y]: { intake: '', filled: '' } }), {}))) : [
    { id: 1, department: '', ...years.reduce((acc, y) => ({ ...acc, [y]: { intake: '', filled: '' } }), {}) },
    { id: 2, department: '', ...years.reduce((acc, y) => ({ ...acc, [y]: { intake: '', filled: '' } }), {}) }
  ];
  const initialFacultyData = years.length ? [1, 2].map(id => ({ id, department: '', intake: '', ...years.reduce((acc, y) => ({ ...acc, [y]: { prof: '', asp: '', ap: '' } }), {}) })) : [
    { id: 1, department: '', intake: '', ...years.reduce((acc, y) => ({ ...acc, [y]: { prof: '', asp: '', ap: '' } }), {}) },
    { id: 2, department: '', intake: '', ...years.reduce((acc, y) => ({ ...acc, [y]: { prof: '', asp: '', ap: '' } }), {}) }
  ];
  const initialPlacementData = years.length ? [1, 2].map(id => createInitialRow(id, years.reduce((acc, y) => ({ ...acc, [y]: { a: '', b: '', c: '' } }), {}))) : [
    { id: 1, department: '', ...years.reduce((acc, y) => ({ ...acc, [y]: { a: '', b: '', c: '' } }), {}) },
    { id: 2, department: '', ...years.reduce((acc, y) => ({ ...acc, [y]: { a: '', b: '', c: '' } }), {}) }
  ];
  const initialPlacementSummaryData = years.length ? [1, 2].map(id => createInitialRow(id, years.reduce((acc, y) => ({ ...acc, [y]: { n: '', x: '' } }), {}))) : [
    { id: 1, department: '', ...years.reduce((acc, y) => ({ ...acc, [y]: { n: '', x: '' } }), {}) },
    { id: 2, department: '', ...years.reduce((acc, y) => ({ ...acc, [y]: { n: '', x: '' } }), {}) }
  ];
  const initialForeignMouData = [
    { id: 1, university: '', country: '', validUpto: '', link: '' },
    { id: 2, university: '', country: '', validUpto: '', link: '' }
  ];
  const initialSalaryData = years.reduce((acc, y) => ({ ...acc, [y]: { highest: '', lowest: '', median: '', mean: '' } }), {});
  const initialStudentContacts = [
    { id: 1, nameAndDept: '', email: '' },
    { id: 2, nameAndDept: '', email: '' },
    { id: 3, nameAndDept: '', email: '' },
    { id: 4, nameAndDept: '', email: '' },
    { id: 5, nameAndDept: '', email: '' }
  ];

  const [specializationData, setSpecializationData] = useState(initialSpecializationData);
  const [facultyData, setFacultyData] = useState(initialFacultyData);
  const [phdData, setPhdData] = useState(years.reduce((acc, y) => ({ ...acc, [y]: { total: '', phd: '' } }), {}));
  const [additionalAcademicData, setAdditionalAcademicData] = useState({
    avgTeachingExperience: '',
    creditsEarned: '',
    contactHours: '',
    facultyBelowFeedbackThreshold: '',
  });
  const [placementData, setPlacementData] = useState(initialPlacementData);
  const [placementSummaryData, setPlacementSummaryData] = useState(initialPlacementSummaryData);
  const [mouData, setMouData] = useState(years.reduce((acc, y) => ({ ...acc, [y]: '' }), {}));
  const [foreignMouData, setForeignMouData] = useState(initialForeignMouData);
  const [salaryData, setSalaryData] = useState(initialSalaryData);
  const [studentContacts, setStudentContacts] = useState(initialStudentContacts);
  const [otherInfo, setOtherInfo] = useState({
    implementingNEP: null,
    implementingMEME: null,
    interCollegeCompetitions: '',
    intraCollegeCompetitions: '',
    noOfClubs: '',
    mentorMenteeSystem: '',
    studentCounsellor: null,
    noOfProgramsConducted: '',
    hasForeignMous: false,
    hasLanguageTraining: false,
    foreignLanguageLink: '',
  });

  // Calculate percentages for Specialization
  const calculateSpecializationPercent = (intake, filled) => {
    const intakeNum = Number(intake);
    const filledNum = Number(filled);
    return intakeNum > 0 ? ((filledNum / intakeNum) * 100).toFixed(2) : '';
  };

  // Calculate totals for Faculty
  const calculateFacultyTotals = () => {
    const totals = years.reduce((acc, year) => ({ ...acc, [year]: { prof: 0, asp: 0, ap: 0 } }), {});
    facultyData.forEach(row => {
      years.forEach(year => {
        totals[year].prof += Number(row[year]?.prof) || 0;
        totals[year].asp += Number(row[year]?.asp) || 0;
        totals[year].ap += Number(row[year]?.ap) || 0;
      });
    });
    return totals;
  };

  // Calculate V formula: V = (3 × Prof + 2 × ASP + 1 × AP) / 2.5
  const calculateVFormula = (year) => {
    const totals = calculateFacultyTotals();
    const { prof, asp, ap } = totals[year] || { prof: 0, asp: 0, ap: 0 };
    return ((3 * prof + 2 * asp + ap) / 2.5).toFixed(2);
  };

  // Calculate Ph.D. percentages
  const calculatePhdPercent = (total, phd) => {
    const totalNum = Number(total);
    const phdNum = Number(phd);
    return totalNum > 0 ? ((phdNum / totalNum) * 100).toFixed(2) : '';
  };

  // Calculate Placement totals
  const calculatePlacementTotals = (row, year) => {
    const a = Number(row[year]?.a) || 0;
    const b = Number(row[year]?.b) || 0;
    const c = Number(row[year]?.c) || 0;
    return a + b + c;
  };

  // Calculate Placement Summary percentages
  const calculateSummaryPercent = (n, x) => {
    const nNum = Number(n);
    const xNum = Number(x);
    return nNum > 0 ? ((xNum / nNum) * 100).toFixed(2) : '';
  };

  // Calculate MoUs total
  const calculateMouTotal = () => {
    return Object.values(mouData).reduce((sum, val) => sum + (Number(val) || 0), 0);
  };

  const facultyTotals = calculateFacultyTotals();
  const mouTotal = calculateMouTotal();

  // Handlers for input changes
  const handleSpecializationChange = (id, field, year, value) => {
    setSpecializationData(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [year]: { ...row[year], [field]: value } } : row
      )
    );
  };

  const handleFacultyChange = (id, field, year, value) => {
    setFacultyData(prev =>
      prev.map(row =>
        row.id === id
          ? field === 'department' || field === 'intake'
            ? { ...row, [field]: value }
            : { ...row, [year]: { ...row[year], [field]: value } }
          : row
      )
    );
  };

  const handlePhdChange = (year, field, value) => {
    setPhdData(prev => ({
      ...prev,
      [year]: { ...prev[year], [field]: value },
    }));
  };

  const handleAdditionalAcademicChange = (field, value) => {
    setAdditionalAcademicData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlacementChange = (id, field, year, value) => {
    setPlacementData(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [year]: { ...row[year], [field]: value } } : row
      )
    );
  };

  const handleSummaryChange = (id, field, year, value) => {
    setPlacementSummaryData(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [year]: { ...row[year], [field]: value } } : row
      )
    );
  };

  const handleMouChange = (year, value) => {
    setMouData(prev => ({ ...prev, [year]: value }));
  };

  const handleForeignMouChange = (id, field, value) => {
    setForeignMouData(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSalaryChange = (year, type, value) => {
    setSalaryData(prev => ({
      ...prev,
      [year]: { ...prev[year], [type]: value },
    }));
  };

  const handleStudentContactChange = (id, field, value) => {
    setStudentContacts(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleOtherChange = (field, value) => {
    setOtherInfo(prev => ({ ...prev, [field]: value }));
  };

  // Add row handlers
  const addSpecializationRow = () => {
    const newId = Math.max(...specializationData.map(row => row.id), 0) + 1;
    setSpecializationData(prev => [
      ...prev,
      createInitialRow(newId, years.reduce((acc, y) => ({ ...acc, [y]: { intake: '', filled: '' } }), {})),
    ]);
  };

  const addFacultyRow = () => {
    const newId = Math.max(...facultyData.map(row => row.id), 0) + 1;
    setFacultyData(prev => [
      ...prev,
      { id: newId, department: '', intake: '', ...years.reduce((acc, y) => ({ ...acc, [y]: { prof: '', asp: '', ap: '' } }), {}) },
    ]);
  };

  const addPlacementRow = () => {
    const newId = Math.max(...placementData.map(row => row.id), 0) + 1;
    setPlacementData(prev => [
      ...prev,
      createInitialRow(newId, years.reduce((acc, y) => ({ ...acc, [y]: { a: '', b: '', c: '' } }), {})),
    ]);
  };

  const addSummaryRow = () => {
    const newId = Math.max(...placementSummaryData.map(row => row.id), 0) + 1;
    setPlacementSummaryData(prev => [
      ...prev,
      createInitialRow(newId, years.reduce((acc, y) => ({ ...acc, [y]: { n: '', x: '' } }), {})),
    ]);
  };

  const addForeignMouRow = () => {
    const newId = Math.max(...foreignMouData.map(row => row.id), 0) + 1;
    setForeignMouData(prev => [
      ...prev,
      { id: newId, university: '', country: '', validUpto: '', link: '' },
    ]);
  };

  const addStudentContactRow = () => {
    const newId = Math.max(...studentContacts.map(row => row.id), 0) + 1;
    setStudentContacts(prev => [
      ...prev,
      { id: newId, nameAndDept: '', email: '' },
    ]);
  };

  // Remove row handlers
  const removeSpecializationRow = () => {
    setSpecializationData(prev => prev.slice(0, -1));
  };

  const removeFacultyRow = () => {
    setFacultyData(prev => prev.slice(0, -1));
  };

  const removePlacementRow = () => {
    setPlacementData(prev => prev.slice(0, -1));
  };

  const removeSummaryRow = () => {
    setPlacementSummaryData(prev => prev.slice(0, -1));
  };

  const removeForeignMouRow = () => {
    setForeignMouData(prev => prev.slice(0, -1));
  };

  const removeStudentContactRow = () => {
    setStudentContacts(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    setFormData({
      ...formData,
      specialization: specializationData,
      faculty: facultyData,
      phd: phdData,
      placement: placementData,
      placementSummary: placementSummaryData,
      mous: mouData,
      foreignMous: foreignMouData,
      additionalAcademic: additionalAcademicData,
      hasForeignMous: otherInfo.hasForeignMous,
    });
  }, [specializationData, facultyData, phdData, placementData, placementSummaryData, mouData, foreignMouData, additionalAcademicData, otherInfo.hasForeignMous, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submitData = {
      admissions: specializationData.flatMap(row => years.map(year => ({
        year,
        departmentName: row.department,
        intake: row[year]?.intake ? parseInt(row[year].intake) : null,
        filled: row[year]?.filled ? parseInt(row[year].filled) : null,
      }))),
      facultyDetails: facultyData.flatMap(row => years.map(year => ({
        year,
        departmentName: row.department,
        intake: row.intake ? parseInt(row.intake) : null,
        professors: row[year]?.prof ? parseInt(row[year].prof) : null,
        associateProfessors: row[year]?.asp ? parseInt(row[year].asp) : null,
        assistantProfessors: row[year]?.ap ? parseInt(row[year].ap) : null,
      }))),
      phdInfos: years.map(year => ({
        year,
        totalFaculties: phdData[year]?.total ? parseInt(phdData[year].total) : null,
        phdHolders: phdData[year]?.phd ? parseInt(phdData[year].phd) : null,
      })),
      placements: placementData.flatMap(row => years.map(year => ({
        year,
        departmentName: row.department,
        placements: row[year]?.a ? parseInt(row[year].a) : null,
        higherEducation: row[year]?.b ? parseInt(row[year].b) : null,
        entrepreneurship: row[year]?.c ? parseInt(row[year].c) : null,
      }))),
      studentCounts: placementSummaryData.flatMap(row => years.map(year => ({
        year,
        departmentName: row.department,
        n: row[year]?.n ? parseInt(row[year].n) : null,
        x: row[year]?.x ? parseInt(row[year].x) : null,
      }))),
      placementSalaries: years.map(year => ({
        year,
        highest: salaryData[year]?.highest ? parseFloat(salaryData[year].highest) : '',
        lowest: salaryData[year]?.lowest ? parseFloat(salaryData[year].lowest) : '',
        median: salaryData[year]?.median ? parseFloat(salaryData[year].median) : '',
        mean: salaryData[year]?.mean ? parseFloat(salaryData[year].mean) : '',
      })),
      studentContacts: studentContacts.map(sc => ({
        nameAndDept: sc.nameAndDept,
        email: sc.email,
      })),
      activeMoUs: years.map(year => ({
        year,
        count: mouData[year] ? parseInt(mouData[year]) : 0,
      })),
      moUForeignUniversities: otherInfo.hasForeignMous ? foreignMouData.map(fm => ({
  university: fm.university,
  country: fm.country,
  validUpto: fm.validUpto,
  link: fm.link,
})) : 'No',
      sectionCDriveLink,
      averageTeachingExperience: additionalAcademicData.avgTeachingExperience,
      noOfCreditsEarned: additionalAcademicData.creditsEarned,
      noOfContactHours: additionalAcademicData.contactHours,
      noOfFacultyBelowThreshold: additionalAcademicData.facultyBelowFeedbackThreshold,
      implementingNEP: otherInfo.implementingNEP,
      implementingMEME: otherInfo.implementingMEME,
      interCollegeCompetitions: otherInfo.interCollegeCompetitions,
      intraCollegeCompetitions: otherInfo.intraCollegeCompetitions,
      noOfClubs: otherInfo.noOfClubs,
      mentorMenteeSystem: otherInfo.mentorMenteeSystem,
      studentCounsellor: otherInfo.studentCounsellor,
      noOfProgramsConducted: otherInfo.noOfProgramsConducted,
      foreignLanguageTraining: otherInfo.hasLanguageTraining ? otherInfo.foreignLanguageLink : null,
    };
    try {
      const method = existingData ? 'PUT' : 'POST';
      await axios({
        method,
        url: 'https://qae-server.vercel.app/api/submit/submissions/section-c',
        headers: { Authorization: `Bearer ${token}` },
        data: submitData,
      });
      setTimeout(() => {
        if (onNext) onNext();
      }, 2000);
      toast.success('Section C submitted successfully');
    } catch (error) {
      toast.error("Failed to submit Section C");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  // Render fallback UI if years failed to load
  if (!years.length) {
    return (
      <div className="fixed inset-0 flex items-center justify-center pb-40">
        <Loader2 className="w-12 h-12 animate-spin text-teal-500" />
        <ToastContainer />
      </div>
    );
  }

  const colorMap = years.reduce((acc, y, i) => ({ ...acc, [y]: ['blue', 'green', 'yellow'][i] }), {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Section C: Academics
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Provide detailed academic information including specialization, faculty, placements, and institutional details for the specified academic years.
          </p>
        </div>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="ml-3 text-gray-700 font-medium">Loading...</span>
          </div>
        )}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Specialization Detail of Students Admitted</h2>
              <p className="text-teal-100">Details for the latest three Academic Years (First year admitted students).</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-center py-3 px-2 font-semibold text-gray-900 bg-gray-50">Sl.No</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50">Department</th>
                      {years.map((year, i) => (
                        <React.Fragment key={year}>
                          <th className={`text-center py-3 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50`}>{year} Intake</th>
                          <th className={`text-center py-3 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50`}>{year} Filled</th>
                          <th className={`text-center py-3 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50`}>{year} %</th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {specializationData.map(row => (
                      <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2 text-center font-medium text-gray-900">{row.id}</td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={row.department}
                            onChange={(e) => setSpecializationData(prev =>
                              prev.map(r => r.id === row.id ? { ...r, department: e.target.value } : r)
                            )}
                            placeholder="Enter department"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                            required
                          />
                        </td>
                        {years.map(year => (
                          <React.Fragment key={year}>
                            <td className="py-3 px-2">
                              <input
                                type="number"
                                value={row[year]?.intake || ''}
                                onChange={(e) => handleSpecializationChange(row.id, 'intake', year, e.target.value)}
                                placeholder="Intake"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                                required
                              />
                            </td>
                            <td className="py-3 px-2">
                              <input
                                type="number"
                                value={row[year]?.filled || ''}
                                onChange={(e) => handleSpecializationChange(row.id, 'filled', year, e.target.value)}
                                placeholder="Filled"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                                required
                              />
                            </td>
                            <td className="py-3 px-2">
                              <input
                                type="number"
                                value={calculateSpecializationPercent(row[year]?.intake, row[year]?.filled)}
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                              />
                            </td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={addSpecializationRow}
                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    + Add more rows
                  </button>
                  {specializationData.length > 2 && (
                    <button
                      type="button"
                      onClick={removeSpecializationRow}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      - Remove last row
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Faculty Details (Permanent Faculty Only)</h2>
              <p className="text-teal-100 text-sm">Note: Professors and Associate Professors should hold Ph.D. with required experience.</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th rowSpan="2" className="text-center py-3 px-2 font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">Sl.No</th>
                      <th rowSpan="2" className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">Department</th>
                      <th rowSpan="2" className="text-center py-3 px-3 font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">Intake Details</th>
                      {years.map((year, i) => (
                        <th key={year} colSpan="3" className={`text-center py-3 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50 border-r border-gray-200`}>{year}</th>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      {years.map((year, i) => (
                        <React.Fragment key={year}>
                          <th className={`text-center py-2 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50`}>Prof</th>
                          <th className={`text-center py-2 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50`}>ASP</th>
                          <th className={`text-center py-2 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50 border-r border-gray-200`}>AP</th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {facultyData.map(row => (
                      <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2 text-center font-medium text-gray-900 border-r border-gray-200">{row.id}</td>
                        <td className="py-3 px-4 border-r border-gray-200">
                          <input
                            type="text"
                            value={row.department}
                            onChange={(e) => handleFacultyChange(row.id, 'department', null, e.target.value)}
                            placeholder="Enter department"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                            required
                          />
                        </td>
                        <td className="py-3 px-3 border-r border-gray-200">
                          <input
                            type="number"
                            value={row.intake}
                            onChange={(e) => handleFacultyChange(row.id, 'intake', null, e.target.value)}
                            placeholder="Enter intake"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                            required
                          />
                        </td>
                        {years.map(year => (
                          <React.Fragment key={year}>
                            <td className="py-3 px-2">
                              <input
                                type="number"
                                value={row[year]?.prof || ''}
                                onChange={(e) => handleFacultyChange(row.id, 'prof', year, e.target.value)}
                                placeholder="0"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                                required
                              />
                            </td>
                            <td className="py-3 px-2">
                              <input
                                type="number"
                                value={row[year]?.asp || ''}
                                onChange={(e) => handleFacultyChange(row.id, 'asp', year, e.target.value)}
                                placeholder="0"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                                required
                              />
                            </td>
                            <td className={`py-3 px-2 border-r border-gray-200`}>
                              <input
                                type="number"
                                value={row[year]?.ap || ''}
                                onChange={(e) => handleFacultyChange(row.id, 'ap', year, e.target.value)}
                                placeholder="0"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                                required
                              />
                            </td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-b-2 border-gray-300 bg-teal-50">
                      <td colSpan="2" className="py-3 px-4 font-bold text-gray-900 border-r border-gray-200">Total</td>
                      <td className="py-3 px-3 border-r border-gray-200"></td>
                      {years.map(year => (
                        <React.Fragment key={year}>
                          <td className="py-3 px-2">
                            <input
                              type="number"
                              value={facultyTotals[year]?.prof || 0}
                              disabled
                              className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                            />
                          </td>
                          <td className="py-3 px-2">
                            <input
                              type="number"
                              value={facultyTotals[year]?.asp || 0}
                              disabled
                              className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                            />
                          </td>
                          <td className={`py-3 px-2 border-r border-gray-200`}>
                            <input
                              type="number"
                              value={facultyTotals[year]?.ap || 0}
                              disabled
                              className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                            />
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                    {/* <tr className="border-b-2 border-gray-300 bg-teal-100">
                      <td colSpan="2" className="py-3 px-4 font-bold text-gray-900 border-r border-gray-200">V</td>
                      <td className="py-3 px-3 border-r border-gray-200"></td>
                      {years.map(year => (
                        <td key={year} colSpan="3" className={`py-3 px-2 border-r border-gray-200`}>
                          <input
                            type="number"
                            value={calculateVFormula(year)}
                            disabled
                            className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                          />
                        </td>
                      ))}
                    </tr> */}
                  </tbody>
                </table>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={addFacultyRow}
                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    + Add more rows
                  </button>
                  {facultyData.length > 2 && (
                    <button
                      type="button"
                      onClick={removeFacultyRow}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      - Remove last row
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Number of Ph.D. Holders in the Institute</h2>
              <p className="text-teal-100">Permanent Faculty Only.</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-center py-4 px-6 font-semibold text-gray-900 bg-gray-50">Year</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-900 bg-gray-50">Total No. of Faculties</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-900 bg-gray-50">No. of Ph.D. Holders</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-900 bg-gray-50">Percentage (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {years.map(year => (
                      <tr key={year} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-center font-medium text-gray-900">{year}</td>
                        <td className="py-4 px-6">
                          <input
                            type="number"
                            value={phdData[year]?.total || ''}
                            onChange={(e) => handlePhdChange(year, 'total', e.target.value)}
                            placeholder="Enter count"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            required
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="number"
                            value={phdData[year]?.phd || ''}
                            onChange={(e) => handlePhdChange(year, 'phd', e.target.value)}
                            placeholder="Enter count"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            required
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="number"
                            value={calculatePhdPercent(phdData[year]?.total, phdData[year]?.phd)}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Additional Academic Information</h2>
              <p className="text-teal-100">Provide details about faculty experience, credits, and student feedback.</p>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Average Teaching Experience of Faculty (Permanent Faculty, in years)
                </label>
                <input
                  type="number"
                  value={additionalAcademicData.avgTeachingExperience}
                  onChange={(e) => handleAdditionalAcademicChange('avgTeachingExperience', e.target.value)}
                  placeholder="Enter average years"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Number of Credits Earned by Students (After Completion of Course)
                </label>
                <input
                  type="number"
                  value={additionalAcademicData.creditsEarned}
                  onChange={(e) => handleAdditionalAcademicChange('creditsEarned', e.target.value)}
                  placeholder="Enter number of credits"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Number of Contact Hours Given to the Credits
                </label>
                <input
                  type="number"
                  value={additionalAcademicData.contactHours}
                  onChange={(e) => handleAdditionalAcademicChange('contactHours', e.target.value)}
                  placeholder="Enter number of contact hours"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Number of Faculty Members Scored Below Threshold in Student Feedback (Last AY)
                </label>
                <input
                  type="number"
                  value={additionalAcademicData.facultyBelowFeedbackThreshold}
                  onChange={(e) => handleAdditionalAcademicChange('facultyBelowFeedbackThreshold', e.target.value)}
                  placeholder="Enter number of faculty"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Placement (A), Higher Education (B), and Entrepreneurship (C)</h2>
              <p className="text-teal-100">Details for the latest three Academic Years.</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th rowSpan="2" className="text-center py-3 px-2 font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">Sl.No</th>
                      <th rowSpan="2" className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">Department</th>
                      {years.map(year => (
                        <th key={year} colSpan="4" className={`text-center py-3 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50 border-r border-gray-200`}>{year}</th>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      {years.map(year => (
                        <React.Fragment key={year}>
                          <th className={`text-center py-2 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50`}>A</th>
                          <th className={`text-center py-2 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50`}>B</th>
                          <th className={`text-center py-2 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50`}>C</th>
                          <th className={`text-center py-2 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50 border-r border-gray-200`}>T</th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {placementData.map(row => (
                      <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2 text-center font-medium text-gray-900 border-r border-gray-200">{row.id}</td>
                        <td className="py-3 px-4 border-r border-gray-200">
                          <input
                            type="text"
                            value={row.department}
                            onChange={(e) => setPlacementData(prev =>
                              prev.map(r => r.id === row.id ? { ...r, department: e.target.value } : r)
                            )}
                            placeholder="Enter department"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                            required
                          />
                        </td>
                        {years.map(year => (
                          <React.Fragment key={year}>
                            <td className="py-3 px-2">
                              <input
                                type="number"
                                value={row[year]?.a || ''}
                                onChange={(e) => handlePlacementChange(row.id, 'a', year, e.target.value)}
                                placeholder="Count"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                                required
                              />
                            </td>
                            <td className="py-3 px-2">
                              <input
                                type="number"
                                value={row[year]?.b || ''}
                                onChange={(e) => handlePlacementChange(row.id, 'b', year, e.target.value)}
                                placeholder="Count"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                                required
                              />
                            </td>
                            <td className="py-3 px-2">
                              <input
                                type="number"
                                value={row[year]?.c || ''}
                                onChange={(e) => handlePlacementChange(row.id, 'c', year, e.target.value)}
                                placeholder="Count"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                                required
                              />
                            </td>
                            <td className={`py-3 px-2 border-r border-gray-200`}>
                              <input
                                type="number"
                                value={calculatePlacementTotals(row, year)}
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                              />
                            </td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={addPlacementRow}
                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    + Add more rows
                  </button>
                  {placementData.length > 2 && (
                    <button
                      type="button"
                      onClick={removePlacementRow}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      - Remove last row
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Placement, Higher Education, and Entrepreneurship Summary</h2>
              <p className="text-teal-100">N = Total Students (intake + lateral entry), X = A + B + C, % of Y = X / N</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th rowSpan="2" className="text-center py-3 px-2 font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">Sl.No</th>
                      <th rowSpan="2" className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">Department</th>
                      {years.map(year => (
                        <th key={year} colSpan="3" className={`text-center py-3 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50 border-r border-gray-200`}>{year}</th>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      {years.map(year => (
                        <React.Fragment key={year}>
                          <th className={`text-center py-2 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50`}>N</th>
                          <th className={`text-center py-2 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50`}>X</th>
                          <th className={`text-center py-2 px-2 font-semibold text-gray-900 bg-${colorMap[year]}-50 border-r border-gray-200`}>% of Y</th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {placementSummaryData.map(row => (
                      <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2 text-center font-medium text-gray-900 border-r border-gray-200">{row.id}</td>
                        <td className="py-3 px-4 border-r border-gray-200">
                          <input
                            type="text"
                            value={row.department}
                            onChange={(e) => setPlacementSummaryData(prev =>
                              prev.map(r => r.id === row.id ? { ...r, department: e.target.value } : r)
                            )}
                            placeholder="Enter department"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                            required
                          />
                        </td>
                        {years.map(year => (
                          <React.Fragment key={year}>
                            <td className="py-3 px-2">
                              <input
                                type="number"
                                value={row[year]?.n || ''}
                                onChange={(e) => handleSummaryChange(row.id, 'n', year, e.target.value)}
                                placeholder="Count"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                                required
                              />
                            </td>
                            <td className="py-3 px-2">
                              <input
                                type="number"
                                value={row[year]?.x || ''}
                                onChange={(e) => handleSummaryChange(row.id, 'x', year, e.target.value)}
                                placeholder="Count"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500 text-sm"
                                required
                              />
                            </td>
                            <td className={`py-3 px-2 border-r border-gray-200`}>
                              <input
                                type="number"
                                value={calculateSummaryPercent(row[year]?.n, row[year]?.x)}
                                disabled
                                className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                              />
                            </td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={addSummaryRow}
                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    + Add more rows
                  </button>
                  {placementSummaryData.length > 2 && (
                    <button
                      type="button"
                      onClick={removeSummaryRow}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      - Remove last row
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Placement Salary Details</h2>
              <p className="text-teal-100">Salary details for the last three Academic Years.</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Sl.No</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Particulars</th>
                      {years.map(year => (
                        <th key={year} className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">{year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['highest', 'lowest', 'median', 'mean'].map((type, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-center font-medium text-gray-900">{idx + 1}</td>
                        <td className="py-4 px-6 font-medium text-gray-900">{type.charAt(0).toUpperCase() + type.slice(1)} salary</td>
                        {years.map(year => (
                          <td key={year} className="py-4 px-4">
                            <input
                              type="number"
                              value={salaryData[year]?.[type] || ''}
                              onChange={(e) => handleSalaryChange(year, type, e.target.value)}
                              placeholder="Enter amount in ₹"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                              required
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
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Student Contact Details for Last Passed Out Batch</h2>
              <p className="text-teal-100">Provide contact details for the last passed out batch.</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Sl.No</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Name and Department</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">E-Mail Id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentContacts.map(row => (
                      <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-center font-medium text-gray-900">{row.id}</td>
                        <td className="py-4 px-6">
                          <input
                            type="text"
                            value={row.nameAndDept}
                            onChange={(e) => handleStudentContactChange(row.id, 'nameAndDept', e.target.value)}
                            placeholder="Enter name and department"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            required
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="email"
                            value={row.email}
                            onChange={(e) => handleStudentContactChange(row.id, 'email', e.target.value)}
                            placeholder="Enter email address"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            required
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={addStudentContactRow}
                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    + Add more rows
                  </button>
                  {studentContacts.length > 5 && (
                    <button
                      type="button"
                      onClick={removeStudentContactRow}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      - Remove last row
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Number of Active MoUs</h2>
              <p className="text-teal-100">Provide the number of active Memorandums of Understanding.</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-center py-4 px-6 font-semibold text-gray-900 bg-gray-50">Year</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-900 bg-gray-50">No. of Active MoUs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {years.map(year => (
                      <tr key={year} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-center font-medium text-gray-900">{year}</td>
                        <td className="py-4 px-6">
                          <input
                            type="number"
                            value={mouData[year] || ''}
                            onChange={(e) => handleMouChange(year, e.target.value)}
                            placeholder="Enter count"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            required
                          />
                        </td>
                      </tr>
                    ))}
                    <tr className="border-b-2 border-gray-300 bg-teal-50">
                      <td className="py-4 px-6 text-center font-bold text-gray-900">Total</td>
                      <td className="py-4 px-6">
                        <input
                          type="number"
                          value={mouTotal}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Other Institutional Information</h2>
              <p className="text-teal-100">Provide additional institutional details.</p>
            </div>
            <div className="p-8 space-y-8">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">Is your institute implementing NEP 2020?</label>
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="nep_yes"
                      name="nep"
                      checked={otherInfo.implementingNEP === true}
                      onChange={() => handleOtherChange('implementingNEP', true)}
                      className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500"
                      required
                    />
                    <label htmlFor="nep_yes" className="text-gray-900 font-medium cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="nep_no"
                      name="nep"
                      checked={otherInfo.implementingNEP === false}
                      onChange={() => handleOtherChange('implementingNEP', false)}
                      className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500"
                      required
                    />
                    <label htmlFor="nep_no" className="text-gray-900 font-medium cursor-pointer">No</label>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">Is your institute implementing Multiple Entry & Multiple Exit Scheme?</label>
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="meme_yes"
                      name="meme"
                      checked={otherInfo.implementingMEME === true}
                      onChange={() => handleOtherChange('implementingMEME', true)}
                      className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500"
                      required
                    />
                    <label htmlFor="meme_yes" className="text-gray-900 font-medium cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="meme_no"
                      name="meme"
                      checked={otherInfo.implementingMEME === false}
                      onChange={() => handleOtherChange('implementingMEME', false)}
                      className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500"
                      required
                    />
                    <label htmlFor="meme_no" className="text-gray-900 font-medium cursor-pointer">No</label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Number of Inter-college competitions organized in the last AY (Techno cultural)
                  </label>
                  <input
                    type="number"
                    value={otherInfo.interCollegeCompetitions}
                    onChange={(e) => handleOtherChange('interCollegeCompetitions', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Number of Intra-college competitions organized in the last AY (Techno cultural)
                  </label>
                  <input
                    type="number"
                    value={otherInfo.intraCollegeCompetitions}
                    onChange={(e) => handleOtherChange('intraCollegeCompetitions', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Number of clubs/Societies available
                  </label>
                  <input
                    type="number"
                    value={otherInfo.noOfClubs}
                    onChange={(e) => handleOtherChange('noOfClubs', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mentor-Mentee System Details
                  </label>
                  <input
                    type="text"
                    value={otherInfo.mentorMenteeSystem}
                    onChange={(e) => handleOtherChange('mentorMenteeSystem', e.target.value)}
                    placeholder="Enter details"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">Do you have a student counsellor?</label>
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="counsellor_yes"
                      name="counsellor"
                      checked={otherInfo.studentCounsellor === true}
                      onChange={() => handleOtherChange('studentCounsellor', true)}
                      className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500"
                      required
                    />
                    <label htmlFor="counsellor_yes" className="text-gray-900 font-medium cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="counsellor_no"
                      name="counsellor"
                      checked={otherInfo.studentCounsellor === false}
                      onChange={() => handleOtherChange('studentCounsellor', false)}
                      className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500"
                      required
                    />
                    <label htmlFor="counsellor_no" className="text-gray-900 font-medium cursor-pointer">No</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Number of programs conducted to promote holistic development of students
                </label>
                <input
                  type="number"
                  value={otherInfo.noOfProgramsConducted}
                  onChange={(e) => handleOtherChange('noOfProgramsConducted', e.target.value)}
                  placeholder="Enter number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
              <div>
  <label className="block text-lg font-semibold text-gray-900 mb-4">Does your institute have MoUs with foreign universities?</label>
  <div className="flex space-x-6">
    <div className="flex items-center space-x-3">
      <input
        type="radio"
        id="foreign_mou_yes"
        name="foreign_mou"
        checked={otherInfo.hasForeignMous === true}
        onChange={() => handleOtherChange('hasForeignMous', true)}
        className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500"
        required
      />
      <label htmlFor="foreign_mou_yes" className="text-gray-900 font-medium cursor-pointer">Yes</label>
    </div>
    <div className="flex items-center space-x-3">
      <input
        type="radio"
        id="foreign_mou_no"
        name="foreign_mou"
        checked={otherInfo.hasForeignMous === false}
        onChange={() => handleOtherChange('hasForeignMous', false)}
        className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500"
        required
      />
      <label htmlFor="foreign_mou_no" className="text-gray-900 font-medium cursor-pointer">No</label>
    </div>
  </div>
</div>
{otherInfo.hasForeignMous && (
  <div className="border-t border-gray-200 pt-8">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Details of MoUs with Foreign Universities</h3>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Sl.No</th>
            <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">University</th>
            <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Country</th>
            <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Valid Upto</th>
            <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Link</th>
          </tr>
        </thead>
        <tbody>
          {foreignMouData.map(row => (
            <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 text-center font-medium text-gray-900">{row.id}</td>
              <td className="py-4 px-6">
                <input
                  type="text"
                  value={row.university}
                  onChange={(e) => handleForeignMouChange(row.id, 'university', e.target.value)}
                  placeholder="Enter university name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  required
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="text"
                  value={row.country}
                  onChange={(e) => handleForeignMouChange(row.id, 'country', e.target.value)}
                  placeholder="Enter country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  required
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="date"
                  value={row.validUpto}
                  onChange={(e) => handleForeignMouChange(row.id, 'validUpto', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900"
                  required
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="url"
                  value={row.link}
                  onChange={(e) => handleForeignMouChange(row.id, 'link', e.target.value)}
                  placeholder="Enter link"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  required
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center space-x-4">
        <button
          type="button"
          onClick={addForeignMouRow}
          className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          + Add more rows
        </button>
        {foreignMouData.length > 2 && (
          <button
            type="button"
            onClick={removeForeignMouRow}
            className="text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            - Remove last row
          </button>
        )}
      </div>
    </div>
  </div>
)}
              <div className="border-t border-gray-200 pt-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">Does your institute provide foreign language training?</label>
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="language_training_yes"
                      name="language_training"
                      checked={otherInfo.hasLanguageTraining === true}
                      onChange={() => handleOtherChange('hasLanguageTraining', true)}
                      className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500"
                      required
                    />
                    <label htmlFor="language_training_yes" className="text-gray-900 font-medium cursor-pointer">Yes</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="language_training_no"
                      name="language_training"
                      checked={otherInfo.hasLanguageTraining === false}
                      onChange={() => handleOtherChange('hasLanguageTraining', false)}
                      className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500"
                      required
                    />
                    <label htmlFor="language_training_no" className="text-gray-900 font-medium cursor-pointer">No</label>
                  </div>
                </div>
              </div>
              {otherInfo.hasLanguageTraining && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Link to foreign language training details
                  </label>
                  <input
                    type="url"
                    value={otherInfo.foreignLanguageLink}
                    onChange={(e) => handleOtherChange('foreignLanguageLink', e.target.value)}
                    placeholder="Enter link"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Google Drive Link for Section C</h2>
              <p className="text-teal-100">Provide a Google Drive link containing relevant documents for Section C.</p>
            </div>
            <div className="p-8">
              <input
                type="url"
                value={sectionCDriveLink}
                onChange={(e) => setSectionCDriveLink(e.target.value)}
                placeholder="Enter Google Drive link"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-md"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Section B
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save and Continue to Section D'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SectionC;