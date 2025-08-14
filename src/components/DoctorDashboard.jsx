import React, { useState } from 'react';
import { 
  Heart,
  Stethoscope, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  BadgeCheck, 
  User, 
  Search,
  Filter,
  X,
  ChevronDown,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Eye,
  UserCheck,
  ArrowRight,
  Shield,
  LogOut,
  FileText
} from 'lucide-react';

const mockDoctors = [
  {
    id: 'doc1',
    name: 'Dr. Michael Johnson',
    specialty: 'Cardiology'
  },
  {
    id: 'doc2',
    name: 'Dr. Emily Chen',
    specialty: 'Dermatology'
  },
  {
    id: 'doc3',
    name: 'Dr. Robert Davis',
    specialty: 'Neurology'
  },
  {
    id: 'doc4',
    name: 'Dr. Lisa Anderson',
    specialty: 'Orthopedics'
  }
];

const mockSubmissions = [
  {
    id: '1',
    patient: {
      id: 'p1',
      name: 'Sarah Johnson',
      age: 34,
      gender: 'Female',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@email.com',
      address: '123 Main St, City, State 12345'
    },
    symptoms: 'Persistent headache for 3 days, accompanied by nausea and sensitivity to light. Pain is throbbing and located primarily in the frontal region.',
    testType: 'Complete Blood Count (CBC)',
    testResults: null,
    images: [
      'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    submittedAt: '2024-01-15T10:30:00Z',
    status: 'pending',
    diagnoses: [],
    consent: {
      treatment: true,
      referral: false,
      research: true
    }
  },
  {
    id: '2',
    patient: {
      id: 'p2',
      name: 'Michael Chen',
      age: 28,
      gender: 'Male',
      phone: '+1 (555) 987-6543',
      email: 'michael.chen@email.com',
      address: '456 Oak Ave, City, State 12345'
    },
    symptoms: 'Skin rash on arms and legs, itchy and red. Started 2 days ago after hiking. No fever or other symptoms.',
    testType: 'Skin Allergy Panel',
    testResults: {
      uploadedAt: '2024-01-15T16:00:00Z',
      files: [
        { name: 'allergy_test_results.pdf', type: 'PDF Report' },
        { name: 'skin_patch_results.jpg', type: 'Image' }
      ],
      summary: 'Positive reaction to poison ivy allergen. Negative for other common environmental allergens.'
    },
    images: [
      'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    submittedAt: '2024-01-15T14:15:00Z',
    status: 'under_review',
    diagnoses: [
      {
        id: 'diag1',
        doctorId: 'current',
        doctorName: 'Dr. Sarah Mitchell',
        analysis: 'Initial assessment suggests contact dermatitis. Recommend topical corticosteroid and antihistamine.',
        createdAt: '2024-01-15T15:30:00Z'
      }
    ],
    consent: {
      treatment: true,
      referral: true,
      research: false
    }
  },
  {
    id: '3',
    patient: {
      id: 'p3',
      name: 'Emma Davis',
      age: 45,
      gender: 'Female',
      phone: '+1 (555) 456-7890',
      email: 'emma.davis@email.com',
      address: '789 Pine St, City, State 12345'
    },
    symptoms: 'Chest pain and shortness of breath during exercise. Occurs mainly when climbing stairs or walking uphill.',
    testType: 'Cardiac Stress Test',
    testResults: {
      uploadedAt: '2024-01-14T18:30:00Z',
      files: [
        { name: 'stress_test_report.pdf', type: 'PDF Report' },
        { name: 'ecg_results.pdf', type: 'ECG Report' }
      ],
      summary: 'Abnormal stress test showing ST depression during exercise. Recommend cardiology consultation.'
    },
    images: [],
    submittedAt: '2024-01-14T16:45:00Z',
    status: 'referred',
    diagnoses: [
      {
        id: 'diag2',
        doctorId: 'current',
        doctorName: 'Dr. Sarah Mitchell',
        analysis: 'Patient presents with exercise-induced chest pain and dyspnea. Recommend cardiology consultation for further evaluation.',
        createdAt: '2024-01-14T17:00:00Z'
      }
    ],
    consent: {
      treatment: true,
      referral: true,
      research: true
    }
  },
  {
    id: '4',
    patient: {
      id: 'p4',
      name: 'James Wilson',
      age: 52,
      gender: 'Male',
      phone: '+1 (555) 321-0987',
      email: 'james.wilson@email.com',
      address: '321 Elm St, City, State 12345'
    },
    symptoms: 'Lower back pain for 1 week, worse in the morning. No numbness or tingling in legs.',
    testType: 'Lumbar Spine X-Ray',
    testResults: {
      uploadedAt: '2024-01-13T11:15:00Z',
      files: [
        { name: 'lumbar_xray_report.pdf', type: 'X-Ray Report' },
        { name: 'spine_images.jpg', type: 'X-Ray Images' }
      ],
      summary: 'Mild degenerative changes in L4-L5. No acute fractures or significant abnormalities.'
    },
    images: [
      'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    submittedAt: '2024-01-13T09:20:00Z',
    status: 'completed',
    diagnoses: [
      {
        id: 'diag3',
        doctorId: 'current',
        doctorName: 'Dr. Sarah Mitchell',
        analysis: 'Mechanical lower back pain. Prescribed NSAIDs and physical therapy. Patient responded well to treatment.',
        createdAt: '2024-01-13T10:30:00Z'
      }
    ],
    consent: {
      treatment: true,
      referral: false,
      research: false
    }
  }
];

const mockLabs = [
  {
    id: 'lab1',
    name: 'Central Medical Laboratory',
    location: 'Downtown Medical Center',
    specialties: ['Blood Work', 'Radiology', 'Pathology']
  },
  {
    id: 'lab2',
    name: 'Advanced Diagnostics Lab',
    location: 'North Campus',
    specialties: ['MRI', 'CT Scan', 'Ultrasound']
  },
  {
    id: 'lab3',
    name: 'QuickTest Laboratory',
    location: 'South Wing',
    specialties: ['Rapid Tests', 'Microbiology', 'Chemistry']
  }
];

const testTypes = [
  'Complete Blood Count (CBC)',
  'Basic Metabolic Panel',
  'Comprehensive Metabolic Panel',
  'Lipid Panel',
  'Thyroid Function Panel',
  'Liver Function Tests',
  'Kidney Function Tests',
  'HbA1c & Glucose',
  'Cardiac Stress Test',
  'Electrocardiogram (ECG)',
  'Chest X-Ray',
  'Lumbar Spine X-Ray',
  'MRI Scan',
  'CT Scan',
  'Ultrasound',
  'Skin Allergy Panel',
  'Food Allergy Panel',
  'Urinalysis',
  'Stool Analysis',
  'Blood Culture'
];

const DoctorDashboard = () => {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [showLabDropdown, setShowLabDropdown] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [showTestTypeDropdown, setShowTestTypeDropdown] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTestType, setSelectedTestType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="status-icon status-icon-orange" />;
      case 'under_review':
        return <AlertCircle className="status-icon status-icon-blue" />;
      case 'diagnosed':
        return <CheckCircle className="status-icon status-icon-green" />;
      case 'completed':
        return <BadgeCheck className="status-icon status-icon-purple" />;
      case 'referred':
        return <ArrowRight className="status-icon status-icon-indigo" />;
      default:
        return <Clock className="status-icon status-icon-gray" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge status-badge-orange';
      case 'under_review':
        return 'status-badge status-badge-blue';
      case 'diagnosed':
        return 'status-badge status-badge-green';
      case 'completed':
        return 'status-badge status-badge-purple';
      case 'referred':
        return 'status-badge status-badge-indigo';
      default:
        return 'status-badge status-badge-gray';
    }
  };

  const handleViewClick = (submission) => {
    setSelectedSubmission(submission);
    setModalType('view');
  };

  const handleAssignClick = (submission) => {
    setSelectedSubmission(submission);
    setModalType('assign');
    setAnalysis('');
    setSelectedLab(null);
    setSelectedTestType(submission.testType);
    setShowLabDropdown(false);
    setShowTestTypeDropdown(false);
  };

  const handleReferClick = (submission) => {
    setSelectedSubmission(submission);
    setModalType('refer');
    setSelectedDoctor(null);
    setShowDoctorDropdown(false);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedSubmission(null);
    setAnalysis('');
    setSelectedLab(null);
    setSelectedDoctor(null);
    setSelectedTestType('');
    setShowLabDropdown(false);
    setShowDoctorDropdown(false);
    setShowTestTypeDropdown(false);
  };

  const handleAssignToLab = () => {
    if (selectedLab && selectedSubmission) {
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === selectedSubmission.id 
            ? { ...sub, status: 'under_review' }
            : sub
        )
      );
      
      alert(`Successfully assigned to ${selectedLab.name}`);
      handleCloseModal();
    }
  };

  const handleReferToDoctor = () => {
    if (selectedDoctor && selectedSubmission) {
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === selectedSubmission.id 
            ? { ...sub, status: 'referred' }
            : sub
        )
      );
      
      alert(`Successfully referred to ${selectedDoctor.name}`);
      handleCloseModal();
    }
  };

  const handleLogoutClick = () => {
    setShowUserDropdown(false);
    setShowLogoutModal(true);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    alert('Successfully logged out. Redirecting to login page...');
    // In a real application, you would:
    // 1. Clear authentication tokens
    // 2. Clear user session data
    // 3. Redirect to login page
    // window.location.href = '/login';
  };

  const handleAddDiagnosis = () => {
    if (analysis.trim() && selectedSubmission) {
      const newDiagnosis = {
        id: `diag_${Date.now()}`,
        doctorId: 'current',
        doctorName: 'Dr. Sarah Mitchell',
        analysis: analysis.trim(),
        createdAt: new Date().toISOString()
      };

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === selectedSubmission.id 
            ? { 
                ...sub, 
                diagnoses: [...sub.diagnoses, newDiagnosis],
                status: 'diagnosed'
              }
            : sub
        )
      );
      
      setAnalysis('');
      setSelectedSubmission(prev => prev ? {
        ...prev,
        diagnoses: [...prev.diagnoses, newDiagnosis],
        status: 'diagnosed'
      } : null);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-inner">
            <div className="header-left">
              <div className="logo-section">
                <div className="logo-icon">
                  <Heart className="logo-heart" />
                </div>
                <div>
                  <h1 className="logo-title">HealthConnect</h1>
                  <p className="logo-subtitle">Doctor Dashboard</p>
                </div>
              </div>
            </div>
            
            {/* User Info */}
            <div className="user-info" onClick={() => setShowUserDropdown(!showUserDropdown)}>
              <div className="user-card user-card-clickable">
                <div className="user-icon">
                  <Stethoscope className="stethoscope-icon" />
                </div>
                <div className="user-details">
                  <p className="user-name">Dr. Sarah Mitchell</p>
                  <p className="user-specialty">Internal Medicine</p>
                </div>
                <ChevronDown className={`user-dropdown-icon ${showUserDropdown ? 'user-dropdown-icon-rotated' : ''}`} />
              </div>
              
              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="user-dropdown-menu">
                  <button
                    onClick={handleLogoutClick}
                    className="user-dropdown-item logout-item"
                  >
                    <LogOut className="dropdown-item-icon" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Page Title and Filters */}
        <div className="page-header">
          <h2 className="page-title">Patient Symptom Submissions</h2>
          
          <div className="filters-container">
            {/* Search */}
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search patients or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            {/* Status Filter */}
            <div className="filter-container">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="diagnosed">Diagnosed</option>
                <option value="referred">Referred</option>
                <option value="completed">Completed</option>
              </select>
              <Filter className="filter-icon" />
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="submissions-list">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="submission-card">
              <div className="submission-content">
                <div className="submission-main">
                  <div className="patient-header">
                    <div className="patient-info">
                      <div className="patient-avatar">
                        <User className="patient-icon" />
                      </div>
                      <div>
                        <h3 className="patient-name">{submission.patient.name}</h3>
                        <p className="patient-details">{submission.patient.age} years • {submission.patient.gender}</p>
                      </div>
                    </div>
                    
                    <div className="status-container">
                      <span className={getStatusColor(submission.status)}>
                        {getStatusIcon(submission.status)}
                        <span className="status-text">{submission.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="symptoms-section">
                    <h4 className="symptoms-title">Symptoms:</h4>
                    <p className="symptoms-text">{submission.symptoms}</p>
                  </div>
                  
                  {submission.images.length > 0 && (
                    <div className="images-section">
                      <h4 className="images-title">Uploaded Images:</h4>
                      <div className="images-grid">
                        {submission.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Symptom ${index + 1}`}
                            className="symptom-image"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="submission-date">
                    <Calendar className="calendar-icon" />
                    <span>Submitted: {formatDate(submission.submittedAt)}</span>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <button
                    onClick={() => handleViewClick(submission)}
                    className="btn btn-view"
                  >
                    <Eye className="btn-icon" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleAssignClick(submission)}
                    className="btn btn-assign"
                  >
                    Assign
                  </button>
                  <button
                    onClick={() => handleReferClick(submission)}
                    className="btn btn-refer"
                  >
                    <UserCheck className="btn-icon" />
                    <span>Refer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Search className="empty-search-icon" />
            </div>
            <h3 className="empty-title">No submissions found</h3>
            <p className="empty-text">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </main>

      {/* View Modal */}
      {modalType === 'view' && selectedSubmission && (
        <div className="modal-overlay">
          <div className="modal-container modal-large">
            {/* Modal Header */}
            <div className="modal-header modal-header-orange">
              <h3 className="modal-title">Patient Details - {selectedSubmission.patient.name}</h3>
              <button
                onClick={handleCloseModal}
                className="modal-close"
              >
                <X className="close-icon" />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-content">
                {/* Patient Details */}
                <div className="patient-details-card">
                  <h4 className="section-title">Patient Information</h4>
                  <div className="patient-info-list">
                    <div className="info-item">
                      <User className="info-icon" />
                      <span className="info-text">Age: {selectedSubmission.patient.age} • {selectedSubmission.patient.gender}</span>
                    </div>
                    <div className="info-item">
                      <Phone className="info-icon" />
                      <span className="info-text">{selectedSubmission.patient.phone}</span>
                    </div>
                    <div className="info-item">
                      <Mail className="info-icon" />
                      <span className="info-text">{selectedSubmission.patient.email}</span>
                    </div>
                    <div className="info-item">
                      <MapPin className="info-icon" />
                      <span className="info-text">{selectedSubmission.patient.address}</span>
                    </div>
                  </div>
                </div>

                {/* Consent Information */}
                <div>
                  <h4 className="section-title">Patient Consent</h4>
                  <div className="consent-container">
                    <div className="consent-item">
                      <Shield className="consent-icon" />
                      <span className="consent-label">Treatment:</span>
                      <span className={`consent-status ${selectedSubmission.consent.treatment ? 'consent-granted' : 'consent-denied'}`}>
                        {selectedSubmission.consent.treatment ? 'Granted' : 'Not Granted'}
                      </span>
                    </div>
                    <div className="consent-item">
                      <Shield className="consent-icon" />
                      <span className="consent-label">Referral:</span>
                      <span className={`consent-status ${selectedSubmission.consent.referral ? 'consent-granted' : 'consent-denied'}`}>
                        {selectedSubmission.consent.referral ? 'Granted' : 'Not Granted'}
                      </span>
                    </div>
                    <div className="consent-item">
                      <Shield className="consent-icon" />
                      <span className="consent-label">Research:</span>
                      <span className={`consent-status ${selectedSubmission.consent.research ? 'consent-granted' : 'consent-denied'}`}>
                        {selectedSubmission.consent.research ? 'Granted' : 'Not Granted'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <h4 className="section-title">Reported Symptoms</h4>
                  <div className="symptoms-card">
                    <p className="symptoms-detail">{selectedSubmission.symptoms}</p>
                  </div>
                </div>

                {/* Images */}
                {selectedSubmission.images.length > 0 && (
                  <div>
                    <h4 className="section-title">Uploaded Images</h4>
                    <div className="modal-images-grid">
                      {selectedSubmission.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Symptom ${index + 1}`}
                          className="modal-image"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Test Results */}
                {selectedSubmission.testResults && (
                  <div>
                    <h4 className="section-title">Test Results</h4>
                    <div className="test-results-card">
                      <div className="test-results-header">
                        <div className="test-results-info">
                          <h5 className="test-results-type">{selectedSubmission.testType}</h5>
                          <p className="test-results-date">
                            <Calendar className="test-results-icon" />
                            Results uploaded: {formatDate(selectedSubmission.testResults.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="test-results-summary">
                        <h6 className="test-results-summary-title">Summary:</h6>
                        <p className="test-results-summary-text">{selectedSubmission.testResults.summary}</p>
                      </div>
                      
                      <div className="test-results-files">
                        <h6 className="test-results-files-title">Attached Files:</h6>
                        <div className="test-results-files-list">
                          {selectedSubmission.testResults.files.map((file, index) => (
                            <div key={index} className="test-results-file">
                              <FileText className="test-results-file-icon" />
                              <div className="test-results-file-info">
                                <span className="test-results-file-name">{file.name}</span>
                                <span className="test-results-file-type">{file.type}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Diagnoses */}
                <div>
                  <h4 className="section-title">Doctor Diagnoses</h4>
                  <div className="diagnoses-list">
                    {selectedSubmission.diagnoses.map((diagnosis) => (
                      <div key={diagnosis.id} className="diagnosis-card">
                        <div className="diagnosis-header">
                          <h5 className="diagnosis-doctor">{diagnosis.doctorName}</h5>
                          <span className="diagnosis-date">{formatDate(diagnosis.createdAt)}</span>
                        </div>
                        <p className="diagnosis-text">{diagnosis.analysis}</p>
                      </div>
                    ))}
                    
                    {/* New Diagnosis Section */}
                    <div className="new-diagnosis-card">
                      <h5 className="new-diagnosis-title">Add New Diagnosis - Dr. Sarah Mitchell</h5>
                      <textarea
                        value={analysis}
                        onChange={(e) => setAnalysis(e.target.value)}
                        placeholder="Enter your diagnosis and recommendations..."
                        className="diagnosis-textarea"
                      />
                      <button
                        onClick={handleAddDiagnosis}
                        disabled={!analysis.trim()}
                        className="btn btn-add-diagnosis"
                      >
                        Add Diagnosis
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {modalType === 'assign' && selectedSubmission && (
        <div className="modal-overlay">
          <div className="modal-container">
            {/* Modal Header */}
            <div className="modal-header modal-header-orange">
              <h3 className="modal-title">Assign to Lab - {selectedSubmission.patient.name}</h3>
              <button
                onClick={handleCloseModal}
                className="modal-close"
              >
                <X className="close-icon" />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-content">
                {/* Lab Selection */}
                <div>
                  <h4 className="section-title">Select Lab for Assignment</h4>
                  
                  {/* Test Type Display */}
                  <div className="test-type-display">
                    <h5 className="test-type-label">Recommended Test:</h5>
                    <div className="dropdown-container">
                      <button
                        onClick={() => setShowTestTypeDropdown(!showTestTypeDropdown)}
                        className="dropdown-button dropdown-button-orange"
                      >
                        <span>{selectedTestType || 'Select Test Type'}</span>
                        <ChevronDown className={`dropdown-icon ${showTestTypeDropdown ? 'dropdown-icon-rotated' : ''}`} />
                      </button>

                      {showTestTypeDropdown && (
                        <div className="dropdown-menu">
                          {testTypes.map((testType) => (
                            <button
                              key={testType}
                              onClick={() => {
                                setSelectedTestType(testType);
                                setShowTestTypeDropdown(false);
                              }}
                              className="dropdown-item"
                            >
                              <div className="test-type-name">{testType}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="dropdown-container">
                    <button
                      onClick={() => setShowLabDropdown(!showLabDropdown)}
                      className="dropdown-button dropdown-button-orange"
                    >
                      <span>{selectedLab ? `Selected: ${selectedLab.name}` : 'Select Lab'}</span>
                      <ChevronDown className={`dropdown-icon ${showLabDropdown ? 'dropdown-icon-rotated' : ''}`} />
                    </button>

                    {showLabDropdown && (
                      <div className="dropdown-menu">
                        {mockLabs.map((lab) => (
                          <button
                            key={lab.id}
                            onClick={() => {
                              setSelectedLab(lab);
                              setShowLabDropdown(false);
                            }}
                            className="dropdown-item"
                          >
                            <div className="lab-name">{lab.name}</div>
                            <div className="lab-location">{lab.location}</div>
                            <div className="lab-specialties">
                              {lab.specialties.join(', ')}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm Button */}
                {selectedLab && (
                  <button
                    onClick={handleAssignToLab}
                    className="btn btn-confirm"
                  >
                    Confirm Assignment to {selectedLab.name}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refer Modal */}
      {modalType === 'refer' && selectedSubmission && (
        <div className="modal-overlay">
          <div className="modal-container">
            {/* Modal Header */}
            <div className="modal-header modal-header-blue">
              <h3 className="modal-title">Refer Patient - {selectedSubmission.patient.name}</h3>
              <button
                onClick={handleCloseModal}
                className="modal-close"
              >
                <X className="close-icon" />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-content">
                {/* Patient Summary */}
                <div className="patient-summary-card">
                  <h4 className="section-title">Patient Summary</h4>
                  <p className="summary-text">{selectedSubmission.patient.name}, {selectedSubmission.patient.age} years old</p>
                  <p className="summary-symptoms">Symptoms: {selectedSubmission.symptoms.substring(0, 100)}...</p>
                </div>

                {/* Doctor Selection */}
                <div>
                  <h4 className="section-title">Select Doctor for Referral</h4>
                  <div className="dropdown-container">
                    <button
                      onClick={() => setShowDoctorDropdown(!showDoctorDropdown)}
                      className="dropdown-button dropdown-button-blue"
                    >
                      <span>{selectedDoctor ? `Refer to ${selectedDoctor.name}` : 'Select Doctor'}</span>
                      <ChevronDown className={`dropdown-icon ${showDoctorDropdown ? 'dropdown-icon-rotated' : ''}`} />
                    </button>

                    {showDoctorDropdown && (
                      <div className="dropdown-menu">
                        {mockDoctors.map((doctor) => (
                          <button
                            key={doctor.id}
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setShowDoctorDropdown(false);
                            }}
                            className="dropdown-item"
                          >
                            <div className="doctor-name">{doctor.name}</div>
                            <div className="doctor-specialty">{doctor.specialty}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm Button */}
                {selectedDoctor && (
                  <button
                    onClick={handleReferToDoctor}
                    className="btn btn-confirm"
                  >
                    Confirm Referral to {selectedDoctor.name}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-container modal-small">
            {/* Modal Header */}
            <div className="modal-header modal-header-red">
              <h3 className="modal-title">Confirm Logout</h3>
              <button
                onClick={handleLogoutCancel}
                className="modal-close"
              >
                <X className="close-icon" />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-content">
                <div className="logout-confirmation">
                  <div className="logout-icon-container">
                    <LogOut className="logout-confirmation-icon" />
                  </div>
                  <p className="logout-message">
                    Are you sure you want to log out? You will need to sign in again to access the dashboard.
                  </p>
                  
                  <div className="logout-actions">
                    <button
                      onClick={handleLogoutCancel}
                      className="btn btn-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogoutConfirm}
                      className="btn btn-logout-confirm"
                    >
                      <LogOut className="btn-icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;