import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a PDF from submission data
 * @param {Object} submissionData - The complete submission data object
 */
export const generateSubmissionPDF = (submissionData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let yPosition = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Header
  pdf.setFillColor(20, 184, 166); // Teal color
  pdf.rect(0, 0, pageWidth, 40, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(submissionData.collegeName, margin, 20);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Submission ID: ${submissionData.id} | Submitted: ${submissionData.submittedAt} | Status: ${submissionData.status || 'N/A'}`, margin, 30);

  yPosition = 50;
  pdf.setTextColor(0, 0, 0);

  // Section Header Helper
  const addSectionHeader = (title) => {
    checkPageBreak(15);
    pdf.setFillColor(241, 245, 249);
    pdf.rect(margin, yPosition, contentWidth, 10, 'F');
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(51, 65, 85);
    pdf.text(title, margin + 5, yPosition + 7);
    yPosition += 15;
  };

  // Data Row Helper
  const addDataRow = (label, value, indent = 0) => {
    checkPageBreak(12);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(71, 85, 105);
    pdf.text(label + ':', margin + indent, yPosition);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(30, 41, 59);
    const labelWidth = pdf.getTextWidth(label + ':') + 5;
    const maxWidth = contentWidth - labelWidth - indent;
    const lines = pdf.splitTextToSize(String(value || 'N/A'), maxWidth);
    pdf.text(lines, margin + labelWidth + indent, yPosition);
    yPosition += Math.max(6, lines.length * 5);
  };

  // Table Helper using autoTable
  const addTable = (headers, data, title = '') => {
    checkPageBreak(20);
    if (title) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(51, 65, 85);
      pdf.text(title, margin, yPosition);
      yPosition += 7;
    }

    autoTable(pdf, {
      startY: yPosition,
      head: [headers],
      body: data,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [241, 245, 249], textColor: [51, 65, 85], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      theme: 'grid',
      didDrawPage: (data) => {
        yPosition = data.cursor.y + 5;
      }
    });
  };

  // Extract dynamic years from section data
  const getYearsFromSection = (section) => {
    const years = {};
    for (const key in section) {
      if (Array.isArray(section[key])) {
        section[key].forEach(item => {
          Object.keys(item).filter(k => k.match(/\d{4}-\d{2}/)).forEach(y => {
            years[y] = true;
          });
        });
      } else if (typeof section[key] === 'object' && section[key] !== null) {
        Object.keys(section[key]).filter(k => k.match(/\d{4}-\d{2}/)).forEach(y => {
          years[y] = true;
        });
      }
    }
    return Object.keys(years).sort();
  };

  const years = {
    sectionA: [],
    sectionB: getYearsFromSection(submissionData.sectionB),
    sectionC: getYearsFromSection(submissionData.sectionC),
    sectionD: getYearsFromSection(submissionData.sectionD),
    sectionE: getYearsFromSection(submissionData.sectionE),
  };

  // SECTION A: General Information
  addSectionHeader('Section A: General Information and Institute Details');
  addDataRow('Institution Name', submissionData.sectionA.name);
  addDataRow('Year of Establishment', submissionData.sectionA.yearEstablished);
  addDataRow('Address', submissionData.sectionA.address);
  addDataRow('Pincode', submissionData.sectionA.pinCode);
  addDataRow('State', submissionData.sectionA.state);
  addDataRow('Website', submissionData.sectionA.website);
  addDataRow('Head of Institution', submissionData.sectionA.headName);
  addDataRow('Institute Type', submissionData.sectionA.ownership);
  addDataRow('Institute Category', submissionData.sectionA.category);
  addDataRow('Affiliated University', submissionData.sectionA.affiliatedUniversity);
  addDataRow('AICTE Approval', `${submissionData.sectionA.aicteApproval}`);
  addDataRow('NBA Accreditation', submissionData.sectionA.nbaAccredited);
  addDataRow('NAAC Accreditation', `Score: ${submissionData.sectionA.naacScore} | Valid till: ${submissionData.sectionA.naacValidity}`);
  addDataRow('Other Accreditation', submissionData.sectionA.otherAccreditations);
  addDataRow('Applicant Name', submissionData.sectionA.applicantName);
  addDataRow('Applicant Designation', submissionData.sectionA.applicantDesignation);
  addDataRow('Contact Number', submissionData.sectionA.applicantContact);
  addDataRow('Email', submissionData.sectionA.applicantEmail);
  addDataRow('Field', submissionData.sectionA.field);

  // SECTION B: Gender Information, Diversity and Finance
  addSectionHeader('Section B: Gender Information, Diversity and Finance');
  addDataRow('Section B Drive Link', submissionData.sectionB.sectionBDriveLink);
  
  const genderData = submissionData.sectionB.genderInfo.map(row => [
    row.gender,
    ...years.sectionB.map(y => row[y] || '0')
  ]);
  addTable(['Gender', ...years.sectionB], genderData, 'Gender Information (Students Admitted)');

  const diversityData = submissionData.sectionB.diversityInfo.map(row => [
    row.category,
    ...years.sectionB.map(y => row[y] || '0')
  ]);
  addTable(['Category', ...years.sectionB], diversityData, 'Diversity Information');

  const examData = submissionData.sectionB.examScores.map(row => [
    row.slNo, row.department, row.examName, row.highestRank, row.lowestRank
  ]);
  addTable(['Sl.No', 'Department', 'Exam Name', 'Highest Rank', 'Lowest Rank'], examData, 'Exam Scores and Rank Details');

  checkPageBreak(20);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Financial Details (Last Academic Year)', margin, yPosition);
  yPosition += 7;
  addDataRow('Average Tuition Fees (per year)', `₹${Number(submissionData.sectionB.avgTuitionFees || 0).toLocaleString('en-IN')}`);
  addDataRow('Other Fees (per year)', `₹${Number(submissionData.sectionB.otherFees || 0).toLocaleString('en-IN')}`);
  addDataRow('Hostel Fees (per year)', `₹${Number(submissionData.sectionB.hostelFees || 0).toLocaleString('en-IN')}`);
  addDataRow('Total Teaching Staff Expenses', `₹${Number(submissionData.sectionB.teachingSalaryExpense || 0).toLocaleString('en-IN')}`);
  addDataRow('Total Lab Expenses', `₹${Number(submissionData.sectionB.labExpenses || 0).toLocaleString('en-IN')}`);
  addDataRow('Per Student Expenditure', `₹${Number(submissionData.sectionB.perStudentExpenditure || 0).toLocaleString('en-IN')}`);

  // SECTION C: Academics
  addSectionHeader('Section C: Academics');
  addDataRow('Section C Drive Link', submissionData.sectionC.sectionCDriveLink);

  // Specialization Details
  const specializationData = submissionData.sectionC.specialization.map(row => [
    row.slNo,
    row.department,
    ...years.sectionC.flatMap(y => [
      row[y]?.intake || '',
      row[y]?.filled || '',
      row[y]?.percentage ? row[y].percentage.toFixed(2) : ''
    ])
  ]);
  addTable(
    ['Sl.No', 'Department', ...years.sectionC.flatMap(y => [`${y} Intake`, `${y} Filled`, `${y} %`])],
    specializationData,
    'Specialization Details - Student Admission'
  );

  // Faculty Details
  const facultyData = submissionData.sectionC.facultyDetails.map(row => [
    row.slNo,
    row.department,
    row.intake,
    ...years.sectionC.flatMap(y => [row[y]?.prof || '', row[y]?.asp || '', row[y]?.ap || ''])
  ]);
  addTable(
    ['Sl.No', 'Department', 'Intake', ...years.sectionC.flatMap(y => [`${y} Prof`, `${y} ASP`, `${y} AP`])],
    facultyData,
    'Faculty Details'
  );

  // PhD Holders
  const phdData = submissionData.sectionC.phdHolders.map(row => [
    row.year,
    row.totalFaculty,
    row.phdHolders,
    row.percentage ? row.percentage.toFixed(2) : ''
  ]);
  addTable(['Year', 'Total Faculty', 'PhD Holders', 'Percentage'], phdData, 'PhD Holders (Permanent Faculty)');

  // Faculty Information
  checkPageBreak(20);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Faculty Information', margin, yPosition);
  yPosition += 7;
  addDataRow('Average Teaching Experience', submissionData.sectionC.avgTeachingExperience);
  addDataRow('Credits Earned by Students', submissionData.sectionC.creditsEarned);
  addDataRow('Contact Hours', submissionData.sectionC.contactHours);
  addDataRow('Faculty Below Feedback Threshold', submissionData.sectionC.belowThresholdFaculty);

  // Placement, Higher Education, and Entrepreneurship
  const placementData = submissionData.sectionC.placementData.map(row => [
    row.slNo,
    row.department,
    ...years.sectionC.flatMap(y => [
      row[y]?.a || '',
      row[y]?.b || '',
      row[y]?.c || '',
      (Number(row[y]?.a || 0) + Number(row[y]?.b || 0) + Number(row[y]?.c || 0)).toString()
    ])
  ]);
  addTable(
    ['Sl.No', 'Department', ...years.sectionC.flatMap(y => [`${y} A`, `${y} B`, `${y} C`, `${y} Total`])],
    placementData,
    'Placement (A), Higher Education (B), and Entrepreneurship (C)'
  );

  // Placement Summary
  const placementSummaryData = submissionData.sectionC.placementSummary.map(row => [
    row.slNo,
    row.department,
    ...years.sectionC.flatMap(y => [row[y]?.n || '', row[y]?.x || '', row[y]?.percentage || ''])
  ]);
  addTable(
    ['Sl.No', 'Department', ...years.sectionC.flatMap(y => [`${y} N`, `${y} X`, `${y} %`])],
    placementSummaryData,
    'Placement Summary'
  );

  // Student Contact Details
  const studentContactData = submissionData.sectionC.studentContactDetails.map(row => [
    row.slNo,
    row.nameAndDepartment,
    row.email
  ]);
  addTable(['Sl.No', 'Name and Department', 'E-Mail Id'], studentContactData, 'Student Contact Details (Last Passed Out Batch)');

  // Placement Salary Details
  const salaryData = submissionData.sectionC.salaryDetails.map(row => [
    row.particular,
    ...years.sectionC.map(y => `₹${Number(row[y] || 0).toLocaleString('en-IN')}`)
  ]);
  addTable(['Particular', ...years.sectionC], salaryData, 'Placement Salary Details');

  // Active MoUs
  const mouData = years.sectionC.map(y => [
    y, submissionData.sectionC.activeMoUs[y] || 0
  ]);
  mouData.push(['Total', Object.values(submissionData.sectionC.activeMoUs).reduce((sum, val) => sum + Number(val || 0), 0)]);
  addTable(['Year', 'No. of Active MoUs'], mouData, 'Active MoUs');

  // Other Academic Details
  checkPageBreak(20);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Other Academic Details', margin, yPosition);
  yPosition += 7;
  addDataRow('NEP 2020 Implementation', submissionData.sectionC.nepImplementation);
  addDataRow('Multiple Entry & Exit Scheme', submissionData.sectionC.multipleEntryExit);
  addDataRow('Inter College Competitions', submissionData.sectionC.interCollegeCompetitions);
  addDataRow('Intra College Compet’isitions', submissionData.sectionC.intraCollegeCompetitions);
  addDataRow('Clubs and Societies', submissionData.sectionC.clubsSocieties);
  addDataRow('Mentor-Mentee Ratio', submissionData.sectionC.mentorMenteeRatio);
  addDataRow('Student Counsellor Available', submissionData.sectionC.studentCounsellor);
  addDataRow('Programs Conducted (Yoga, etc.)', submissionData.sectionC.programsConducted);

  // MoUs with Foreign Universities
  checkPageBreak(20);
  addDataRow('MoUs with Foreign Universities', submissionData.sectionC.hasForeignMoUs ? 'Yes' : 'No');
  if (submissionData.sectionC.hasForeignMoUs && submissionData.sectionC.foreignMoUs?.length > 0) {
    const foreignMouData = submissionData.sectionC.foreignMoUs.map(row => [
      row.slNo,
      row.university,
      row.country,
      row.validUpto,
      row.link
    ]);
    addTable(['Sl.No', 'University', 'Country', 'Valid Upto', 'Link'], foreignMouData, 'MoUs with Foreign Universities');
  }

  // Foreign Language Training
  checkPageBreak(20);
  addDataRow('Foreign Language Training', submissionData.sectionC.foreignLanguageTraining);
  if (submissionData.sectionC.foreignLanguageTraining === 'Yes') {
    addDataRow('Certificate Details', submissionData.sectionC.foreignLanguageCertLink);
  }

  // SECTION D: Infrastructure
  addSectionHeader('Section D: Infrastructure');
  addDataRow('Section D Drive Link', submissionData.sectionD.sectionDDriveLink);

  // Campus Infrastructure
  checkPageBreak(20);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Campus Infrastructure', margin, yPosition);
  yPosition += 7;
  addDataRow('Campus Area (sq.ft)', submissionData.sectionD.campusArea);
  addDataRow('Total Built-up Area (sq.ft)', submissionData.sectionD.builtUpArea);
  addDataRow('Number of Classrooms', submissionData.sectionD.classrooms);
  addDataRow('Number of Laboratories', submissionData.sectionD.laboratories);
  addDataRow('Faculty Cabins', submissionData.sectionD.facultyCabins);
  addDataRow('Conference/Discussion Halls', submissionData.sectionD.conferenceHalls);
  addDataRow('Auditoriums', submissionData.sectionD.auditoriums);
  addDataRow('Student Computer Ratio', submissionData.sectionD.studentComputerRatio);

  // Facilities
  checkPageBreak(20);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Facilities', margin, yPosition);
  yPosition += 7;
  addDataRow('STP Plant', submissionData.sectionD.stpPlant);
  if (submissionData.sectionD.stpPlant === 'Yes') {
    addDataRow('STP Output', submissionData.sectionD.stpOutcome);
  }
  addDataRow('Waste Disposal MoU', submissionData.sectionD.wasteDisposalMoU);
  addDataRow('NSS Available', submissionData.sectionD.nss);
  addDataRow('NCC Available', submissionData.sectionD.ncc);
  addDataRow('Cells/Committees Available', submissionData.sectionD.cellsCommittees);
  addDataRow('ATM on Campus', submissionData.sectionD.atm);
  addDataRow('Wi-Fi Connectivity', submissionData.sectionD.wifi);
  if (submissionData.sectionD.wifi === 'Yes') {
    addDataRow('Wi-Fi Details', submissionData.sectionD.wifiDetails);
  }
  addDataRow('IQAC Established', submissionData.sectionD.iqac);
  if (submissionData.sectionD.iqac === 'Yes') {
    addDataRow('IQAC Establishment Date', submissionData.sectionD.iqacEstablished);
  }

  // Library Resources
  checkPageBreak(20);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Library Resources', margin, yPosition);
  yPosition += 7;
  addDataRow('Central Library Area (sq.ft)', submissionData.sectionD.centralLibrary);
  addDataRow('Total Book Volumes', submissionData.sectionD.booksVolumes);
  addDataRow('Books Added (Last 3 Years)', submissionData.sectionD.booksAddedLastThreeYears);
  addDataRow('Printed Journals', submissionData.sectionD.printedJournals);
  addDataRow('Online Journals', submissionData.sectionD.onlineJournals);
  addDataRow('Average Faculty Library Visits/Month', submissionData.sectionD.avgFacultyVisitsPerMonth);
  addDataRow('Average Student Library Visits/Month', submissionData.sectionD.avgStudentVisitsPerMonth);
  addDataRow('Digital Library', submissionData.sectionD.digitalLibrary);

  // Department Libraries
  checkPageBreak(20);
  addDataRow('Department Libraries Available', submissionData.sectionD.hasDeptLibrary);
  if (submissionData.sectionD.hasDeptLibrary === 'Yes' && submissionData.sectionD.departmentLibrary?.length > 0) {
    const departmentLibraryData = submissionData.sectionD.departmentLibrary.map(row => [
      row.department,
      row.volumes
    ]);
    addTable(['Department', 'Volumes'], departmentLibraryData, 'Department Libraries');
  }

  // Hostel Details
  checkPageBreak(20);
  addDataRow('Hostel Available', submissionData.sectionD.hasHostel);
  if (submissionData.sectionD.hasHostel === 'Yes' && submissionData.sectionD.hostelDetails?.length > 0) {
    const hostelData = submissionData.sectionD.hostelDetails.map(row => [
      row.type,
      row.rooms,
      row.capacity,
      row.occupied
    ]);
    addTable(['Type', 'Rooms', 'Capacity', 'Occupied'], hostelData, 'Hostel Details');
  }

  // Faculty Quarters
  checkPageBreak(20);
  addDataRow('Faculty Quarters Available', submissionData.sectionD.hasFacultyQuarters);
  if (submissionData.sectionD.hasFacultyQuarters === 'Yes') {
    addDataRow('Total Quarters', submissionData.sectionD.facultyQuarters.quarters);
    addDataRow('Occupied Quarters', submissionData.sectionD.facultyQuarters.occupied);
  }

  // Common Facilities
  checkPageBreak(20);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Common Facilities', margin, yPosition);
  yPosition += 7;
  addDataRow('Guest Rooms', submissionData.sectionD.guestRooms.guestRooms);
  addDataRow('Boys Common Rooms', submissionData.sectionD.guestRooms.commonBoys);
  addDataRow('Girls Common Rooms', submissionData.sectionD.guestRooms.commonGirls);

  // Medical Facilities
  checkPageBreak(20);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Medical Facilities', margin, yPosition);
  yPosition += 7;
  addDataRow('Registered Medical Practitioner', submissionData.sectionD.medicalFacilities.registeredPractitioner);
  addDataRow('Nursing Assistant', submissionData.sectionD.medicalFacilities.nursingAssistant);
  addDataRow('Emergency Medicines', submissionData.sectionD.medicalFacilities.emergencyMedicines);

  // Sustainability Initiatives
  checkPageBreak(20);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Sustainability Initiatives', margin, yPosition);
  yPosition += 7;
  addDataRow('Solar Power Initiatives', submissionData.sectionD.solarPower);
  if (submissionData.sectionD.solarPower === 'Yes') {
    addDataRow('Solar Details', submissionData.sectionD.solarDetails);
  }
  addDataRow('Sustainable Development', submissionData.sectionD.sustainableDevelopment);
  if (submissionData.sectionD.sustainableDevelopment === 'Yes') {
    addDataRow('Sustainability Details', submissionData.sectionD.sustainabilityDetails);
  }

  // Sports Facilities
  checkPageBreak(20);
  addDataRow('Sports Facilities Available', submissionData.sectionD.hasSportsFacilities);
  if (submissionData.sectionD.hasSportsFacilities === 'Yes' && submissionData.sectionD.sportsFacilities?.length > 0) {
    const sportsData = submissionData.sectionD.sportsFacilities.map(row => [
      row.particular,
      row.area
    ]);
    addTable(['Facility', 'Area'], sportsData, 'Sports Facilities');
  }

  // SECTION E: Research
  addSectionHeader('Section E: Research');
  addDataRow('Section E Drive Link', submissionData.sectionE.sectionEDriveLink);

  const journalData = submissionData.sectionE.journalPublications.map(row => [
    row.type,
    ...years.sectionE.map(y => row[y] || '')
  ]);
  addTable(['Publication Type', ...years.sectionE], journalData, 'Journal Publications');

  const conferenceData = submissionData.sectionE.conferencePublications.map(row => [
    row.id,
    row.particular,
    ...years.sectionE.map(y => row[y] || '')
  ]);
  addTable(['Sl.No', 'Particular', ...years.sectionE], conferenceData, 'Conference/Book Chapters Publications');

  const patentData = submissionData.sectionE.patents.map(row => [
    row.particular,
    ...years.sectionE.map(y => row.particular === 'Percentage' ? `${row[y] || 0}%` : row[y] || '')
  ]);
  addTable(['Particular', ...years.sectionE], patentData, 'Patents Details');

  const researchProjectData = [
    ...submissionData.sectionE.researchProjects.map(row => [
      row.id,
      row.particular,
      ...years.sectionE.map(y => `₹${Number(row[y] || 0).toLocaleString('en-IN')}`)
    ]),
    [
      'Total',
      '',
      ...years.sectionE.map(y => `₹${submissionData.sectionE.researchProjects.reduce((sum, row) => sum + Number(row[y] || 0), 0).toLocaleString('en-IN')}`)
    ]
  ];
  addTable(['Sl.No', 'Particular', ...years.sectionE.map(y => `${y} (₹)`)], researchProjectData, 'Research Projects (Government)');

  const researchGrantsData = [
    ...submissionData.sectionE.researchGrants.map(row => [
      row.id,
      row.particular,
      ...years.sectionE.map(y => `₹${Number(row[y] || 0).toLocaleString('en-IN')}`)
    ]),
    [
      'Total',
      '',
      ...years.sectionE.map(y => `₹${submissionData.sectionE.researchGrants.reduce((sum, row) => sum + Number(row[y] || 0), 0).toLocaleString('en-IN')}`)
    ]
  ];
  addTable(['Sl.No', 'Particular', ...years.sectionE.map(y => `${y} (₹)`)], researchGrantsData, 'Research Grants (Government)');

  const consultancyWorksData = [
    ...submissionData.sectionE.consultancyWorks.map(row => [
      row.id,
      row.particular,
      ...years.sectionE.map(y => `₹${Number(row[y] || 0).toLocaleString('en-IN')}`)
    ]),
    [
      'Total',
      '',
      ...years.sectionE.map(y => `₹${submissionData.sectionE.consultancyWorks.reduce((sum, row) => sum + Number(row[y] || 0), 0).toLocaleString('en-IN')}`)
    ]
  ];
  addTable(['Sl.No', 'Particular', ...years.sectionE.map(y => `${y} (₹)`)], consultancyWorksData, 'Consultancy Works');

  const seedMoneyData = [
    ...submissionData.sectionE.seedMoney.map(row => [
      row.id,
      row.particular,
      ...years.sectionE.map(y => `₹${Number(row[y] || 0).toLocaleString('en-IN')}`)
    ])
  ];
  addTable(['Sl.No', 'Particular', ...years.sectionE.map(y => `${y} (₹)`)], seedMoneyData, 'Seed Money');

  const incubationCentresData = submissionData.sectionE.incubationCentres.map(row => [
    row.particular,
    ...years.sectionE.map(y => row[y] || '')
  ]);
  addTable(['Particular', ...years.sectionE], incubationCentresData, 'Incubation Centres');

  // Save the PDF
  pdf.save(`${submissionData.collegeName}_Submission_${submissionData.id}.pdf`);
};

export default generateSubmissionPDF;