import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import axios from 'axios';

const SectionD = ({ onNext, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasDeptLibrary, setHasDeptLibrary] = useState('no');
  const [hasHostel, setHasHostel] = useState('no');
  const [hasFacultyQuarters, setHasFacultyQuarters] = useState('no');
  const [hasSportsFacilities, setHasSportsFacilities] = useState('no');
  const [hasSTP, setHasSTP] = useState('no');
  const [hasWiFi, setHasWiFi] = useState('no');
  const [hasIQAC, setHasIQAC] = useState('no');
  const [hasSolar, setHasSolar] = useState('no');
  const [hasSustainability, setHasSustainability] = useState('no');

  const [generalData, setGeneralData] = useState({
    campusArea: '',
    totalBuiltUpArea: '',
    noClassrooms: '',
    noLaboratories: '',
    noFacultyCabins: '',
    noConferenceHalls: '',
    noAuditoriums: '',
    studentComputerRatio: '',
    moUWasteDisposal: 'no',
    hasNSS: 'no',
    hasNCC: 'no',
    cellsCommittees: '',
    hasATM: 'no',
    stpDetails: '',
    wifiDetails: '',
    iqacEstablishmentDate: '',
  });

  const [libraryData, setLibraryData] = useState({
    centralLibraryArea: '',
    noVolumes: '',
    noBooksAddedLast3: '',
    noPrintedJournals: '',
    noOnlineJournals: '',
    avgFacultyVisitsPerMonth: '',
    avgStudentVisitsPerMonth: '',
    hasDigitalLibrary: 'no',
  });

  const [deptLibraryData, setDeptLibraryData] = useState([
    { id: 1, department: '', volumes: '' },
    { id: 2, department: '', volumes: '' },
    { id: 3, department: '', volumes: '' },
  ]);

  const [sportsData, setSportsData] = useState([
    { id: 1, particular: '', area: '' },
    { id: 2, particular: '', area: '' },
    { id: 3, particular: '', area: '' },
  ]);

  const [hostelData, setHostelData] = useState({
    boys: { noRooms: '', capacity: '', occupied: '' },
    girls: { noRooms: '', capacity: '', occupied: '' },
  });

  const [facultyQuartersData, setFacultyQuartersData] = useState({
    noQuarters: '',
    occupied: '',
  });

  const [guestRoomsData, setGuestRoomsData] = useState({
    guestRooms: '',
    commonBoys: '',
    commonGirls: '',
  });

  const [medicalFacilitiesData, setMedicalFacilitiesData] = useState({
    registeredPractitioner: 'no',
    nursingAssistant: 'no',
    emergencyMedicines: 'no',
  });

  const [sustainabilityData, setSustainabilityData] = useState({
    solarDetails: '',
    sustainabilityDetails: '',
  });

  const [sectionDDriveLink, setSectionDDriveLink] = useState('');

  // Fetch existing Section D data on component mount
  useEffect(() => {
    const fetchSectionDData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://qae-server.vercel.app/api/submit/submissions/section-d?year=2025', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setGeneralData({
          campusArea: data.campusArea || '',
          totalBuiltUpArea: data.totalBuiltUpArea || '',
          noClassrooms: data.noClassrooms || '',
          noLaboratories: data.noLaboratories || '',
          noFacultyCabins: data.noFacultyCabins || '',
          noConferenceHalls: data.noConferenceHalls || '',
          noAuditoriums: data.noAuditoriums || '',
          studentComputerRatio: data.studentComputerRatio || '',
          moUWasteDisposal: data.moUWasteDisposal || 'no',
          hasNSS: data.hasNSS || 'no',
          hasNCC: data.hasNCC || 'no',
          cellsCommittees: data.cellsCommittees || '',
          hasATM: data.hasATM || 'no',
          stpDetails: data.stpDetails || '',
          wifiDetails: data.wifiDetails || '',
          iqacEstablishmentDate: data.iqacEstablishmentDate ? data.iqacEstablishmentDate.split('T')[0] : '',
        });

        setLibraryData({
          centralLibraryArea: data.centralLibraryArea || '',
          noVolumes: data.noVolumes || '',
          noBooksAddedLast3: data.noBooksAddedLast3 || '',
          noPrintedJournals: data.noPrintedJournals || '',
          noOnlineJournals: data.noOnlineJournals || '',
          avgFacultyVisitsPerMonth: data.avgFacultyVisitsPerMonth || '',
          avgStudentVisitsPerMonth: data.avgStudentVisitsPerMonth || '',
          hasDigitalLibrary: data.hasDigitalLibrary || 'no',
        });

        setHasDeptLibrary(data.hasDeptLibrary || 'no');
        setDeptLibraryData(
          data.departmentLibraries.length > 0
            ? data.departmentLibraries.map((dl, index) => ({
                id: index + 1,
                department: dl.department || '',
                volumes: dl.volumes || '',
              }))
            : deptLibraryData
        );

        setHasHostel(data.hasHostel || 'no');
        setHostelData({
          boys: data.hostels.boys || { noRooms: '', capacity: '', occupied: '' },
          girls: data.hostels.girls || { noRooms: '', capacity: '', occupied: '' },
        });

        setHasFacultyQuarters(data.hasFacultyQuarters || 'no');
        setFacultyQuartersData({
          noQuarters: data.facultyQuarters.noQuarters || '',
          occupied: data.facultyQuarters.occupied || '',
        });

        setGuestRoomsData({
          guestRooms: data.guestRooms.guestRooms || '',
          commonBoys: data.guestRooms.commonBoys || '',
          commonGirls: data.guestRooms.commonGirls || '',
        });

        setMedicalFacilitiesData({
          registeredPractitioner: data.medicalFacilities.registeredPractitioner || 'no',
          nursingAssistant: data.medicalFacilities.nursingAssistant || 'no',
          emergencyMedicines: data.medicalFacilities.emergencyMedicines || 'no',
        });

        setHasSportsFacilities(data.hasSportsFacilities || 'no');
        setSportsData(
          data.sportsFacilities.length > 0
            ? data.sportsFacilities.map((sf, index) => ({
                id: index + 1,
                particular: sf.particular || '',
                area: sf.area || '',
              }))
            : sportsData
        );

        setHasSTP(data.hasSTP || 'no');
        setHasWiFi(data.hasWiFi || 'no');
        setHasIQAC(data.hasIQAC || 'no');
        setHasSolar(data.hasSolar || 'no');
        setHasSustainability(data.hasSustainability || 'no');

        setSustainabilityData({
          solarDetails: data.solarDetails || '',
          sustainabilityDetails: data.sustainabilityDetails || '',
        });

        setSectionDDriveLink(data.sectionDDriveLink || '');
      } catch (err) {
        if (err.response?.status === 404) {
          // Submission not found, keep default form values
        } else {
          setError('Failed to fetch Section D data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSectionDData();
  }, []);

  // Calculate hostel totals for display
  const calculateHostelTotals = () => {
    return {
      noRooms: (Number(hostelData.boys.noRooms) || 0) + (Number(hostelData.girls.noRooms) || 0),
      capacity: (Number(hostelData.boys.capacity) || 0) + (Number(hostelData.girls.capacity) || 0),
      occupied: (Number(hostelData.boys.occupied) || 0) + (Number(hostelData.girls.occupied) || 0),
    };
  };

  const hostelTotals = calculateHostelTotals();

  // Handle input changes
  const handleGeneralChange = (field, value) => {
    setGeneralData(prev => ({ ...prev, [field]: value }));
  };

  const handleLibraryChange = (field, value) => {
    setLibraryData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeptLibraryChange = (id, field, value) => {
    setDeptLibraryData(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const addDeptLibraryRow = () => {
    const newId = Math.max(...deptLibraryData.map(row => row.id), 0) + 1;
    setDeptLibraryData(prev => [...prev, { id: newId, department: '', volumes: '' }]);
  };

  const removeDeptLibraryRow = () => {
    setDeptLibraryData(prev => prev.slice(0, -1));
  };

  const handleSportsChange = (id, field, value) => {
    setSportsData(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const addSportsRow = () => {
    const newId = Math.max(...sportsData.map(row => row.id), 0) + 1;
    setSportsData(prev => [...prev, { id: newId, particular: '', area: '' }]);
  };

  const removeSportsRow = () => {
    setSportsData(prev => prev.slice(0, -1));
  };

  const handleHostelChange = (gender, field, value) => {
    setHostelData(prev => ({
      ...prev,
      [gender]: { ...prev[gender], [field]: value },
    }));
  };

  const handleFacultyQuartersChange = (field, value) => {
    setFacultyQuartersData(prev => ({ ...prev, [field]: value }));
  };

  const handleGuestRoomsChange = (field, value) => {
    setGuestRoomsData(prev => ({ ...prev, [field]: value }));
  };

  const handleMedicalFacilitiesChange = (field, value) => {
    setMedicalFacilitiesData(prev => ({ ...prev, [field]: value }));
  };

  const handleSustainabilityChange = (field, value) => {
    setSustainabilityData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      campusArea: generalData.campusArea,
      totalBuiltUpArea: generalData.totalBuiltUpArea,
      noClassrooms: generalData.noClassrooms,
      noLaboratories: generalData.noLaboratories,
      noFacultyCabins: generalData.noFacultyCabins,
      noConferenceHalls: generalData.noConferenceHalls,
      noAuditoriums: generalData.noAuditoriums,
      studentComputerRatio: generalData.studentComputerRatio,
      hasSTP,
      stpDetails: hasSTP === 'yes' ? generalData.stpDetails : '',
      moUWasteDisposal: generalData.moUWasteDisposal,
      hasNSS: generalData.hasNSS,
      hasNCC: generalData.hasNCC,
      cellsCommittees: generalData.cellsCommittees,
      hasATM: generalData.hasATM,
      hasWiFi,
      wifiDetails: hasWiFi === 'yes' ? generalData.wifiDetails : '',
      hasIQAC,
      iqacEstablishmentDate: hasIQAC === 'yes' ? generalData.iqacEstablishmentDate : '',
      centralLibraryArea: libraryData.centralLibraryArea,
      noVolumes: libraryData.noVolumes,
      noBooksAddedLast3: libraryData.noBooksAddedLast3,
      noPrintedJournals: libraryData.noPrintedJournals,
      noOnlineJournals: libraryData.noOnlineJournals,
      avgFacultyVisitsPerMonth: libraryData.avgFacultyVisitsPerMonth,
      avgStudentVisitsPerMonth: libraryData.avgStudentVisitsPerMonth,
      hasDigitalLibrary: libraryData.hasDigitalLibrary,
      hasSolar,
      solarDetails: hasSolar === 'yes' ? sustainabilityData.solarDetails : '',
      hasSustainability,
      sustainabilityDetails: hasSustainability === 'yes' ? sustainabilityData.sustainabilityDetails : '',
      hasHostel,
      hostels: hasHostel === 'yes' ? hostelData : { boys: {}, girls: {} },
      hasFacultyQuarters,
      facultyQuarters: hasFacultyQuarters === 'yes' ? facultyQuartersData : {},
      guestRooms: guestRoomsData,
      medicalFacilities: medicalFacilitiesData,
      hasSportsFacilities,
      sportsFacilities: hasSportsFacilities === 'yes' ? sportsData : [],
      hasDeptLibrary,
      departmentLibraries: hasDeptLibrary === 'yes' ? deptLibraryData : [],
      sectionDDriveLink,
    };

    try {
      const token = localStorage.getItem('token');
      const existingSubmission = await axios.get('https://qae-server.vercel.app/api/submit/submissions/section-d?year=2025', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => null);

      const method = existingSubmission ? 'put' : 'post';
      const url = existingSubmission
        ? 'https://qae-server.vercel.app/api/submit/submissions/section-d?year=2025'
        : 'https://qae-server.vercel.app/api/submit/submissions/section-d';

      await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      alert(method === 'post' ? 'Section D submitted successfully' : 'Section D updated successfully');
      if (onNext) onNext();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit Section D');
      alert(err.response?.data?.error || 'Failed to submit Section D');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full mb-6 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Section D: Infrastructure
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Provide detailed information about the institute's infrastructure, including campus facilities, library, hostels, and more.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="ml-3 text-gray-700 font-medium">Loading...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">General Infrastructure Details</h2>
              <p className="text-teal-100">Provide details about campus area, facilities, and services.</p>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Campus area (in sq. Feet)</label>
                  <input
                    type="number"
                    value={generalData.campusArea}
                    onChange={(e) => handleGeneralChange('campusArea', e.target.value)}
                    placeholder="Enter area"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Total built-up area (in sq. Feet)</label>
                  <input
                    type="number"
                    value={generalData.totalBuiltUpArea}
                    onChange={(e) => handleGeneralChange('totalBuiltUpArea', e.target.value)}
                    placeholder="Enter area"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">No. of Classrooms</label>
                  <input
                    type="number"
                    value={generalData.noClassrooms}
                    onChange={(e) => handleGeneralChange('noClassrooms', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">No. of Laboratories</label>
                  <input
                    type="number"
                    value={generalData.noLaboratories}
                    onChange={(e) => handleGeneralChange('noLaboratories', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">No. of Faculty cabins</label>
                  <input
                    type="number"
                    value={generalData.noFacultyCabins}
                    onChange={(e) => handleGeneralChange('noFacultyCabins', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">No. of Conference/Discussion halls</label>
                  <input
                    type="number"
                    value={generalData.noConferenceHalls}
                    onChange={(e) => handleGeneralChange('noConferenceHalls', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">No. of Auditoriums</label>
                  <input
                    type="number"
                    value={generalData.noAuditoriums}
                    onChange={(e) => handleGeneralChange('noAuditoriums', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Student computer ratio</label>
                  <input
                    type="text"
                    value={generalData.studentComputerRatio}
                    onChange={(e) => handleGeneralChange('studentComputerRatio', e.target.value)}
                    placeholder="Enter ratio (e.g., 1:10)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Availability of STP Plant</label>
                  <div className="flex items-center space-x-6 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="stp"
                        value="yes"
                        checked={hasSTP === 'yes'}
                        onChange={(e) => setHasSTP(e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="stp"
                        value="no"
                        checked={hasSTP === 'no'}
                        onChange={(e) => setHasSTP(e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                  {hasSTP === 'yes' && (
                    <input
                      type="text"
                      value={generalData.stpDetails}
                      onChange={(e) => handleGeneralChange('stpDetails', e.target.value)}
                      placeholder="Enter per day outcome link"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    />
                  )}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Does your institute have MoU for Waste disposal?</label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="waste"
                        value="yes"
                        checked={generalData.moUWasteDisposal === 'yes'}
                        onChange={(e) => handleGeneralChange('moUWasteDisposal', e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="waste"
                        value="no"
                        checked={generalData.moUWasteDisposal === 'no'}
                        onChange={(e) => handleGeneralChange('moUWasteDisposal', e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Does the institute have NSS?</label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="nss"
                        value="yes"
                        checked={generalData.hasNSS === 'yes'}
                        onChange={(e) => handleGeneralChange('hasNSS', e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="nss"
                        value="no"
                        checked={generalData.hasNSS === 'no'}
                        onChange={(e) => handleGeneralChange('hasNSS', e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Does the institute have NCC?</label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="ncc"
                        value="yes"
                        checked={generalData.hasNCC === 'yes'}
                        onChange={(e) => handleGeneralChange('hasNCC', e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="ncc"
                        value="no"
                        checked={generalData.hasNCC === 'no'}
                        onChange={(e) => handleGeneralChange('hasNCC', e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">List the cells/committees available (Anti-Ragging, ICC, etc.)</label>
                  <input
                    type="text"
                    value={generalData.cellsCommittees}
                    onChange={(e) => handleGeneralChange('cellsCommittees', e.target.value)}
                    placeholder="Enter link or list"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Does the institute have ATM?</label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="atm"
                        value="yes"
                        checked={generalData.hasATM === 'yes'}
                        onChange={(e) => handleGeneralChange('hasATM', e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="atm"
                        value="no"
                        checked={generalData.hasATM === 'no'}
                        onChange={(e) => handleGeneralChange('hasATM', e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Does the institute have Wi-Fi?</label>
                  <div className="flex items-center space-x-6 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="wifi"
                        value="yes"
                        checked={hasWiFi === 'yes'}
                        onChange={(e) => setHasWiFi(e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="wifi"
                        value="no"
                        checked={hasWiFi === 'no'}
                        onChange={(e) => setHasWiFi(e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                  {hasWiFi === 'yes' && (
                    <input
                      type="text"
                      value={generalData.wifiDetails}
                      onChange={(e) => handleGeneralChange('wifiDetails', e.target.value)}
                      placeholder="Enter Wi-Fi specifications link"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    />
                  )}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Is your institute having IQAC?</label>
                  <div className="flex items-center space-x-6 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="iqac"
                        value="yes"
                        checked={hasIQAC === 'yes'}
                        onChange={(e) => setHasIQAC(e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="iqac"
                        value="no"
                        checked={hasIQAC === 'no'}
                        onChange={(e) => setHasIQAC(e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                  {hasIQAC === 'yes' && (
                    <input
                      type="date"
                      value={generalData.iqacEstablishmentDate}
                      onChange={(e) => handleGeneralChange('iqacEstablishmentDate', e.target.value)}
                      placeholder="Select date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Library Details</h2>
              <p className="text-teal-100">Provide details about the central and department libraries.</p>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Central Library (in sq. Feet)</label>
                  <input
                    type="number"
                    value={libraryData.centralLibraryArea}
                    onChange={(e) => handleLibraryChange('centralLibraryArea', e.target.value)}
                    placeholder="Enter area"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">No. of Volumes (Books)</label>
                  <input
                    type="number"
                    value={libraryData.noVolumes}
                    onChange={(e) => handleLibraryChange('noVolumes', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">No. of books added in last three years</label>
                  <input
                    type="number"
                    value={libraryData.noBooksAddedLast3}
                    onChange={(e) => handleLibraryChange('noBooksAddedLast3', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">No. of national & international journals (Printed)</label>
                  <input
                    type="number"
                    value={libraryData.noPrintedJournals}
                    onChange={(e) => handleLibraryChange('noPrintedJournals', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">No. of national & international journals (Online)</label>
                  <input
                    type="number"
                    value={libraryData.noOnlineJournals}
                    onChange={(e) => handleLibraryChange('noOnlineJournals', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Average number of Faculty visits per month</label>
                  <input
                    type="number"
                    value={libraryData.avgFacultyVisitsPerMonth}
                    onChange={(e) => handleLibraryChange('avgFacultyVisitsPerMonth', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Average number of Students visits per month</label>
                  <input
                    type="number"
                    value={libraryData.avgStudentVisitsPerMonth}
                    onChange={(e) => handleLibraryChange('avgStudentVisitsPerMonth', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Availability of Digital Library</label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="digital_library"
                        value="yes"
                        checked={libraryData.hasDigitalLibrary === 'yes'}
                        onChange={(e) => handleLibraryChange('hasDigitalLibrary', e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="digital_library"
                        value="no"
                        checked={libraryData.hasDigitalLibrary === 'no'}
                        onChange={(e) => handleLibraryChange('hasDigitalLibrary', e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Availability of Department Library</label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dept_library"
                      value="yes"
                      checked={hasDeptLibrary === 'yes'}
                      onChange={(e) => setHasDeptLibrary(e.target.value)}
                      className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dept_library"
                      value="no"
                      checked={hasDeptLibrary === 'no'}
                      onChange={(e) => setHasDeptLibrary(e.target.value)}
                      className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {hasDeptLibrary === 'yes' && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Sl.No</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Name of the Department</th>
                          <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">No. of Volumes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deptLibraryData.map(row => (
                          <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4 text-center font-medium text-gray-900">{row.id}</td>
                            <td className="py-4 px-6">
                              <input
                                type="text"
                                value={row.department}
                                onChange={(e) => handleDeptLibraryChange(row.id, 'department', e.target.value)}
                                placeholder="Enter department"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                              />
                            </td>
                            <td className="py-4 px-4">
                              <input
                                type="number"
                                value={row.volumes}
                                onChange={(e) => handleDeptLibraryChange(row.id, 'volumes', e.target.value)}
                                placeholder="Enter number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4 flex justify-center space-x-4">
                      <button
                        type="button"
                        onClick={addDeptLibraryRow}
                        className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                      >
                        + Add more rows if required
                      </button>
                      {deptLibraryData.length > 3 && (
                        <button
                          type="button"
                          onClick={removeDeptLibraryRow}
                          className="text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                          - Remove last row
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">Availability of Hostel</h2>
                <p className="text-teal-100">Provide details about hostel facilities.</p>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Availability of Hostel</label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hostel"
                        value="yes"
                        checked={hasHostel === 'yes'}
                        onChange={(e) => setHasHostel(e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hostel"
                        value="no"
                        checked={hasHostel === 'no'}
                        onChange={(e) => setHasHostel(e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {hasHostel === 'yes' && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Sl.No</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Hostel Details</th>
                          <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">No. of Rooms</th>
                          <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Capacity</th>
                          <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Occupied</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-center font-medium text-gray-900">1</td>
                          <td className="py-4 px-6 font-medium text-gray-900">Boys</td>
                          <td className="py-4 px-4">
                            <input
                              type="number"
                              value={hostelData.boys.noRooms}
                              onChange={(e) => handleHostelChange('boys', 'noRooms', e.target.value)}
                              placeholder="Enter number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <input
                              type="number"
                              value={hostelData.boys.capacity}
                              onChange={(e) => handleHostelChange('boys', 'capacity', e.target.value)}
                              placeholder="Enter number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <input
                              type="number"
                              value={hostelData.boys.occupied}
                              onChange={(e) => handleHostelChange('boys', 'occupied', e.target.value)}
                              placeholder="Enter number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            />
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-center font-medium text-gray-900">2</td>
                          <td className="py-4 px-6 font-medium text-gray-900">Girls</td>
                          <td className="py-4 px-4">
                            <input
                              type="number"
                              value={hostelData.girls.noRooms}
                              onChange={(e) => handleHostelChange('girls', 'noRooms', e.target.value)}
                              placeholder="Enter number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <input
                              type="number"
                              value={hostelData.girls.capacity}
                              onChange={(e) => handleHostelChange('girls', 'capacity', e.target.value)}
                              placeholder="Enter number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <input
                              type="number"
                              value={hostelData.girls.occupied}
                              onChange={(e) => handleHostelChange('girls', 'occupied', e.target.value)}
                              placeholder="Enter number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            />
                          </td>
                        </tr>
                        <tr className="border-b-2 border-gray-300 bg-teal-50">
                          <td className="py-4 px-4 text-center font-bold text-gray-900">3</td>
                          <td className="py-4 px-6 font-bold text-gray-900">Total</td>
                          <td className="py-4 px-4">
                            <input
                              type="number"
                              value={hostelTotals.noRooms}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <input
                              type="number"
                              value={hostelTotals.capacity}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <input
                              type="number"
                              value={hostelTotals.occupied}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">Availability of Faculty Quarters</h2>
                <p className="text-teal-100">Provide details about faculty quarters (guest rooms not included).</p>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Availability of Faculty Quarters</label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="faculty_quarters"
                        value="yes"
                        checked={hasFacultyQuarters === 'yes'}
                        onChange={(e) => setHasFacultyQuarters(e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="faculty_quarters"
                        value="no"
                        checked={hasFacultyQuarters === 'no'}
                        onChange={(e) => setHasFacultyQuarters(e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {hasFacultyQuarters === 'yes' && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Sl.No</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Quarters Details</th>
                          <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">No. of Quarters</th>
                          <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Occupied</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-center font-medium text-gray-900">1</td>
                          <td className="py-4 px-6 font-medium text-gray-900">Faculty Quarters</td>
                          <td className="py-4 px-4">
                            <input
                              type="number"
                              value={facultyQuartersData.noQuarters}
                              onChange={(e) => handleFacultyQuartersChange('noQuarters', e.target.value)}
                              placeholder="Enter number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <input
                              type="number"
                              value={facultyQuartersData.occupied}
                              onChange={(e) => handleFacultyQuartersChange('occupied', e.target.value)}
                              placeholder="Enter number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">Availability of Guest Rooms / Common Rooms</h2>
                <p className="text-teal-100">Provide details about guest and common rooms for boys and girls.</p>
              </div>
              <div className="p-8">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Sl.No</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Particulars</th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">No. of Rooms</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-center font-medium text-gray-900">1</td>
                        <td className="py-4 px-6 font-medium text-gray-900">Guest rooms</td>
                        <td className="py-4 px-4">
                          <input
                            type="number"
                            value={guestRoomsData.guestRooms}
                            onChange={(e) => handleGuestRoomsChange('guestRooms', e.target.value)}
                            placeholder="Enter number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-center font-medium text-gray-900">2</td>
                        <td className="py-4 px-6 font-medium text-gray-900">Common rooms for boys</td>
                        <td className="py-4 px-4">
                          <input
                            type="number"
                            value={guestRoomsData.commonBoys}
                            onChange={(e) => handleGuestRoomsChange('commonBoys', e.target.value)}
                            placeholder="Enter number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-center font-medium text-gray-900">3</td>
                        <td className="py-4 px-6 font-medium text-gray-900">Common rooms for girls</td>
                        <td className="py-4 px-4">
                          <input
                            type="number"
                            value={guestRoomsData.commonGirls}
                            onChange={(e) => handleGuestRoomsChange('commonGirls', e.target.value)}
                            placeholder="Enter number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
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
                <h2 className="text-2xl font-bold text-white mb-2">Availability of Medical Facilities</h2>
                <p className="text-teal-100">Provide details about medical facilities available.</p>
              </div>
              <div className="p-8">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Sl.No</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Particulars</th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Yes / No</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-center font-medium text-gray-900">1</td>
                        <td className="py-4 px-6 font-medium text-gray-900">Registered Medical Practitioner</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="medical_1"
                                value="yes"
                                checked={medicalFacilitiesData.registeredPractitioner === 'yes'}
                                onChange={(e) => handleMedicalFacilitiesChange('registeredPractitioner', e.target.value)}
                                className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="medical_1"
                                value="no"
                                checked={medicalFacilitiesData.registeredPractitioner === 'no'}
                                onChange={(e) => handleMedicalFacilitiesChange('registeredPractitioner', e.target.value)}
                                className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">No</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-center font-medium text-gray-900">2</td>
                        <td className="py-4 px-6 font-medium text-gray-900">Nursing Assistant</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="medical_2"
                                value="yes"
                                checked={medicalFacilitiesData.nursingAssistant === 'yes'}
                                onChange={(e) => handleMedicalFacilitiesChange('nursingAssistant', e.target.value)}
                                className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="medical_2"
                                value="no"
                                checked={medicalFacilitiesData.nursingAssistant === 'no'}
                                onChange={(e) => handleMedicalFacilitiesChange('nursingAssistant', e.target.value)}
                                className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">No</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-center font-medium text-gray-900">3</td>
                        <td className="py-4 px-6 font-medium text-gray-900">Emergency Medicines</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="medical_3"
                                value="yes"
                                checked={medicalFacilitiesData.emergencyMedicines === 'yes'}
                                onChange={(e) => handleMedicalFacilitiesChange('emergencyMedicines', e.target.value)}
                                className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="medical_3"
                                value="no"
                                checked={medicalFacilitiesData.emergencyMedicines === 'no'}
                                onChange={(e) => handleMedicalFacilitiesChange('emergencyMedicines', e.target.value)}
                                className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">No</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">Sustainability Initiatives</h2>
                <p className="text-teal-100">Provide details about solar power and sustainable development initiatives.</p>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Initiatives taken for solar power</label>
                    <div className="flex items-center space-x-6 mb-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="solar"
                          value="yes"
                          checked={hasSolar === 'yes'}
                          onChange={(e) => setHasSolar(e.target.value)}
                          className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="solar"
                          value="no"
                          checked={hasSolar === 'no'}
                          onChange={(e) => setHasSolar(e.target.value)}
                          className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                    {hasSolar === 'yes' && (
                      <input
                        type="text"
                        value={sustainabilityData.solarDetails}
                        onChange={(e) => handleSustainabilityChange('solarDetails', e.target.value)}
                        placeholder="Enter solar power initiatives link"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                      />
                    )}
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Initiatives taken for Sustainable Development</label>
                    <div className="flex items-center space-x-6 mb-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sustainability"
                          value="yes"
                          checked={hasSustainability === 'yes'}
                          onChange={(e) => setHasSustainability(e.target.value)}
                          className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sustainability"
                          value="no"
                          checked={hasSustainability === 'no'}
                          onChange={(e) => setHasSustainability(e.target.value)}
                          className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                    {hasSustainability === 'yes' && (
                      <input
                        type="text"
                        value={sustainabilityData.sustainabilityDetails}
                        onChange={(e) => handleSustainabilityChange('sustainabilityDetails', e.target.value)}
                        placeholder="Enter sustainable development initiatives link"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">Availability of Sports Facilities</h2>
                <p className="text-teal-100">Provide details about sports facilities available.</p>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Availability of Sports Facilities</label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="sports_facilities"
                        value="yes"
                        checked={hasSportsFacilities === 'yes'}
                        onChange={(e) => setHasSportsFacilities(e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="sports_facilities"
                        value="no"
                        checked={hasSportsFacilities === 'no'}
                        onChange={(e) => setHasSportsFacilities(e.target.value)}
                        className="form-radio h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {hasSportsFacilities === 'yes' && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Sl.No</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Particulars</th>
                          <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-50">Area (in sq. Feet)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sportsData.map(row => (
                          <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4 text-center font-medium text-gray-900">{row.id}</td>
                            <td className="py-4 px-6">
                              <input
                                type="text"
                                value={row.particular}
                                onChange={(e) => handleSportsChange(row.id, 'particular', e.target.value)}
                                placeholder="Enter particulars"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                              />
                            </td>
                            <td className="py-4 px-4">
                              <input
                                type="number"
                                value={row.area}
                                onChange={(e) => handleSportsChange(row.id, 'area', e.target.value)}
                                placeholder="Enter area"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4 flex justify-center space-x-4">
                      <button
                        type="button"
                        onClick={addSportsRow}
                        className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                      >
                        + Add more rows if required
                      </button>
                      {sportsData.length > 3 && (
                        <button
                          type="button"
                          onClick={removeSportsRow}
                          className="text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                          - Remove last row
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">Supporting Documents</h2>
                <p className="text-teal-100">Provide a drive link for supporting documents.</p>
              </div>
              <div className="p-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Drive Link for Supporting Documents</label>
                  <input
                    type="text"
                    value={sectionDDriveLink}
                    onChange={(e) => setSectionDDriveLink(e.target.value)}
                    placeholder="Enter Google Drive link"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

          <div className="flex justify-between items-center pt-8">
            {onBack && (
              <button type="button" className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2" onClick={handleBack}>
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Section C
              </button>
            )}
            
<div className="flex space-x-4 ml-auto">
              <button
                type="button"
                className="flex items-center bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    Save and Continue to Section E
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>

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
    </div>
  );
};

export default SectionD;