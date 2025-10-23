import { ArrowLeft, Building2, Users, GraduationCap, Home, BookOpen, Download } from 'lucide-react';
import generateSubmissionPDF from '../../utils/generateSubmissionPDF';
import { useParams, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubmissionDetailPage = () => {
  const { submissionId } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const inputYear = parseInt(query.get('year')) || new Date().getFullYear(); // Default to current year (2025)

  // Generate years: current year and previous two years
  const [years, setYears] = useState({
    sectionB: [],
    sectionC: [],
    sectionD: [],
    sectionE: [],
  });
  const [submissionData, setSubmissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to format year as YYYY-YY
  const formatYear = (year) => {
    const nextYear = parseInt(year) + 1;
    return `${year}-${nextYear.toString().slice(-2)}`;
  };

  // Generate list of years (current year and previous two)
  const generateYears = (baseYear) => {
    return [baseYear, baseYear - 1, baseYear - 2].map((y) => y.toString());
  };

  useEffect(() => {
    const fetchSubmissionData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Generate years based on inputYear
        const generatedYears = generateYears(inputYear);
        setYears({
          sectionB: generatedYears,
          sectionC: generatedYears,
          sectionD: generatedYears,
          sectionE: generatedYears,
        });

        // Fetch Section A (general information)
        const sectionARes = await axios.get(`https://qae-server.vercel.app/api/section-a?year=${inputYear}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { sectionA, submissionId: sectionASubmissionId, status, sectionACompleted } = sectionARes.data;

        // if (!sectionACompleted) {
        //   throw new Error('Section A is not completed yet');
        // }

        const sectionAData = {
          institutionName: sectionA.name,
          yearEstablished: sectionA.yearEstablished,
          address: sectionA.address,
          pincode: sectionA.pinCode,
          state: sectionA.state,
          website: sectionA.website,
          headName: sectionA.headName,
          instituteType: sectionA.ownership,
          instituteCategory: sectionA.category,
          affiliatedUniversity: sectionA.affiliatedUniversity,
          aicteApprovalNo: sectionA.aicteApproval,
          aicteDate: sectionA.aicteApproval ? new Date(sectionA.aicteApproval).toLocaleDateString('en-US') : 'N/A',
          nbaAccredited: sectionA.nbaAccredited ? 'Yes' : 'No',
          nbaValidityDate: sectionA.nbaAccredited ? new Date(sectionA.nbaAccredited).toLocaleDateString('en-US') : 'N/A',
          naacAccredited: sectionA.naacScore ? 'Yes' : 'No',
          naacScore: sectionA.naacScore || 'N/A',
          naacValidityDate: sectionA.naacValidity ? new Date(sectionA.naacValidity).toLocaleDateString('en-US') : 'N/A',
          otherAccreditation: sectionA.otherAccreditations || 'None',
          applicantName: sectionA.applicantName,
          applicantDesignation: sectionA.applicantDesignation,
          applicantContact: sectionA.applicantContact,
          applicantEmail: sectionA.applicantEmail,
          field: sectionA.field,
        };

        // Fetch Section B
        const sectionBRes = await axios.get(
          `https://qae-server.vercel.app/api/submit/submissions/section-b?years=${inputYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const sectionB = sectionBRes.data;

        const genderInfo = [
          {
            gender: 'Male',
            ...sectionB.genderInfos.reduce((acc, gi) => ({ ...acc, [formatYear(gi.year)]: gi.male }), {}),
          },
          {
            gender: 'Female',
            ...sectionB.genderInfos.reduce((acc, gi) => ({ ...acc, [formatYear(gi.year)]: gi.female }), {}),
          },
          {
            gender: 'Transgender',
            ...sectionB.genderInfos.reduce((acc, gi) => ({ ...acc, [formatYear(gi.year)]: gi.transgender }), {}),
          },
        ];
        genderInfo.push({
          gender: 'Total',
          ...genderInfo.reduce((acc, g) => {
            Object.keys(g).forEach((k) => {
              if (k !== 'gender') acc[k] = (acc[k] || 0) + (g[k] || 0);
            });
            return acc;
          }, {}),
        });

        const diversityInfo = [
          {
            category: 'Inter state',
            ...sectionB.diversityInfos.reduce((acc, di) => ({ ...acc, [formatYear(di.year)]: di.interstate }), {}),
          },
          {
            category: 'Intra-state',
            ...sectionB.diversityInfos.reduce((acc, di) => ({ ...acc, [formatYear(di.year)]: di.intrastate }), {}),
          },
          {
            category: 'Overseas',
            ...sectionB.diversityInfos.reduce((acc, di) => ({ ...acc, [formatYear(di.year)]: di.overseas }), {}),
          },
        ];
        diversityInfo.push({
          category: 'Total',
          ...diversityInfo.reduce((acc, d) => {
            Object.keys(d).forEach((k) => {
              if (k !== 'category') acc[k] = (acc[k] || 0) + (d[k] || 0);
            });
            return acc;
          }, {}),
        });

        const examScores = sectionB.examScores.map((es, idx) => ({
          slNo: idx + 1,
          department: es.departmentName,
          examName: es.examName,
          highestRank: es.highestRank,
          lowestRank: es.lowestRank,
        }));

        const finance = sectionB.financeInfos[0] || {};
        const sectionBData = {
          sectionBDriveLink: sectionB.sectionBDriveLink,
          genderInfo,
          diversityInfo,
          examScores,
          avgTuitionFees: finance.avgTuitionFees,
          otherFees: finance.otherFees,
          hostelFees: finance.hostelFees,
          teachingSalaryExpense: finance.totalExpensesSalary,
          labExpenses: finance.totalExpensesLabs,
          perStudentExpenditure: finance.perStudentExpenditure,
        };

        // Fetch Section C
        const sectionCRes = await axios.get(
          `https://qae-server.vercel.app/api/submit/submissions/section-c?years=${inputYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const sectionC = sectionCRes.data;

        const specMap = {};
        sectionC.admissions.forEach((a) => {
          if (!specMap[a.departmentName]) {
            specMap[a.departmentName] = { slNo: Object.keys(specMap).length + 1, department: a.departmentName };
          }
          specMap[a.departmentName][a.year] = {
            intake: a.intake,
            filled: a.filled,
            percentage: a.intake > 0 ? a.filled / a.intake * 100 : 0, // Keep as number
          };
        });
        const specialization = Object.values(specMap);

        const facMap = {};
        sectionC.facultyDetails.forEach((f) => {
          if (!facMap[f.departmentName]) {
            facMap[f.departmentName] = { slNo: Object.keys(facMap).length + 1, department: f.departmentName, intake: f.intake };
          }
          facMap[f.departmentName][f.year] = {
            prof: f.professors,
            asp: f.associateProfessors,
            ap: f.assistantProfessors,
          };
        });
        const facultyDetails = Object.values(facMap);

        const phdHolders = sectionC.phdInfos.map((p) => ({
          year: p.year,
          totalFaculty: p.totalFaculties,
          phdHolders: p.phdHolders,
          percentage: p.totalFaculties > 0 ? p.phdHolders / p.totalFaculties * 100 : 0, // Keep as number
        }));

        const placeMap = {};
        sectionC.placements.forEach((pl) => {
          if (!placeMap[pl.departmentName]) {
            placeMap[pl.departmentName] = { slNo: Object.keys(placeMap).length + 1, department: pl.departmentName };
          }
          placeMap[pl.departmentName][pl.year] = {
            a: pl.placements,
            b: pl.higherEducation,
            c: pl.entrepreneurship,
          };
        });
        const placementData = Object.values(placeMap);

        const sumMap = {};
        sectionC.studentCounts.forEach((sc) => {
          if (!sumMap[sc.departmentName]) {
            sumMap[sc.departmentName] = { slNo: Object.keys(sumMap).length + 1, department: sc.departmentName };
          }
          sumMap[sc.departmentName][sc.year] = {
            n: sc.n,
            x: sc.x,
            percentage: sc.n > 0 ? (sc.x / sc.n * 100).toFixed(2) : '0.00'
          };
        });
        const placementSummary = Object.values(sumMap);

        const studentContactDetails = sectionC.studentContacts.map((sc, idx) => ({
          slNo: idx + 1,
          nameAndDepartment: sc.nameAndDept,
          email: sc.email,
        }));

        const salaryDetails = [
          {
            particular: 'Highest salary',
            ...sectionC.placementSalaries.reduce((acc, ps) => ({ ...acc, [ps.year]: ps.highest }), {}),
          },
          {
            particular: 'Lowest salary',
            ...sectionC.placementSalaries.reduce((acc, ps) => ({ ...acc, [ps.year]: ps.lowest }), {}),
          },
          {
            particular: 'Median salary',
            ...sectionC.placementSalaries.reduce((acc, ps) => ({ ...acc, [ps.year]: ps.median }), {}),
          },
          {
            particular: 'Mean salary',
            ...sectionC.placementSalaries.reduce((acc, ps) => ({ ...acc, [ps.year]: ps.mean }), {}),
          },
        ];

        const activeMoUs = sectionC.activeMoUs.reduce((acc, am) => ({ ...acc, [am.year]: am.count }), {});

        const foreignMoUs = sectionC.moUForeignUniversities.map((m, idx) => ({
          slNo: idx + 1,
          university: m.universityName,
          country: m.country,
          validUpto: m.validUpto ? m.validUpto.split('T')[0] : '',
          link: m.link,
        }));

        const sectionCData = {
          sectionCDriveLink: sectionC.sectionCDriveLink,
          specialization,
          facultyDetails,
          phdHolders,
          avgTeachingExperience: sectionC.averageTeachingExperience,
          creditsEarned: sectionC.noOfCreditsEarned,
          contactHours: sectionC.noOfContactHours,
          belowThresholdFaculty: sectionC.noOfFacultyBelowThreshold,
          placementData,
          placementSummary,
          studentContactDetails,
          salaryDetails,
          activeMoUs,
          nepImplementation: sectionC.implementingNEP ? 'Yes' : 'No',
          multipleEntryExit: sectionC.implementingMEME ? 'Yes' : 'No',
          interCollegeCompetitions: sectionC.interCollegeCompetitions,
          intraCollegeCompetitions: sectionC.intraCollegeCompetitions,
          clubsSocieties: sectionC.noOfClubs,
          mentorMenteeRatio: sectionC.mentorMenteeSystem,
          studentCounsellor: sectionC.studentCounsellor ? 'Yes' : 'No',
          programsConducted: sectionC.noOfProgramsConducted,
          hasForeignMoUs: sectionC.moUForeignUniversities.length > 0,
          foreignMoUs,
          foreignLanguageTraining: sectionC.foreignLanguageTraining ? 'Yes' : 'No',
          foreignLanguageCertLink: sectionC.foreignLanguageTraining,
        };

        // Fetch Section D - UPDATED
const sectionDRes = await axios.get(
  `https://qae-server.vercel.app/api/submit/submissions/section-d?years=${inputYear}`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);
const sectionD = sectionDRes.data;

// Process Section D data to match backend response structure
const departmentLibrary = sectionD.departmentLibraries?.map((dl, idx) => ({
  department: dl.department || dl.departmentName || '',
  volumes: dl.noVolumes || dl.volumes || '',
})) || [];

const hostelDetails = [
  { 
    type: 'Boys', 
    rooms: sectionD.hostels?.boys?.noRooms || sectionD.hostels?.boys?.capacity || 0, 
    capacity: sectionD.hostels?.boys?.capacity || 0, 
    occupied: sectionD.hostels?.boys?.occupied || 0 
  },
  { 
    type: 'Girls', 
    rooms: sectionD.hostels?.girls?.noRooms || sectionD.hostels?.girls?.capacity || 0, 
    capacity: sectionD.hostels?.girls?.capacity || 0, 
    occupied: sectionD.hostels?.girls?.occupied || 0 
  },
  { 
    type: 'Total', 
    rooms: sectionD.hostels?.total?.noRooms || 0,
    capacity: sectionD.hostels?.total?.capacity || 0,
    occupied: sectionD.hostels?.total?.occupied || 0
  }
].filter(h => h.rooms > 0 || h.capacity > 0 || h.occupied > 0); // Only show if data exists

const sportsFacilities = sectionD.sportsFacilities?.map((sf) => ({
  id: sf.id || '',
  particular: sf.particular,
  area: typeof sf.area === 'number' ? sf.area.toFixed(2) : sf.area || '',
})) || [];

const sectionDData = {
  sectionDDriveLink: sectionD.sectionDDriveLink || 'N/A',
  status: sectionD.status || 'N/A',
  sectionDCompleted: sectionD.sectionDCompleted || false,
  
  // General Infrastructure
  campusArea: sectionD.campusArea ? Number(sectionD.campusArea).toLocaleString('en-IN') + ' sq.ft' : 'N/A',
  builtUpArea: sectionD.totalBuiltUpArea ? Number(sectionD.totalBuiltUpArea).toLocaleString('en-IN') + ' sq.ft' : 'N/A',
  classrooms: sectionD.noClassrooms || 'N/A',
  laboratories: sectionD.noLaboratories || 'N/A',
  facultyCabins: sectionD.noFacultyCabins || 'N/A',
  conferenceHalls: sectionD.noConferenceHalls || 'N/A',
  auditoriums: sectionD.noAuditoriums || 'N/A',
  studentComputerRatio: sectionD.studentComputerRatio || 'N/A',
  
  // Facilities
  stpPlant: sectionD.hasSTP === 'yes' || sectionD.stpPlant === 'Yes' ? 'Yes' : 'No',
  stpOutcome: (sectionD.hasSTP === 'yes' || sectionD.stpPlant === 'Yes') ? (sectionD.stpDetails || sectionD.stpPlant || 'N/A') : 'N/A',
  wasteDisposalMoU: sectionD.moUWasteDisposal === 'yes' || sectionD.moUWasteDisposal === true ? 'Yes' : 'No',
  nss: sectionD.hasNSS === 'yes' || sectionD.hasNSS === true ? 'Yes' : 'No',
  ncc: sectionD.hasNCC === 'yes' || sectionD.hasNCC === true ? 'Yes' : 'No',
  cellsCommittees: sectionD.cellsCommittees || 'N/A',
  atm: sectionD.hasATM === 'yes' || sectionD.hasATM === true ? 'Yes' : 'No',
  wifi: (sectionD.hasWiFi === 'yes' || sectionD.hasWiFi === true || sectionD.hasWifi === 'Yes') ? 'Yes' : 'No',
  wifiDetails: sectionD.hasWiFi === 'yes' || sectionD.hasWifi === 'Yes' ? (sectionD.wifiDetails || sectionD.hasWifi || 'N/A') : 'N/A',
  iqac: sectionD.hasIQAC === 'yes' || sectionD.hasIQAC ? 'Yes' : 'No',
  iqacEstablished: sectionD.iqacEstablishmentDate || sectionD.hasIQAC ? 
    (typeof sectionD.iqacEstablishmentDate === 'string' ? 
      sectionD.iqacEstablishmentDate.split('T')[0] : 
      new Date(sectionD.iqacEstablishmentDate).toLocaleDateString('en-US')
    ) : 'N/A',
  
  // Library
  centralLibrary: sectionD.centralLibraryArea ? Number(sectionD.centralLibraryArea).toLocaleString('en-IN') + ' sq.ft' : 'N/A',
  booksVolumes: sectionD.noVolumes ? Number(sectionD.noVolumes).toLocaleString('en-IN') : 'N/A',
  booksAddedLastThreeYears: sectionD.noBooksAddedLast3 ? Number(sectionD.noBooksAddedLast3).toLocaleString('en-IN') : 'N/A',
  printedJournals: sectionD.noPrintedJournals ? Number(sectionD.noPrintedJournals).toLocaleString('en-IN') : 'N/A',
  onlineJournals: sectionD.noOnlineJournals ? Number(sectionD.noOnlineJournals).toLocaleString('en-IN') : 'N/A',
  avgFacultyVisitsPerMonth: sectionD.avgFacultyVisitsPerMonth ? Number(sectionD.avgFacultyVisitsPerMonth).toLocaleString('en-IN') : 'N/A',
  avgStudentVisitsPerMonth: sectionD.avgStudentVisitsPerMonth ? Number(sectionD.avgStudentVisitsPerMonth).toLocaleString('en-IN') : 'N/A',
  digitalLibrary: sectionD.hasDigitalLibrary === 'yes' || sectionD.digitalLibrary === true ? 'Yes' : 'No',
  
  // Department Libraries
  hasDeptLibrary: sectionD.hasDeptLibrary === 'yes' || departmentLibrary.length > 0 ? 'Yes' : 'No',
  departmentLibrary,
  
  // Hostel
  hasHostel: sectionD.hasHostel === 'yes' || hostelDetails.length > 0 ? 'Yes' : 'No',
  hostelDetails,
  
  // Faculty Quarters
 hasFacultyQuarters: sectionD.hasFacultyQuarters === 'yes' || (sectionD.facultyQuarters && Object.keys(sectionD.facultyQuarters).length > 0) ? 'Yes' : 'No',
  facultyQuarters: sectionD.facultyQuarters && Object.keys(sectionD.facultyQuarters).length > 0 ? {
    quarters: sectionD.facultyQuarters.noQuarters || 0,
    occupied: sectionD.facultyQuarters.occupied || 0,
  } : { quarters: 0, occupied: 0 },
  
  // Guest Rooms
  guestRooms: {
    guestRooms: sectionD.guestRooms?.guestRooms || sectionD.guestRooms?.noGuestRooms || 0,
    commonBoys: sectionD.guestRooms?.commonBoys || 0,
    commonGirls: sectionD.guestRooms?.commonGirls || 0,
  },
  
  // Medical Facilities
  medicalFacilities: {
    registeredPractitioner: (sectionD.medicalFacilities?.registeredPractitioner === 'yes' || 
                           sectionD.medicalFacilities?.registeredPractitioner === true) ? 'Yes' : 'No',
    nursingAssistant: (sectionD.medicalFacilities?.nursingAssistant === 'yes' || 
                      sectionD.medicalFacilities?.nursingAssistant === true) ? 'Yes' : 'No',
    emergencyMedicines: (sectionD.medicalFacilities?.emergencyMedicines === 'yes' || 
                        sectionD.medicalFacilities?.emergencyMedicines === true) ? 'Yes' : 'No',
  },
  
  // Sustainability
  solarPower: sectionD.hasSolar === 'yes' || sectionD.solarPower === 'Yes' ? 'Yes' : 'No',
  solarDetails: sectionD.hasSolar === 'yes' || sectionD.solarPower === 'Yes' ? 
    (sectionD.solarDetails || sectionD.solarPower || 'N/A') : 'N/A',
  sustainableDevelopment: sectionD.hasSustainability === 'yes' || sectionD.sustainableDevelopment === 'Yes' ? 'Yes' : 'No',
  sustainabilityDetails: sectionD.hasSustainability === 'yes' || sectionD.sustainableDevelopment === 'Yes' ? 
    (sectionD.sustainabilityDetails || sectionD.sustainableDevelopment || 'N/A') : 'N/A',
  
  // Sports
  hasSportsFacilities: sectionD.hasSportsFacilities === 'yes' || sportsFacilities.length > 0 ? 'Yes' : 'No',
  sportsFacilities,
};

        // Fetch Section E
        const sectionERes = await axios.get(
          `https://qae-server.vercel.app/api/submit/submissions/section-e?years=${inputYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const sectionE = sectionERes.data;

        const journalPublications = [
          {
            type: 'SCI Indexed',
            ...sectionE.journalPublications.reduce((acc, jp) => ({ ...acc, [jp.year]: jp.sci }), {}),
          },
          {
            type: 'SCIE/WoS Indexed',
            ...sectionE.journalPublications.reduce((acc, jp) => ({ ...acc, [jp.year]: jp.scieWos }), {}),
          },
          {
            type: 'Scopus Indexed',
            ...sectionE.journalPublications.reduce((acc, jp) => ({ ...acc, [jp.year]: jp.scopus }), {}),
          },
        ];

        const conferencePublications = [
          {
            id: 1,
            particular: 'Scopus Indexed',
            ...sectionE.conferenceBooks.reduce((acc, cb) => ({ ...acc, [cb.year]: cb.scopus }), {}),
          },
        ];

        const patents = [
          {
            particular: 'Patents Published',
            ...sectionE.patents.reduce((acc, pt) => ({ ...acc, [pt.year]: pt.published }), {}),
          },
          {
            particular: 'Patents Granted',
            ...sectionE.patents.reduce((acc, pt) => ({ ...acc, [pt.year]: pt.granted }), {}),
          },
          {
            particular: 'Percentage',
            ...sectionE.patents.reduce((acc, pt) => ({ ...acc, [pt.year]: pt.percentage }), {}),
          },
          {
            particular: 'Patents Commercialized',
            ...sectionE.patents.reduce((acc, pt) => ({ ...acc, [pt.year]: pt.commercialized }), {}),
          },
        ];

        // Group by particular for researchProjects, researchGrants, consultancies, seedMoneys
        const groupByParticular = (items) => {
          const map = {};
          items.forEach((item) => {
            if (!map[item.particular]) {
              map[item.particular] = {};
            }
            map[item.particular][item.year] = item.amount;
          });
          return Object.keys(map).map((particular, idx) => ({
            id: idx + 1,
            particular,
            ...generatedYears.reduce((acc, y) => {
              const formatted = formatYear(y);
              return { ...acc, [formatted]: map[particular][formatted] || 0 };
            }, {}),
          }));
        };

        const researchProjects = groupByParticular(sectionE.researchProjects);

        const researchGrants = groupByParticular(sectionE.researchGrants);

        const consultancyWorks = groupByParticular(sectionE.consultancies);

        const seedMoney = groupByParticular(sectionE.seedMoneys);

        const incubationCentres = [
          {
            particular: 'No. of Centres',
            ...sectionE.incubationCentres.reduce((acc, ic) => ({ ...acc, [ic.year]: ic.count }), {}),
          },
         {
            particular: 'Overall Total',
            [formatYear(generatedYears[0])]: sectionE.incubationCentres.reduce((sum, ic) => sum + ic.count, 0),
            ...generatedYears.slice(1).reduce((acc, y) => ({ ...acc, [formatYear(y)]: '' }), {}),
          },
        ];

        const sectionEData = {
          sectionEDriveLink: sectionE.sectionEDriveLink,
          journalPublications,
          conferencePublications,
          patents,
          researchProjects,
          researchGrants,
          consultancyWorks,
          seedMoney,
          incubationCentres,
        };

        // Combine into submissionData
        const fetchedSubmissionData = {
          id: sectionASubmissionId,
          collegeName: sectionAData.institutionName,
          submittedAt: sectionB.submittedAt || 'N/A',
          isPaid: sectionB.isPaid || false,
          sectionA,
          sectionB: sectionBData,
          sectionC: sectionCData,
          sectionD: sectionDData,
          sectionE: sectionEData,
        };

        setSubmissionData(fetchedSubmissionData);
      } catch (err) {
        setError(err.message || 'Failed to fetch submission data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionData();
  }, [submissionId, inputYear]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!submissionData) {
    return <div className="flex justify-center items-center h-screen">No data available</div>;
  }

  const Section = ({ title, icon, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">{icon}</div>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );

  const DataRow = ({ label, value }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-b-0">
      <div className="font-medium text-slate-700">{label}</div>
      <div className="md:col-span-2 text-slate-800 break-words">{value || 'N/A'}</div>
    </div>
  );

  const Table = ({ headers, data }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-4 py-3 text-left font-semibold text-slate-700 border-b text-xs">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              {Object.values(row).map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-3 text-slate-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="min-h-screen bg-gray-50">
        <style>
          {`
            html, body {
              scroll-behavior: auto;
              overflow-y: auto;
            }
            .min-h-screen {
              min-height: 100vh;
              overflow: visible;
            }
          `}
        </style>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-teal-50 rounded-lg transition-colors border border-teal-200"
              aria-label="Back to ranking management"
            >
              <ArrowLeft className="w-5 h-5 text-teal-700" />
            </button>
            <span className="text-teal-700 text-sm font-medium">Back to Submissions</span>
          </div>

          {/* Main Header */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-8 shadow-sm mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{submissionData.collegeName}</h1>
                <p className="text-teal-50 text-sm">Submission ID: {submissionData.id} | Submitted: {submissionData.submittedAt} | Status: {submissionData.status}</p>
              </div>
              <button
                onClick={() => generateSubmissionPDF(submissionData)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-lg font-medium text-sm hover:bg-teal-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Section A */}
          <Section title="Section A: General Information and Institute Details" icon={<Building2 className="w-6 h-6" />}>
            <DataRow label="Institution Name" value={submissionData.sectionA.name} />
            <DataRow label="Year of Establishment" value={submissionData.sectionA.yearEstablished} />
            <DataRow label="Address" value={submissionData.sectionA.address} />
            <DataRow label="Pincode" value={submissionData.sectionA.pinCode} />
            <DataRow label="State" value={submissionData.sectionA.state} />
            <DataRow
              label="Website"
              value={
                <a href={submissionData.sectionA.website} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 underline">
                  {submissionData.sectionA.website}
                </a>
              }
            />
            <DataRow label="Head of Institution" value={submissionData.sectionA.headName} />
            <DataRow label="Institute Type" value={submissionData.sectionA.ownership} />
            <DataRow label="Institute Category" value={submissionData.sectionA.category } />
            <DataRow label="Affiliated University" value={submissionData.sectionA.affiliatedUniversity} />
            <DataRow label="AICTE Approval" value={`${submissionData.sectionA.aicteApproval}`} />
            <DataRow label="NBA Accreditation" value={`${submissionData.sectionA.nbaAccredited}`} />
            <DataRow label="NAAC Accreditation" value={`Score: ${submissionData.sectionA.naacScore} | Valid till: ${submissionData.sectionA.naacValidity}`} />
            <DataRow label="Other Accreditation" value={submissionData.sectionA.otherAccreditations} />
            <DataRow label="Applicant Name" value={submissionData.sectionA.applicantName} />
            <DataRow label="Applicant Designation" value={submissionData.sectionA.applicantDesignation} />
            <DataRow label="Contact Number" value={submissionData.sectionA.applicantContact} />
            <DataRow label="Email" value={submissionData.sectionA.applicantEmail} />
            <DataRow label="Field" value={submissionData.sectionA.field} />
          </Section>

          {/* Section B */}
          <Section title="Section B: Gender Information, Diversity and Finance" icon={<Users className="w-6 h-6" />}>
            <DataRow
              label="Section B Drive Link"
              value={
                submissionData.sectionB.sectionBDriveLink !== 'N/A' ? (
                  <a href={submissionData.sectionB.sectionBDriveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Section B Documents
                  </a>
                ) : (
                  'N/A'
                )
              }
            />
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Gender Information (Students Admitted)</h3>
            <Table headers={['Gender', ...years.sectionB.map(formatYear)]} data={submissionData.sectionB.genderInfo} />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Diversity Information</h3>
            <Table headers={['Category', ...years.sectionB.map(formatYear)]} data={submissionData.sectionB.diversityInfo} />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Exam Scores and Rank Details</h3>
            <Table headers={['Sl.No', 'Department', 'Exam Name', 'Highest Rank', 'Lowest Rank']} data={submissionData.sectionB.examScores} />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Financial Details (Last Academic Year)</h3>
            <DataRow label="Average Tuition Fees (per year)" value={`₹${Number(submissionData.sectionB.avgTuitionFees).toLocaleString('en-IN')}`} />
            <DataRow label="Other Fees (per year)" value={`₹${Number(submissionData.sectionB.otherFees).toLocaleString('en-IN')}`} />
            <DataRow label="Hostel Fees (per year)" value={`₹${Number(submissionData.sectionB.hostelFees).toLocaleString('en-IN')}`} />
            <DataRow label="Total Teaching Staff Expenses" value={`₹${Number(submissionData.sectionB.teachingSalaryExpense).toLocaleString('en-IN')}`} />
            <DataRow label="Total Lab Expenses" value={`₹${Number(submissionData.sectionB.labExpenses).toLocaleString('en-IN')}`} />
            <DataRow label="Per Student Expenditure" value={`₹${Number(submissionData.sectionB.perStudentExpenditure).toLocaleString('en-IN')}`} />
          </Section>

          {/* Section C (restored original logic) */}
          <Section title="Section C: Academics" icon={<GraduationCap className="w-6 h-6" />}>
            <DataRow
              label="Section C Drive Link"
              value={
                submissionData.sectionC.sectionCDriveLink !== 'N/A' ? (
                  <a href={submissionData.sectionC.sectionCDriveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Section C Documents
                  </a>
                ) : (
                  'N/A'
                )
              }
            />
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Specialization Details - Student Admission</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b text-xs">Sl.No</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b text-xs">Department</th>
                    {years.sectionC.map((year) => (
                      <th key={year} colSpan="3" className="px-4 py-3 text-center font-semibold text-slate-700 border-b text-xs">
                        {formatYear(year)}
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs border-b"></th>
                    <th className="px-4 py-2 text-left text-xs border-b"></th>
                    {years.sectionC.map((year) => (
                      <React.Fragment key={year}>
                        <th className="px-4 py-2 text-left text-xs border-b">Intake</th>
                        <th className="px-4 py-2 text-left text-xs border-b">Filled</th>
                        <th className="px-4 py-2 text-left text-xs border-b">%</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissionData.sectionC.specialization.map((row) => (
                    <tr key={row.slNo} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-slate-700">{row.slNo}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{row.department}</td>
                      {years.sectionC.map((year) => {
                        const formattedYear = formatYear(year);
                        return (
                          <React.Fragment key={formattedYear}>
                            <td className="px-4 py-3 text-slate-700">{row[formattedYear]?.intake || ''}</td>
                            <td className="px-4 py-3 text-slate-700">{row[formattedYear]?.filled || ''}</td>
                            <td className="px-4 py-3 text-slate-700">{row[formattedYear]?.percentage || ''}</td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Faculty Details</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b text-xs">Sl.No</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b text-xs">Department</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b text-xs">Intake</th>
                    {years.sectionC.map((year) => (
                      <th key={year} colSpan="3" className="px-4 py-3 text-center font-semibold text-slate-700 border-b text-xs">
                        {formatYear(year)}
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs border-b"></th>
                    <th className="px-4 py-2 text-left text-xs border-b"></th>
                    <th className="px-4 py-2 text-left text-xs border-b"></th>
                    {years.sectionC.map((year) => (
                      <React.Fragment key={year}>
                        <th className="px-4 py-2 text-left text-xs border-b">Prof</th>
                        <th className="px-4 py-2 text-left text-xs border-b">ASP</th>
                        <th className="px-4 py-2 text-left text-xs border-b">AP</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissionData.sectionC.facultyDetails.map((row) => (
                    <tr key={row.slNo} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-slate-700">{row.slNo}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{row.department}</td>
                      <td className="px-4 py-3 text-slate-700">{row.intake}</td>
                      {years.sectionC.map((year) => {
                        const formattedYear = formatYear(year);
                        return (
                          <React.Fragment key={formattedYear}>
                            <td className="px-4 py-3 text-slate-700">{row[formattedYear]?.prof || ''}</td>
                            <td className="px-4 py-3 text-slate-700">{row[formattedYear]?.asp || ''}</td>
                            <td className="px-4 py-3 text-slate-700">{row[formattedYear]?.ap || ''}</td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Faculty Totals and V Formula</h3> */}
            {/* <Table
              headers={['Year', 'Total Professors', 'Total Associate Professors', 'Total Assistant Professors', 'V Formula']}
              data={years.sectionC.map((year) => {
                const formattedYear = formatYear(year);
                return {
                  Year: formattedYear,
                  'Total Professors': submissionData.sectionC.facultyDetails.reduce((sum, row) => sum + (Number(row[formattedYear]?.prof) || 0), 0),
                  'Total Associate Professors': submissionData.sectionC.facultyDetails.reduce((sum, row) => sum + (Number(row[formattedYear]?.asp) || 0), 0),
                  'Total Assistant Professors': submissionData.sectionC.facultyDetails.reduce((sum, row) => sum + (Number(row[formattedYear]?.ap) || 0), 0),
                  'V Formula': (
                    (3 * submissionData.sectionC.facultyDetails.reduce((sum, row) => sum + (Number(row[formattedYear]?.prof) || 0), 0) +
                      2 * submissionData.sectionC.facultyDetails.reduce((sum, row) => sum + (Number(row[formattedYear]?.asp) || 0), 0) +
                      submissionData.sectionC.facultyDetails.reduce((sum, row) => sum + (Number(row[formattedYear]?.ap) || 0), 0)) /
                    2.5
                  ).toFixed(2),
                };
              })}
            /> */}

            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">PhD Holders (Permanent Faculty)</h3>
            <Table
              headers={['Year', 'Total Faculty', 'PhD Holders', 'Percentage']}
              data={submissionData.sectionC.phdHolders.map((row) => ({
                Year: row.year,
                'Total Faculty': row.totalFaculty,
                'PhD Holders': row.phdHolders,
                Percentage: row.percentage,
              }))}
            />
            {/* Faculty Information */}
            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Faculty Information</h3>
            <DataRow label="Average Teaching Experience" value={submissionData.sectionC.avgTeachingExperience} />
            <DataRow label="Credits Earned by Students" value={submissionData.sectionC.creditsEarned} />
            <DataRow label="Contact Hours" value={submissionData.sectionC.contactHours} />
            <DataRow label="Faculty Below Feedback Threshold" value={submissionData.sectionC.belowThresholdFaculty} />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Placement(A), Higher Education(B), and Entrepreneurship(C)</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b text-xs">Sl.No</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b text-xs">Department</th>
                    {years.sectionC.map((year) => (
                      <th key={year} colSpan="4" className="px-4 py-3 text-center font-semibold text-slate-700 border-b text-xs">
                        {formatYear(year)}
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs border-b"></th>
                    <th className="px-4 py-2 text-left text-xs border-b"></th>
                    {years.sectionC.map((year) => (
                      <React.Fragment key={year}>
                        <th className="px-4 py-2 text-left text-xs border-b">A</th>
                        <th className="px-4 py-2 text-left text-xs border-b">B</th>
                        <th className="px-4 py-2 text-left text-xs border-b">C</th>
                        <th className="px-4 py-2 text-left text-xs border-b">Total</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissionData.sectionC.placementData.map((row) => (
                    <tr key={row.slNo} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-slate-700">{row.slNo}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{row.department}</td>
                      {years.sectionC.map((year) => {
                        const formattedYear = formatYear(year);
                        return (
                          <React.Fragment key={formattedYear}>
                            <td className="px-4 py-3 text-slate-700">{row[formattedYear]?.a || ''}</td>
                            <td className="px-4 py-3 text-slate-700">{row[formattedYear]?.b || ''}</td>
                            <td className="px-4 py-3 text-slate-700">{row[formattedYear]?.c || ''}</td>
                            <td className="px-4 py-3 text-slate-700">
                              {Number(row[formattedYear]?.a || 0) + Number(row[formattedYear]?.b || 0) + Number(row[formattedYear]?.c || 0)}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Placement Summary</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b text-xs">Sl.No</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b text-xs">Department</th>
                    {years.sectionC.map((year) => (
                      <th key={year} colSpan="3" className="px-4 py-3 text-center font-semibold text-slate-700 border-b text-xs">
                        {formatYear(year)}
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs border-b"></th>
                    <th className="px-4 py-2 text-left text-xs border-b"></th>
                    {years.sectionC.map((year) => (
                      <React.Fragment key={year}>
                        <th className="px-4 py-2 text-left text-xs border-b">N</th>
                        <th className="px-4 py-2 text-left text-xs border-b">X</th>
                        <th className="px-4 py-2 text-left text-xs border-b">%</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissionData.sectionC.placementSummary.map((row) => (
                    <tr key={row.slNo} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-slate-700">{row.slNo}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{row.department}</td>
                      {years.sectionC.map((year) => {
                        const formattedYear = formatYear(year);
                        return (
                          <React.Fragment key={formattedYear}>
                            <td className="px-4 py-3 text-slate-700">{row[formattedYear]?.n || ''}</td>
                            <td className="px-4 py-3 text-slate-700">{row[formattedYear]?.x || ''}</td>
                            <td className="px-4 py-3 text-slate-700">{row[formattedYear]?.percentage || ''}</td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Student Contact Details (Last Passed Out Batch)</h3>
            <Table
              headers={['Sl.No', 'Name and Department', 'E-Mail Id']}
              data={submissionData.sectionC.studentContactDetails.map((row) => ({
                'Sl.No': row.slNo,
                'Name and Department': row.nameAndDepartment,
                'E-Mail Id': row.email,
              }))}
            />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Placement Salary Details</h3>
            <Table
              headers={['Particular', ...years.sectionC.map(formatYear)]}
              data={submissionData.sectionC.salaryDetails.map((row) => ({
                Particular: row.particular,
                ...years.sectionC.reduce(
                  (acc, year) => ({
                    ...acc,
                    [formatYear(year)]: `₹${Number(row[formatYear(year)] || 0).toLocaleString('en-IN')}`,
                  }),
                  {}
                ),
              }))}
            />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Active MoUs</h3>
            <Table
              headers={['Year', 'No. of Active MoUs']}
              data={[
                ...years.sectionC.map((year) => ({
                  Year: formatYear(year),
                  'No. of Active MoUs': submissionData.sectionC.activeMoUs[formatYear(year)] || 0,
                })),
                {
                  Year: 'Total',
                  'No. of Active MoUs': Object.values(submissionData.sectionC.activeMoUs).reduce((sum, val) => sum + Number(val || 0), 0),
                },
              ]}
            />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Other Academic Details</h3>
            <DataRow label="NEP 2020 Implementation" value={submissionData.sectionC.nepImplementation} />
            <DataRow label="Multiple Entry & Exit Scheme" value={submissionData.sectionC.multipleEntryExit} />
            <DataRow label="Inter College Competitions (Last AY)" value={submissionData.sectionC.interCollegeCompetitions} />
            <DataRow label="Intra College Competitions (Last AY)" value={submissionData.sectionC.intraCollegeCompetitions} />
            <DataRow label="Clubs and Societies" value={submissionData.sectionC.clubsSocieties} />
            <DataRow label="Mentor-Mentee Ratio" value={submissionData.sectionC.mentorMenteeRatio} />
            <DataRow label="Student Counsellor Available" value={submissionData.sectionC.studentCounsellor} />
            <DataRow label="Programs Conducted (Yoga, etc.)" value={submissionData.sectionC.programsConducted} />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">MoUs with Foreign Universities</h3>
            <DataRow label="MoUs with Foreign Universities" value={submissionData.sectionC.hasForeignMoUs ? 'Yes' : 'No'} />
            {submissionData.sectionC.hasForeignMoUs && submissionData.sectionC.foreignMoUs?.length > 0 && (
              <Table
                headers={['Sl.No', 'University', 'Country', 'Valid Upto', 'Link']}
                data={submissionData.sectionC.foreignMoUs.map((row) => ({
                  'Sl.No': row.slNo,
                  University: row.university,
                  Country: row.country,
                  'Valid Upto': row.validUpto,
                  Link: <a href={row.link} className="text-blue-600 hover:underline">Collaboration Details</a>,
                }))}
              />
            )}

           <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Foreign Language Training</h3>
<DataRow label="Foreign Language Training" value={submissionData.sectionC.foreignLanguageTraining} />
{submissionData.sectionC.foreignLanguageTraining === 'Yes' && (
  <DataRow
    label="Certificate Details"
    value={
      submissionData.sectionC.foreignLanguageCertLink !== 'N/A' ? (
        <a href={submissionData.sectionC.foreignLanguageCertLink} className="text-blue-600 hover:underline">View Certification Details</a>
      ) : (
        'N/A'
      )
    }
  />
)}
          </Section>

          {/* Section D */}
<Section title="Section D: Infrastructure" icon={<Home className="w-6 h-6" />}>
  <DataRow
    label="Section D Drive Link"
    value={
      submissionData.sectionD.sectionDDriveLink !== 'N/A' ? (
        <a href={submissionData.sectionD.sectionDDriveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          View Section D Documents
        </a>
      ) : (
        'N/A'
      )
    }
  />
  <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Campus Infrastructure</h3>
  <DataRow label="Campus Area (sq.ft)" value={submissionData.sectionD.campusArea || 'N/A'} />
  <DataRow label="Total Built-up Area (sq.ft)" value={submissionData.sectionD.builtUpArea || 'N/A'} />
  <DataRow label="Number of Classrooms" value={submissionData.sectionD.classrooms || 'N/A'} />
  <DataRow label="Number of Laboratories" value={submissionData.sectionD.laboratories || 'N/A'} />
  <DataRow label="Faculty Cabins" value={submissionData.sectionD.facultyCabins || 'N/A'} />
  <DataRow label="Conference/Discussion Halls" value={submissionData.sectionD.conferenceHalls || 'N/A'} />
  <DataRow label="Auditoriums" value={submissionData.sectionD.auditoriums || 'N/A'} />
  <DataRow label="Student Computer Ratio" value={submissionData.sectionD.studentComputerRatio || 'N/A'} />

  <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Facilities</h3>
  <DataRow label="STP Plant" value={submissionData.sectionD.stpPlant} />
  {submissionData.sectionD.stpPlant === 'Yes' && <DataRow label="STP Output" value={submissionData.sectionD.stpOutcome || 'N/A'} />}
  <DataRow label="Waste Disposal MoU" value={submissionData.sectionD.wasteDisposalMoU} />
  <DataRow label="NSS Available" value={submissionData.sectionD.nss} />
  <DataRow label="NCC Available" value={submissionData.sectionD.ncc} />
  <DataRow
    label="Cells/Committees Available"
    value={submissionData.sectionD.cellsCommittees || 'N/A'}
  />
  <DataRow label="ATM on Campus" value={submissionData.sectionD.atm} />
  <DataRow label="Wi-Fi Connectivity" value={submissionData.sectionD.wifi} />
  {submissionData.sectionD.wifi === 'Yes' && <DataRow label="Wi-Fi Details" value={submissionData.sectionD.wifiDetails || 'N/A'} />}
  <DataRow label="IQAC Established" value={submissionData.sectionD.iqac} />
  {submissionData.sectionD.iqac === 'Yes' && <DataRow label="IQAC Establishment Date" value={submissionData.sectionD.iqacEstablished || 'N/A'} />}

  <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Library Resources</h3>
  <DataRow label="Central Library Area (sq.ft)" value={submissionData.sectionD.centralLibrary || 'N/A'} />
  <DataRow label="Total Book Volumes" value={submissionData.sectionD.booksVolumes || 'N/A'} />
  <DataRow label="Books Added (Last 3 Years)" value={submissionData.sectionD.booksAddedLastThreeYears || 'N/A'} />
  <DataRow label="Printed Journals" value={submissionData.sectionD.printedJournals || 'N/A'} />
  <DataRow label="Online Journals" value={submissionData.sectionD.onlineJournals || 'N/A'} />
  <DataRow label="Average Faculty Library Visits/Month" value={submissionData.sectionD.avgFacultyVisitsPerMonth || 'N/A'} />
  <DataRow label="Average Student Library Visits/Month" value={submissionData.sectionD.avgStudentVisitsPerMonth || 'N/A'} />
  <DataRow label="Digital Library" value={submissionData.sectionD.digitalLibrary} />

  <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Department Libraries</h3>
  <DataRow label="Department Libraries Available" value={submissionData.sectionD.hasDeptLibrary} />
  {submissionData.sectionD.hasDeptLibrary === 'Yes' && submissionData.sectionD.departmentLibrary?.length > 0 ? (
    <Table headers={['Department', 'Volumes']} data={submissionData.sectionD.departmentLibrary.map(item => ({ Department: item.department, Volumes: item.volumes }))} />
  ) : (
    <p className="text-slate-600 text-sm">No department libraries available</p>
  )}

  <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Hostel Details</h3>
  <DataRow label="Hostel Available" value={submissionData.sectionD.hasHostel} />
  {submissionData.sectionD.hasHostel === 'Yes' && submissionData.sectionD.hostelDetails?.length > 0 ? (
    <Table headers={['Type', 'Rooms', 'Capacity', 'Occupied']} data={submissionData.sectionD.hostelDetails.map(item => ({ Type: item.type, Rooms: item.rooms, Capacity: item.capacity, Occupied: item.occupied }))} />
  ) : (
    <p className="text-slate-600 text-sm">No hostel facilities available</p>
  )}

  <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Faculty Quarters</h3>
  <DataRow label="Faculty Quarters Available" value={submissionData.sectionD.hasFacultyQuarters} />
  {submissionData.sectionD.hasFacultyQuarters === 'Yes' && (
    <>
      <DataRow label="Total Quarters" value={submissionData.sectionD.facultyQuarters.quarters || 'N/A'} />
      <DataRow label="Occupied Quarters" value={submissionData.sectionD.facultyQuarters.occupied || 'N/A'} />
    </>
  )}

  <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Common Facilities</h3>
  <DataRow label="Guest Rooms" value={submissionData.sectionD.guestRooms.guestRooms || 'N/A'} />
  <DataRow label="Boys Common Rooms" value={submissionData.sectionD.guestRooms.commonBoys || 'N/A'} />
  <DataRow label="Girls Common Rooms" value={submissionData.sectionD.guestRooms.commonGirls || 'N/A'} />

  <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Medical Facilities</h3>
  <DataRow label="Registered Medical Practitioner" value={submissionData.sectionD.medicalFacilities.registeredPractitioner} />
  <DataRow label="Nursing Assistant" value={submissionData.sectionD.medicalFacilities.nursingAssistant} />
  <DataRow label="Emergency Medicines" value={submissionData.sectionD.medicalFacilities.emergencyMedicines} />

  <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Sustainability Initiatives</h3>
  <DataRow label="Solar Power Initiatives" value={submissionData.sectionD.solarPower} />
  {submissionData.sectionD.solarPower === 'Yes' && <DataRow label="Solar Details" value={submissionData.sectionD.solarDetails || 'N/A'} />}
  <DataRow label="Sustainable Development" value={submissionData.sectionD.sustainableDevelopment} />
  {submissionData.sectionD.sustainableDevelopment === 'Yes' && <DataRow label="Sustainability Details" value={submissionData.sectionD.sustainabilityDetails || 'N/A'} />}

  <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Sports Facilities</h3>
  <DataRow label="Sports Facilities Available" value={submissionData.sectionD.hasSportsFacilities} />
  {submissionData.sectionD.hasSportsFacilities === 'Yes' && submissionData.sectionD.sportsFacilities?.length > 0 ? (
    <Table headers={['Facility', 'Area']} data={submissionData.sectionD.sportsFacilities.map(facility => ({ Facility: facility.particular, Area: facility.area }))} />
  ) : (
    <p className="text-slate-600 text-sm">No sports facilities available</p>
  )}
</Section>
          {/* Section E */}
          <Section title="Section E: Research" icon={<BookOpen className="w-6 h-6" />}>
            <DataRow
              label="Section E Drive Link"
              value={
                submissionData.sectionE.sectionEDriveLink !== 'N/A' ? (
                  <a href={submissionData.sectionE.sectionEDriveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Section E Documents
                  </a>
                ) : (
                  'N/A'
                )
              }
            />
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Journal Publications</h3>
            <Table
              headers={['Publication Type', ...years.sectionE.map(formatYear)]}
              data={submissionData.sectionE.journalPublications.map((row) => ({
                'Publication Type': row.type,
                ...years.sectionE.reduce(
                  (acc, year) => ({
                    ...acc,
                    [formatYear(year)]: row[formatYear(year)] || '',
                  }),
                  {}
                ),
              }))}
            />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Conference/Book Chapters Publications</h3>
            <Table
              headers={['Sl.No', 'Particular', ...years.sectionE.map(formatYear)]}
              data={submissionData.sectionE.conferencePublications.map((row) => ({
                'Sl.No': row.id,
                Particular: row.particular,
                ...years.sectionE.reduce(
                  (acc, year) => ({
                    ...acc,
                    [formatYear(year)]: row[formatYear(year)] || '',
                  }),
                  {}
                ),
              }))}
            />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Patents Details</h3>
            <Table
              headers={['Particular', ...years.sectionE.map(formatYear)]}
              data={submissionData.sectionE.patents.map((row) => ({
                Particular: row.particular,
                ...years.sectionE.reduce(
                  (acc, year) => ({
                    ...acc,
                    [formatYear(year)]: row.particular === 'Percentage' ? `${row[formatYear(year)] || '0.00'}%` : row[formatYear(year)] || '',
                  }),
                  {}
                ),
              }))}
            />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Research Projects (Government)</h3>
            <Table
              headers={['Sl.No', 'Particular', ...years.sectionE.map((year) => `${formatYear(year)} (₹)`)]}
              data={[
                ...submissionData.sectionE.researchProjects.map((row) => ({
                  'Sl.No': row.id,
                  Particular: row.particular,
                  ...years.sectionE.reduce(
                    (acc, year) => ({
                      ...acc,
                      [`${formatYear(year)} (₹)`]: `₹${Number(row[formatYear(year)] || 0).toLocaleString('en-IN')}`,
                    }),
                    {}
                  ),
                })),
                {
                  'Sl.No': 'Total',
                  Particular: '',
                  ...years.sectionE.reduce(
                    (acc, year) => ({
                      ...acc,
                      [`${formatYear(year)} (₹)`]: `₹${submissionData.sectionE.researchProjects
                        .reduce((sum, row) => sum + Number(row[formatYear(year)] || 0), 0)
                        .toLocaleString('en-IN')}`,
                    }),
                    {}
                  ),
                },
              ]}
            />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Research Grants (Government)</h3>
            <Table
              headers={['Sl.No', 'Particular', ...years.sectionE.map((year) => `${formatYear(year)} (₹)`)]}
              data={[
                ...submissionData.sectionE.researchGrants.map((row) => ({
                  'Sl.No': row.id,
                  Particular: row.particular,
                  ...years.sectionE.reduce(
                    (acc, year) => ({
                      ...acc,
                      [`${formatYear(year)} (₹)`]: `₹${Number(row[formatYear(year)] || 0).toLocaleString('en-IN')}`,
                    }),
                    {}
                  ),
                })),
                {
                  'Sl.No': 'Total',
                  Particular: '',
                  ...years.sectionE.reduce(
                    (acc, year) => ({
                      ...acc,
                      [`${formatYear(year)} (₹)`]: `₹${submissionData.sectionE.researchGrants
                        .reduce((sum, row) => sum + Number(row[formatYear(year)] || 0), 0)
                        .toLocaleString('en-IN')}`,
                    }),
                    {}
                  ),
                },
              ]}
            />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Consultancy Works</h3>
            <Table
              headers={['Sl.No', 'Particular', ...years.sectionE.map((year) => `${formatYear(year)} (₹)`)]}
              data={[
                ...submissionData.sectionE.consultancyWorks.map((row) => ({
                  'Sl.No': row.id,
                  Particular: row.particular,
                  ...years.sectionE.reduce(
                    (acc, year) => ({
                      ...acc,
                      [`${formatYear(year)} (₹)`]: `₹${Number(row[formatYear(year)] || 0).toLocaleString('en-IN')}`,
                    }),
                    {}
                  ),
                })),
                {
                  'Sl.No': 'Total',
                  Particular: '',
                  ...years.sectionE.reduce(
                    (acc, year) => ({
                      ...acc,
                      [`${formatYear(year)} (₹)`]: `₹${submissionData.sectionE.consultancyWorks
                        .reduce((sum, row) => sum + Number(row[formatYear(year)] || 0), 0)
                        .toLocaleString('en-IN')}`,
                    }),
                    {}
                  ),
                },
              ]}
            />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Seed Money</h3>
            <Table
              headers={['Sl.No', 'Particular', ...years.sectionE.map((year) => `${formatYear(year)} (₹)`)]}
              data={[
                ...submissionData.sectionE.seedMoney.map((row) => ({
                  'Sl.No': row.id,
                  Particular: row.particular,
                  ...years.sectionE.reduce(
                    (acc, year) => ({
                      ...acc,
                      [`${formatYear(year)} (₹)`]: `₹${Number(row[formatYear(year)] || 0).toLocaleString('en-IN')}`,
                    }),
                    {}
                  ),
                }))
              ]}
            />

            <h3 className="font-semibold text-slate-800 mb-3 mt-6 text-sm uppercase tracking-wide">Incubation Centres</h3>
            <Table
              headers={['Particular', ...years.sectionE.map(formatYear)]}
              data={submissionData.sectionE.incubationCentres.map((row) => ({
                Particular: row.particular,
                ...years.sectionE.reduce(
                  (acc, year) => ({
                    ...acc,
                    [formatYear(year)]: row[formatYear(year)] || '',
                  }),
                  {}
                ),
              }))}
            />
          </Section>
        </div>
      </div>
    </form>
  );
};

export default SubmissionDetailPage;