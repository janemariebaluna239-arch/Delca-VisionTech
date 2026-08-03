import { VerificationRequest } from '../types';

export const INITIAL_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'VER-REQ-001',
    referenceNumber: 'VER-2026-8891',
    dateSubmitted: '2026-08-02T14:22:00Z',
    verificationType: 'User',
    personalInfo: {
      firstName: 'Jane Marie',
      middleName: 'Torres',
      lastName: 'Baluna',
      suffix: '',
      birthday: '1995-10-14',
      age: 30,
      gender: 'Female',
      nationality: 'Filipino',
      civilStatus: 'Single',
      address: 'Block 12 Lot 8, Fort Bonifacio Global City',
      province: 'Metro Manila',
      municipality: 'Taguig City',
      barangay: 'Fort Bonifacio',
      zipCode: '1634',
      emailAddress: 'janemariebaluna239@gmail.com',
      mobileNumber: '+639178239011'
    },
    documentInfo: {
      documentType: 'Passport',
      idNumber: 'P8921471A',
      frontImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
      issueDate: '2021-04-12',
      expirationDate: '2031-04-12',
      imageQualityScore: 98,
      qualityCheckResults: [
        { check: 'Resolution Quality', status: 'Passed', details: 'High clarity (300 DPI equivalent)' },
        { check: 'Framing & Crop', status: 'Passed', details: 'All 4 corners of passport visible' },
        { check: 'Glare & Reflection', status: 'Passed', details: 'Zero glare on hologram overlay' }
      ]
    },
    ocrData: {
      fullName: 'Jane Marie Torres Baluna',
      birthday: '1995-10-14',
      address: 'Fort Bonifacio, Taguig City, Metro Manila',
      gender: 'Female',
      nationality: 'Filipino',
      idNumber: 'P8921471A',
      expirationDate: '2031-04-12',
      issueDate: '2021-04-12',
      documentType: 'Passport',
      ocrMatchPercentage: 99.2,
      differences: [
        { field: 'Full Name', enteredValue: 'Jane Marie Torres Baluna', extractedValue: 'Jane Marie Torres Baluna', hasDifference: false },
        { field: 'Birthday', enteredValue: '1995-10-14', extractedValue: '1995-10-14', hasDifference: false },
        { field: 'Address', enteredValue: 'Block 12 Lot 8, Fort Bonifacio Global City', extractedValue: 'Fort Bonifacio, Taguig City', hasDifference: true, note: 'Standard municipal abbreviation' }
      ]
    },
    selfieData: {
      selfieImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      faceMatchScore: 99.4,
      faceMatchStatus: 'Verified',
      livenessStatus: 'Passed',
      livenessActionsCompleted: ['Blink', 'Smile', 'Turn Left', 'Look Up'],
      spoofingDetections: [
        { test: '3D Mesh Liveness Check', status: 'Passed', details: 'Natural depth map and skin reflectance detected' },
        { test: 'Deepfake Model Inspection', status: 'Passed', details: 'Zero temporal flicker artifact detected' }
      ]
    },
    authenticityData: {
      authenticityScore: 98,
      authenticityStatus: 'Likely Genuine',
      structuralChecks: [
        { checkName: 'Microtext & Font Alignment', passed: true, details: 'Standard optical character font layout matched' },
        { checkName: 'Hologram Interference Pattern', passed: true, details: 'Official DFA security watermark present' }
      ]
    },
    contactData: {
      emailValid: true,
      emailDomainExists: true,
      disposableEmail: false,
      emailSpamRiskScore: 2,
      emailVerified: true,
      phoneValid: true,
      phoneCarrier: 'Globe Telecom',
      phoneCountryCode: '+63',
      phoneOtpVerified: true,
      addressLogicalConsistency: true,
      addressSuggestions: '12 Fort Bonifacio Global City, Taguig, Metro Manila 1634'
    },
    duplicateFraudData: {
      duplicateDetected: false,
      duplicateSimilarityScore: 4,
      duplicateFields: [],
      fraudRiskScore: 3,
      riskLevel: 'Low',
      fraudFlags: []
    },
    overallConfidenceScore: 98,
    status: 'Verified',
    assignedReviewer: 'AI Auto-Approval Engine',
    adminNotes: 'Fully verified via high-confidence multi-biometric and OCR match.',
    reviewerComments: [
      {
        id: 'comm-1',
        reviewer: 'AI Verification System',
        role: 'Autonomous System',
        timestamp: '2026-08-02T14:22:05Z',
        comment: 'Auto-approved. High biometric match score (99.4%) and genuine passport structural score (98%).',
        action: 'Approved'
      }
    ],
    auditLog: [
      { timestamp: '2026-08-02T14:22:00Z', action: 'Request Submitted', actor: 'User (Jane Marie Baluna)', details: 'Submitted 13-step verification package' },
      { timestamp: '2026-08-02T14:22:02Z', action: 'AI OCR Extraction Completed', actor: 'DELCA OCR AI', details: 'Extracted 9 fields with 99.2% match' },
      { timestamp: '2026-08-02T14:22:04Z', action: 'Biometric Liveness & Face Match', actor: 'DELCA Liveness Engine', details: 'Liveness PASSED (4/4 challenges). Face match: 99.4%' },
      { timestamp: '2026-08-02T14:22:05Z', action: 'Final Approval', actor: 'AI Auto-Approval Engine', details: 'Assigned status: VERIFIED (Overall Score: 98%)' }
    ]
  },
  {
    id: 'VER-REQ-002',
    referenceNumber: 'VER-2026-7734',
    dateSubmitted: '2026-08-02T12:05:00Z',
    verificationType: 'Applicant',
    personalInfo: {
      firstName: 'Alexander',
      middleName: 'Cruz',
      lastName: 'Reyes',
      suffix: 'Jr.',
      birthday: '1988-06-22',
      age: 38,
      gender: 'Male',
      nationality: 'Filipino',
      civilStatus: 'Married',
      address: '45 Ayala Avenue, Bel-Air Village',
      province: 'Metro Manila',
      municipality: 'Makati City',
      barangay: 'Bel-Air',
      zipCode: '1209',
      emailAddress: 'alex.reyes.exec@ayala.com.ph',
      mobileNumber: '+639185559042'
    },
    documentInfo: {
      documentType: "Driver's License",
      idNumber: 'N02-14-892014',
      frontImageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
      issueDate: '2022-09-15',
      expirationDate: '2032-09-15',
      imageQualityScore: 89,
      qualityCheckResults: [
        { check: 'Resolution Quality', status: 'Passed', details: 'Clear contrast' },
        { check: 'Framing & Crop', status: 'Warning', details: 'Slight crop on lower right margin' }
      ]
    },
    ocrData: {
      fullName: 'Alexander C. Reyes Jr.',
      birthday: '1988-06-22',
      address: '45 Ayala Ave, Bel-Air, Makati City',
      gender: 'Male',
      nationality: 'Filipino',
      idNumber: 'N02-14-892014',
      expirationDate: '2032-09-15',
      issueDate: '2022-09-15',
      documentType: "Driver's License",
      ocrMatchPercentage: 94.5,
      differences: [
        { field: 'Middle Name', enteredValue: 'Cruz', extractedValue: 'C.', hasDifference: true, note: 'Abbreviated middle initial on LTO License' }
      ]
    },
    selfieData: {
      selfieImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      faceMatchScore: 88.5,
      faceMatchStatus: 'Manual Review Required',
      livenessStatus: 'Passed',
      livenessActionsCompleted: ['Blink', 'Smile', 'Turn Right'],
      spoofingDetections: [
        { test: '3D Mesh Liveness Check', status: 'Passed', details: 'Natural movement confirmed' }
      ]
    },
    authenticityData: {
      authenticityScore: 92,
      authenticityStatus: 'Likely Genuine',
      structuralChecks: [
        { checkName: 'LTO Barcode Checksum', passed: true, details: 'Valid checksum hash matched LTO registry pattern' }
      ]
    },
    contactData: {
      emailValid: true,
      emailDomainExists: true,
      disposableEmail: false,
      emailSpamRiskScore: 5,
      emailVerified: true,
      phoneValid: true,
      phoneCarrier: 'Smart Communications',
      phoneCountryCode: '+63',
      phoneOtpVerified: true,
      addressLogicalConsistency: true
    },
    duplicateFraudData: {
      duplicateDetected: false,
      duplicateSimilarityScore: 12,
      duplicateFields: [],
      fraudRiskScore: 18,
      riskLevel: 'Medium',
      fraudFlags: ['Face match score below 90% threshold (88.5%)']
    },
    overallConfidenceScore: 86,
    status: 'Needs Manual Review',
    assignedReviewer: 'Sarah Jenkins (Admin)',
    adminNotes: 'Requires admin check due to middle initial abbreviation and face match score 88.5%.',
    reviewerComments: [
      {
        id: 'comm-2',
        reviewer: 'AI Verification System',
        role: 'Autonomous System',
        timestamp: '2026-08-02T12:05:03Z',
        comment: 'Routed to Manual Review queue. Face match score 88.5% is under the 90% auto-approval threshold.',
        action: 'Note'
      }
    ],
    auditLog: [
      { timestamp: '2026-08-02T12:05:00Z', action: 'Request Submitted', actor: 'Applicant (Alexander Reyes Jr.)', details: 'Submitted verification with Driver License' },
      { timestamp: '2026-08-02T12:05:03Z', action: 'Flagged for Manual Review', actor: 'AI Rules Engine', details: 'Assigned to Sarah Jenkins (Admin)' }
    ]
  },
  {
    id: 'VER-REQ-003',
    referenceNumber: 'VER-2026-4412',
    dateSubmitted: '2026-08-01T16:45:00Z',
    verificationType: 'Customer',
    personalInfo: {
      firstName: 'Samantha',
      middleName: 'Villanueva',
      lastName: 'Santos',
      suffix: '',
      birthday: '1992-03-18',
      age: 34,
      gender: 'Female',
      nationality: 'Filipino',
      civilStatus: 'Single',
      address: '78 Ortigas Avenue, Barangay San Antonio',
      province: 'Metro Manila',
      municipality: 'Pasig City',
      barangay: 'San Antonio',
      zipCode: '1605',
      emailAddress: 'samantha.v.santos@gmail.com',
      mobileNumber: '+639174092211'
    },
    documentInfo: {
      documentType: 'National ID',
      idNumber: 'PhilSys-1029-4821-9011',
      frontImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
      issueDate: '2023-01-10',
      expirationDate: 'N/A',
      imageQualityScore: 96,
      qualityCheckResults: [
        { check: 'Resolution Quality', status: 'Passed', details: 'Sharp HD image' },
        { check: 'Framing & Crop', status: 'Passed', details: 'Full PhilSys layout captured' }
      ]
    },
    ocrData: {
      fullName: 'Samantha Villanueva Santos',
      birthday: '1992-03-18',
      address: 'San Antonio, Pasig City, Metro Manila 1605',
      gender: 'Female',
      nationality: 'Filipino',
      idNumber: 'PhilSys-1029-4821-9011',
      expirationDate: 'N/A',
      issueDate: '2023-01-10',
      documentType: 'National ID',
      ocrMatchPercentage: 99.8,
      differences: []
    },
    selfieData: {
      selfieImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      faceMatchScore: 99.7,
      faceMatchStatus: 'Verified',
      livenessStatus: 'Passed',
      livenessActionsCompleted: ['Blink', 'Smile', 'Turn Left', 'Turn Right', 'Look Down'],
      spoofingDetections: [
        { test: '3D Mesh Liveness Check', status: 'Passed', details: 'Live motion verified' }
      ]
    },
    authenticityData: {
      authenticityScore: 99,
      authenticityStatus: 'Likely Genuine',
      structuralChecks: [
        { checkName: 'PhilSys QR Verification', passed: true, details: 'Signed QR payload cryptographically verified' }
      ]
    },
    contactData: {
      emailValid: true,
      emailDomainExists: true,
      disposableEmail: false,
      emailSpamRiskScore: 1,
      emailVerified: true,
      phoneValid: true,
      phoneCarrier: 'Globe Telecom',
      phoneCountryCode: '+63',
      phoneOtpVerified: true,
      addressLogicalConsistency: true
    },
    duplicateFraudData: {
      duplicateDetected: false,
      duplicateSimilarityScore: 2,
      duplicateFields: [],
      fraudRiskScore: 1,
      riskLevel: 'Low',
      fraudFlags: []
    },
    overallConfidenceScore: 99,
    status: 'Verified',
    assignedReviewer: 'AI Auto-Approval Engine',
    adminNotes: 'PhilSys National ID QR payload verified with 99.7% biometric face match.',
    reviewerComments: [
      {
        id: 'comm-3',
        reviewer: 'AI Verification System',
        role: 'Autonomous System',
        timestamp: '2026-08-01T16:45:04Z',
        comment: 'Instant verification complete. National ID QR payload verified against official PhilSys public key.',
        action: 'Approved'
      }
    ],
    auditLog: [
      { timestamp: '2026-08-01T16:45:00Z', action: 'Request Submitted', actor: 'User (Samantha Santos)', details: 'Submitted PhilSys National ID' },
      { timestamp: '2026-08-01T16:45:04Z', action: 'Final Approval', actor: 'AI Auto-Approval Engine', details: 'Status: VERIFIED (Overall Score: 99%)' }
    ]
  },
  {
    id: 'VER-REQ-004',
    referenceNumber: 'VER-2026-9901',
    dateSubmitted: '2026-08-01T11:30:00Z',
    verificationType: 'User',
    personalInfo: {
      firstName: 'Marco',
      middleName: 'Dela Rosa',
      lastName: 'Gomez',
      suffix: '',
      birthday: '1997-11-05',
      age: 28,
      gender: 'Male',
      nationality: 'Filipino',
      civilStatus: 'Single',
      address: '102 Session Road, Green Valley',
      province: 'Benguet',
      municipality: 'Baguio City',
      barangay: 'Lualhati',
      zipCode: '2600',
      emailAddress: 'marco.gomez.temp@dispostable.com',
      mobileNumber: '+639209998811'
    },
    documentInfo: {
      documentType: 'UMID',
      idNumber: 'CRN-0033-908124-7',
      frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
      issueDate: '2020-05-14',
      expirationDate: 'N/A',
      imageQualityScore: 54,
      qualityCheckResults: [
        { check: 'Resolution Quality', status: 'Failed', details: 'Low resolution (under 150 DPI)' },
        { check: 'Font Inspection', status: 'Failed', details: 'Detected digital font artifact around photo border' }
      ]
    },
    ocrData: {
      fullName: 'Marco Dela Rosa Gomez',
      birthday: '1997-11-05',
      address: 'Session Road, Baguio City',
      gender: 'Male',
      nationality: 'Filipino',
      idNumber: 'CRN-0033-908124-7',
      expirationDate: 'N/A',
      issueDate: '2020-05-14',
      documentType: 'UMID',
      ocrMatchPercentage: 78.4,
      differences: [
        { field: 'ID Number', enteredValue: 'CRN-0033-908124-7', extractedValue: 'CRN-0033-908124-1', hasDifference: true, note: 'Check digit mismatch' }
      ]
    },
    selfieData: {
      selfieImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
      faceMatchScore: 61.2,
      faceMatchStatus: 'Mismatch',
      livenessStatus: 'Failed',
      livenessActionsCompleted: ['Blink'],
      spoofingDetections: [
        { test: 'Screen Replay Attack Test', status: 'Flagged', details: 'Moire grid pattern detected indicative of photo taken from LCD monitor' },
        { test: 'Deepfake Model Inspection', status: 'Flagged', details: 'Eye blinking boundary artifact detected' }
      ]
    },
    authenticityData: {
      authenticityScore: 32,
      authenticityStatus: 'High Risk Fake',
      structuralChecks: [
        { checkName: 'Digital Tampering Check', passed: false, details: 'Image pixel manipulation detected around ID photo rectangle' },
        { checkName: 'Micro-print Hologram', passed: false, details: 'SSS holographic foil completely missing' }
      ]
    },
    contactData: {
      emailValid: true,
      emailDomainExists: false,
      disposableEmail: true,
      emailSpamRiskScore: 95,
      emailVerified: false,
      phoneValid: true,
      phoneCarrier: 'DITO Telecommunity',
      phoneCountryCode: '+63',
      phoneOtpVerified: false,
      addressLogicalConsistency: false
    },
    duplicateFraudData: {
      duplicateDetected: true,
      duplicateSimilarityScore: 97,
      duplicateFields: ['Same Phone', 'Same Government ID'],
      matchedDuplicateRecordId: 'VER-REQ-002',
      matchedDuplicateName: 'Alexander Reyes Jr.',
      fraudRiskScore: 94,
      riskLevel: 'Critical',
      fraudFlags: [
        'Disposable email domain detected (dispostable.com)',
        'ID photo tampering detected via AI computer vision',
        'Failed biometric liveness check (Screen replay attack)',
        'Duplicate phone number matches existing account'
      ]
    },
    overallConfidenceScore: 38,
    status: 'Flagged Fraud',
    assignedReviewer: 'Fraud Prevention Operations Team',
    adminNotes: 'FLAGGED FRAUD. Photo of screen detected with tampered UMID document.',
    reviewerComments: [
      {
        id: 'comm-4',
        reviewer: 'AI Fraud Sentinel Engine',
        role: 'Autonomous System',
        timestamp: '2026-08-01T11:30:05Z',
        comment: 'CRITICAL FRAUD ALERT: High probability fake ID. Disposable email detected. Moire pattern confirmed screen replay attack.',
        action: 'Rejected'
      }
    ],
    auditLog: [
      { timestamp: '2026-08-01T11:30:00Z', action: 'Request Submitted', actor: 'User (Marco Gomez)', details: 'Submitted UMID document' },
      { timestamp: '2026-08-01T11:30:03Z', action: 'AI Tamper & Spoof Alert', actor: 'DELCA Image Forensics', details: 'Detected screen replay attack & digital editing' },
      { timestamp: '2026-08-01T11:30:05Z', action: 'Status Updated', actor: 'Fraud Sentinel', details: 'Assigned status: FLAGGED FRAUD (Risk Score: 94%)' }
    ]
  },
  {
    id: 'VER-REQ-005',
    referenceNumber: 'VER-2026-3381',
    dateSubmitted: '2026-07-31T09:14:00Z',
    verificationType: 'Business Partner',
    personalInfo: {
      firstName: 'Elena',
      middleName: 'Rostova',
      lastName: 'Vance',
      suffix: '',
      birthday: '1984-12-04',
      age: 41,
      gender: 'Female',
      nationality: 'Filipino',
      civilStatus: 'Married',
      address: '88 Escalante Drive, Forbes Park',
      province: 'Metro Manila',
      municipality: 'Makati City',
      barangay: 'Forbes Park',
      zipCode: '1219',
      emailAddress: 'elena.rostova@delca.vision',
      mobileNumber: '+639178881234'
    },
    documentInfo: {
      documentType: 'Passport',
      idNumber: 'P0091823B',
      frontImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
      issueDate: '2023-08-20',
      expirationDate: '2033-08-20',
      imageQualityScore: 99,
      qualityCheckResults: [
        { check: 'Resolution Quality', status: 'Passed', details: 'Pristine 4K capture' },
        { check: 'Framing & Crop', status: 'Passed', details: 'Full document visible' }
      ]
    },
    ocrData: {
      fullName: 'Elena Rostova Vance',
      birthday: '1984-12-04',
      address: 'Forbes Park, Makati City, Metro Manila',
      gender: 'Female',
      nationality: 'Filipino',
      idNumber: 'P0091823B',
      expirationDate: '2033-08-20',
      issueDate: '2023-08-20',
      documentType: 'Passport',
      ocrMatchPercentage: 100,
      differences: []
    },
    selfieData: {
      selfieImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
      faceMatchScore: 99.9,
      faceMatchStatus: 'Verified',
      livenessStatus: 'Passed',
      livenessActionsCompleted: ['Blink', 'Smile', 'Turn Right', 'Look Up'],
      spoofingDetections: [
        { test: '3D Mesh Liveness Check', status: 'Passed', details: 'Natural depth vectors verified' }
      ]
    },
    authenticityData: {
      authenticityScore: 100,
      authenticityStatus: 'Likely Genuine',
      structuralChecks: [
        { checkName: 'DFA ePassport Chip Digest', passed: true, details: 'ICAO Doc 9303 cryptographic signature verified' }
      ]
    },
    contactData: {
      emailValid: true,
      emailDomainExists: true,
      disposableEmail: false,
      emailSpamRiskScore: 0,
      emailVerified: true,
      phoneValid: true,
      phoneCarrier: 'Globe Telecom',
      phoneCountryCode: '+63',
      phoneOtpVerified: true,
      addressLogicalConsistency: true
    },
    duplicateFraudData: {
      duplicateDetected: false,
      duplicateSimilarityScore: 0,
      duplicateFields: [],
      fraudRiskScore: 0,
      riskLevel: 'Low',
      fraudFlags: []
    },
    overallConfidenceScore: 100,
    status: 'Verified',
    assignedReviewer: 'AI Auto-Approval Engine',
    adminNotes: 'Executive C-Suite partner verification. 100% ICAO passport chip & biometric match.',
    reviewerComments: [
      {
        id: 'comm-5',
        reviewer: 'AI Verification System',
        role: 'Autonomous System',
        timestamp: '2026-07-31T09:14:04Z',
        comment: 'Verified with 100% confidence. Corporate partner credential established.',
        action: 'Approved'
      }
    ],
    auditLog: [
      { timestamp: '2026-07-31T09:14:00Z', action: 'Request Submitted', actor: 'Elena Rostova', details: 'Partner onboarding verification' },
      { timestamp: '2026-07-31T09:14:04Z', action: 'Final Approval', actor: 'AI Auto-Approval Engine', details: 'Status: VERIFIED (Overall Score: 100%)' }
    ]
  }
];
