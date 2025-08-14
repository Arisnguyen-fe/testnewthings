import React, { useState } from 'react';
import { 
  TestTube,
  Heart,
  Search,
  Filter,
  Upload,
  Clock,
  CheckCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ChevronDown,
  X,
  LogOut,
  FileText,
  CalendarDays,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mock appointment data
const mockAppointments = {
  '2024-01-16': ['09:00', '10:30', '14:00', '15:30'], // Booked slots
  '2024-01-17': ['09:30', '11:00', '13:30', '14:30', '15:00', '16:00', '16:30'], // Fully booked day
  '2024-01-18': ['10:00', '11:30', '14:00'], // Partially booked
  '2024-01-19': ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'], // Fully booked
  '2024-01-22': ['15:00', '16:00'], // Lightly booked
};

// Generate time slots from 9:00 AM to 5:00 PM (excluding lunch 12:00-13:30)
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 9;
  const endHour = 17;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Skip lunch break (12:00 PM to 1:30 PM)
      if (hour === 12 || (hour === 13 && minute === 0)) {
        continue;
      }
      
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      slots.push({
        value: timeString,
        display: displayTime,
        isLunchBreak: false
      });
    }
  }
  
  // Add lunch break slots for display
  const lunchSlots = [
    { value: '12:00', display: '12:00 PM', isLunchBreak: true },
    { value: '12:30', display: '12:30 PM', isLunchBreak: true },
    { value: '13:00', display: '1:00 PM', isLunchBreak: true }
  ];
  
  // Insert lunch slots at the correct position
  const beforeLunch = slots.filter(slot => slot.value < '12:00');
  const afterLunch = slots.filter(slot => slot.value >= '13:30');
  
  return [...beforeLunch, ...lunchSlots, ...afterLunch];
};

const timeSlots = generateTimeSlots();

const mockTestRequests = [
  {
    id: 'req1',
    doctor: {
      name: 'Dr. Sarah Mitchell',
      specialty: 'Internal Medicine'
    },
    requestTime: '2024-01-15T09:30:00Z',
    patient: {
      name: 'John Anderson',
      age: 45,
      phone: '+1 (555) 123-4567',
      email: 'john.anderson@email.com',
      location: 'New York, NY'
    },
    testType: 'Complete Blood Count (CBC)',
    status: 'pending',
    notes: 'Patient reports fatigue and weakness. Please check for anemia.',
    appointmentStatus: 'not_confirmed',
    appointmentDetails: null
  },
  {
    id: 'req2',
    doctor: {
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology'
    },
    requestTime: '2024-01-15T11:15:00Z',
    patient: {
      name: 'Maria Rodriguez',
      age: 38,
      phone: '+1 (555) 987-6543',
      email: 'maria.rodriguez@email.com',
      location: 'Los Angeles, CA'
    },
    testType: 'Lipid Panel',
    status: 'uploaded',
    notes: 'Routine cholesterol screening for cardiovascular risk assessment.',
    appointmentStatus: 'confirmed',
    appointmentDetails: {
      date: '2024-01-18',
      time: '10:30',
      displayTime: '10:30 AM'
    }
  },
  {
    id: 'req3',
    doctor: {
      name: 'Dr. Emily Johnson',
      specialty: 'Endocrinology'
    },
    requestTime: '2024-01-15T14:20:00Z',
    patient: {
      name: 'Robert Kim',
      age: 52,
      phone: '+1 (555) 456-7890',
      email: 'robert.kim@email.com',
      location: 'Chicago, IL'
    },
    testType: 'HbA1c & Glucose',
    status: 'pending',
    notes: 'Diabetic patient with recent symptoms.',
    appointmentStatus: 'not_confirmed',
    appointmentDetails: null
  },
  {
    id: 'req4',
    doctor: {
      name: 'Dr. Lisa Thompson',
      specialty: 'Family Medicine'
    },
    requestTime: '2024-01-14T16:45:00Z',
    patient: {
      name: 'Jennifer Davis',
      age: 29,
      phone: '+1 (555) 321-0987',
      email: 'jennifer.davis@email.com',
      location: 'Houston, TX'
    },
    testType: 'Thyroid Function Panel',
    status: 'uploaded',
    notes: 'Patient experiencing fatigue and weight changes.',
    appointmentStatus: 'confirmed',
    appointmentDetails: {
      date: '2024-01-16',
      time: '14:00',
      displayTime: '2:00 PM'
    }
  },
  {
    id: 'req5',
    doctor: {
      name: 'Dr. David Wilson',
      specialty: 'Gastroenterology'
    },
    requestTime: '2024-01-14T13:10:00Z',
    patient: {
      name: 'Thomas Brown',
      age: 41,
      phone: '+1 (555) 654-3210',
      email: 'thomas.brown@email.com',
      location: 'Phoenix, AZ'
    },
    testType: 'Liver Function Tests',
    status: 'pending',
    notes: 'Follow-up testing after abnormal results last month.',
    appointmentStatus: 'not_confirmed',
    appointmentDetails: null
  }
];

const LabStaffDashboard = () => {
  const [testRequests, setTestRequests] = useState(mockTestRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [resultSummary, setResultSummary] = useState('');
  const [summaryError, setSummaryError] = useState('');
  
  // Appointment scheduling states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [isModifyingAppointment, setIsModifyingAppointment] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="status-icon status-icon-red" />;
      case 'uploaded':
        return <CheckCircle className="status-icon status-icon-green" />;
      default:
        return <Clock className="status-icon status-icon-gray" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge status-badge-red';
      case 'uploaded':
        return 'status-badge status-badge-green';
      default:
        return 'status-badge status-badge-gray';
    }
  };

  const handleUploadClick = (request) => {
    setSelectedRequest(request);
    setModalType('upload');
  };

  const handleScheduleClick = (request) => {
    setSelectedRequest(request);
    setModalType('schedule');
    setIsModifyingAppointment(request.appointmentStatus === 'confirmed');
    setSelectedDate('');
    setSelectedTimeSlot('');
    setSelectedDateTime('');
    setAvailableSlots([]);
    // Initialize with earliest available date after modal opens
    setTimeout(() => {
      initializeDefaultDate();
    }, 100);
  };

  const handleViewClick = (request) => {
    setSelectedRequest(request);
    setModalType('view');
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedRequest(null);
    setResultSummary('');
    setSummaryError('');
    setSelectedDate('');
    setSelectedTimeSlot('');
    setSelectedDateTime('');
    setAvailableSlots([]);
    setIsModifyingAppointment(false);
  };

  const handleSummaryChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setResultSummary(value);
      setSummaryError('');
    } else {
      setSummaryError('Summary cannot exceed 500 characters');
    }
  };

  const handleUploadResults = () => {
    if (selectedRequest) {
      setTestRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: 'uploaded' }
            : req
        )
      );
      
      alert(`Test results uploaded successfully for ${selectedRequest.patient.name}`);
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
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateFullyBooked = (dateString) => {
    const bookedSlots = mockAppointments[dateString] || [];
    const availableSlots = timeSlots.filter(slot => !slot.isLunchBreak);
    return bookedSlots.length >= availableSlots.length;
  };

  const isDateInPast = (dateString) => {
    const today = new Date();
    const checkDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const handleDateSelect = (dateString) => {
    if (isDateInPast(dateString) || isDateFullyBooked(dateString)) {
      return;
    }
    
    setSelectedDate(dateString);
    setSelectedTimeSlot('');
    
    // Get booked slots for the selected date
    const bookedSlots = mockAppointments[dateString] || [];
    
    // Filter available slots
    const available = timeSlots.map(slot => ({
      ...slot,
      isBooked: bookedSlots.includes(slot.value),
      isAvailable: !bookedSlots.includes(slot.value) && !slot.isLunchBreak
    }));
    
    setAvailableSlots(available);
  };

  const getEarliestAvailableDate = () => {
    const today = new Date();
    const currentMonth = new Date();
    const daysInMonth = getDaysInMonth(currentMonth);
    
    for (let day = today.getDate(); day <= daysInMonth; day++) {
      const dateString = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      if (!isDateInPast(dateString) && !isDateFullyBooked(dateString)) {
        return dateString;
      }
    }
    
    return null;
  };

  const initializeDefaultDate = () => {
    const earliestDate = getEarliestAvailableDate();
    if (earliestDate) {
      setSelectedDate(earliestDate);
      handleDateSelect(earliestDate);
    }
  };

  const handleTimeSlotSelect = (timeSlot) => {
    if (timeSlot.isAvailable) {
      setSelectedTimeSlot(timeSlot.value);
    }
  };

  const handleConfirmAppointment = () => {
    if ((selectedDate && selectedTimeSlot) || selectedDateTime) {
      const finalDate = selectedDateTime ? selectedDateTime.split('T')[0] : selectedDate;
      const finalTime = selectedDateTime ? 
        new Date(selectedDateTime).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }) : 
        availableSlots.find(slot => slot.value === selectedTimeSlot)?.display;
      
      // Update the request status to scheduled
      setTestRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { 
                ...req, 
                status: 'scheduled',
                appointmentStatus: 'confirmed',
                appointmentDetails: {
                  date: finalDate,
                  time: selectedDateTime ? selectedDateTime.split('T')[1].substring(0, 5) : selectedTimeSlot,
                  displayTime: finalTime
                }
              }
            : req
        )
      );
      
      const actionText = isModifyingAppointment ? 'modified' : 'scheduled';
      alert(`Appointment ${actionText} successfully!\nDate: ${finalDate}\nTime: ${finalTime}\nPatient: ${selectedRequest.patient.name}`);
      handleCloseModal();
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Add day headers
    dayNames.forEach(day => {
      days.push(
        <div key={day} className="lab-calendar-day-header">
          {day}
        </div>
      );
    });
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="lab-calendar-day lab-calendar-day-empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const isFullyBooked = isDateFullyBooked(dateString);
      const isPast = isDateInPast(dateString);
      const isSelected = selectedDate === dateString;
      const isDisabled = isPast || isFullyBooked;
      
      days.push(
        <div
          key={day}
          className={`lab-calendar-day ${isSelected ? 'lab-calendar-day-selected' : ''} ${isDisabled ? 'lab-calendar-day-disabled' : 'lab-calendar-day-available'}`}
          onClick={() => handleDateSelect(dateString)}
        >
          <span className="lab-calendar-day-number">{day}</span>
          {isFullyBooked && !isPast && (
            <span className="lab-calendar-day-status">Fully Booked</span>
          )}
        </div>
      );
    }
    
    return (
      <div className="lab-calendar-container">
        <div className="lab-calendar-header">
          <button
            onClick={() => navigateMonth(-1)}
            className="lab-calendar-nav-btn"
          >
            <ChevronLeft className="lab-calendar-nav-icon" />
          </button>
          <h4 className="lab-calendar-month-year">{monthYear}</h4>
          <button
            onClick={() => navigateMonth(1)}
            className="lab-calendar-nav-btn"
          >
            <ChevronRight className="lab-calendar-nav-icon" />
          </button>
        </div>
        <div className="lab-calendar-grid">
          {days}
        </div>
      </div>
    );
  };

  const filteredRequests = testRequests.filter(request => {
    const matchesSearch = request.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.testType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
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
    <div className="lab-dashboard-container">
      {/* Header */}
      <header className="lab-header">
        <div className="lab-header-content">
          <div className="lab-header-inner">
            <div className="lab-header-left">
              <div className="lab-logo-section">
                <div className="lab-logo-icon">
                  <Heart className="lab-logo-heart" />
                </div>
                <div>
                  <h1 className="lab-logo-title">HealthConnect</h1>
                  <p className="lab-logo-subtitle">Lab Staff Dashboard</p>
                </div>
              </div>
            </div>
            
            {/* User Info with TestTube Icon */}
            <div className="lab-user-info" onClick={() => setShowUserDropdown(!showUserDropdown)}>
              <div className="lab-user-card lab-user-card-clickable">
                <div className="lab-user-icon">
                  <TestTube className="lab-testtube-icon" />
                </div>
                <div className="lab-user-details">
                  <p className="lab-user-name">Alex Johnson</p>
                  <p className="lab-user-role">Lab Technician</p>
                </div>
                <ChevronDown className={`lab-user-dropdown-icon ${showUserDropdown ? 'lab-user-dropdown-icon-rotated' : ''}`} />
              </div>
              
              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="lab-user-dropdown-menu">
                  <button
                    onClick={handleLogoutClick}
                    className="lab-user-dropdown-item lab-logout-item"
                  >
                    <LogOut className="lab-dropdown-item-icon" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lab-main-content">
        {/* Page Title and Filters */}
        <div className="lab-page-header">
          <h2 className="lab-page-title">Test Requests</h2>
          
          <div className="lab-filters-container">
            {/* Search */}
            <div className="lab-search-container">
              <Search className="lab-search-icon" />
              <input
                type="text"
                placeholder="Search patients, doctors, or tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="lab-search-input"
              />
            </div>
            
            {/* Status Filter */}
            <div className="lab-filter-container">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="lab-status-filter"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="uploaded">Uploaded</option>
              </select>
              <Filter className="lab-filter-icon" />
            </div>
          </div>
        </div>

        {/* Test Requests List */}
        <div className="lab-requests-list">
          {filteredRequests.map((request) => (
            <div key={request.id} className="lab-request-card">
              <div className="lab-request-content">
                <div className="lab-request-main">
                  {/* Header with Doctor and Status */}
                  <div className="lab-card-header">
                    <div className="lab-doctor-section">
                      <div className="lab-doctor-avatar">
                        <User className="lab-doctor-icon" />
                      </div>
                      <div className="lab-doctor-details">
                        <h3 className="lab-doctor-name">{request.doctor.name}</h3>
                        <p className="lab-doctor-specialty">{request.doctor.specialty}</p>
                        <div className="lab-request-time">
                          <Calendar className="lab-calendar-icon" />
                          <span>{formatDate(request.requestTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Test Information */}
                  <div className="lab-test-info">
                    <h4 className="lab-test-type">{request.testType}</h4>
                  </div>

                  {/* Patient Information */}
                  <div className="lab-patient-info">
                    <h4 className="lab-patient-header">Patient: {request.patient.name}, {request.patient.age} years</h4>
                    <div className="lab-patient-contact">
                      <span className="lab-contact-item">
                        <Phone className="lab-contact-icon" />
                        {request.patient.phone}
                      </span>
                      <span className="lab-contact-item">
                        <Mail className="lab-contact-icon" />
                        {request.patient.email}
                      </span>
                      <span className="lab-contact-item">
                        <MapPin className="lab-contact-icon" />
                        {request.patient.location}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Status and Action */}
                <div className="lab-status-action">
                  <div className="lab-status-badge-container">
                    <span className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="lab-status-text">{request.status}</span>
                    </span>
                  </div>
                  <div className="lab-action-buttons">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleScheduleClick(request)}
                        className="lab-schedule-btn"
                      >
                        <CalendarDays className="lab-btn-icon" />
                        Schedule
                      </button>
                    )}
                    <button
                      onClick={() => handleUploadClick(request)}
                      disabled={request.status === 'uploaded'}
                      className={`lab-upload-btn ${request.status === 'uploaded' ? 'lab-upload-btn-disabled' : ''}`}
                    >
                      <Upload className="lab-btn-icon" />
                      Upload Results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="lab-empty-state">
            <div className="lab-empty-icon">
              <Search className="lab-empty-search-icon" />
            </div>
            <h3 className="lab-empty-title">No test requests found</h3>
            <p className="lab-empty-text">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {modalType === 'upload' && selectedRequest && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-container">
            <div className="lab-modal-header lab-modal-header-orange">
              <h3 className="lab-modal-title">Upload Test Results - {selectedRequest.patient.name}</h3>
              <button
                onClick={handleCloseModal}
                className="lab-modal-close"
              >
                <X className="lab-close-icon" />
              </button>
            </div>

            <div className="lab-modal-body">
              <div className="lab-modal-content">
                {/* Test Info */}
                <div className="lab-test-info-card">
                  <h4 className="lab-section-title">Test Information</h4>
                  <p className="lab-test-info-text">
                    <strong>Test Type:</strong> {selectedRequest.testType}
                  </p>
                  <p className="lab-test-info-text">
                    <strong>Requested by:</strong> {selectedRequest.doctor.name}
                  </p>
                  <p className="lab-test-info-text">
                    <strong>Patient:</strong> {selectedRequest.patient.name}
                  </p>
                </div>

                {/* Upload Area */}
                <div className="lab-upload-area">
                  <div className="lab-upload-icon-container">
                    <Upload className="lab-upload-icon" />
                  </div>
                  <h4 className="lab-upload-title">Upload Test Results</h4>
                  <p className="lab-upload-text">
                    Click to select files or drag and drop your test result files here
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="lab-file-input"
                  />
                </div>

                {/* Summary Section */}
                <div className="lab-summary-section">
                  <h4 className="lab-section-title">Test Result Summary</h4>
                  <div className="lab-summary-container">
                    <textarea
                      value={resultSummary}
                      onChange={handleSummaryChange}
                      placeholder="Add a brief description of the test results (optional)"
                      className="lab-summary-textarea"
                      rows="4"
                    />
                    <div className="lab-summary-footer">
                      <span className={`lab-character-count ${resultSummary.length > 450 ? 'lab-character-warning' : ''}`}>
                        {resultSummary.length}/500 characters
                      </span>
                      {summaryError && (
                        <span className="lab-summary-error">{summaryError}</span>
                      )}
                      {request.appointmentStatus === 'confirmed' && (
                        <button
                          onClick={() => handleScheduleClick(request)}
                          className="lab-schedule-btn"
                        >
                          <CalendarDays className="lab-btn-icon" />
                          Modify Schedule
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Button */}
                <div className="lab-modal-actions">
                  <button
                    onClick={handleCloseModal}
                    className="lab-btn lab-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadResults}
                    className="lab-btn lab-btn-confirm-upload"
                  >
                    <Upload className="lab-btn-icon" />
                    Submit Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Appointment Modal */}
      {modalType === 'schedule' && selectedRequest && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-container lab-modal-large">
            <div className="lab-modal-header lab-modal-header-orange">
              <h3 className="lab-modal-title">
                {isModifyingAppointment ? 'Modify' : 'Schedule'} Appointment for {selectedRequest.patient.name}
              </h3>
              <button
                onClick={handleCloseModal}
                className="lab-modal-close"
              >
                <X className="lab-close-icon" />
              </button>
            </div>

            <div className="lab-modal-body">
              <div className="lab-modal-content">
                {/* Patient and Test Info */}
                <div className="lab-appointment-info-card">
                  <h4 className="lab-section-title">Appointment Details</h4>
                  <div className="lab-appointment-info-grid">
                    <div className="lab-appointment-info-item">
                      <User className="lab-info-icon" />
                      <span><strong>Patient:</strong> {selectedRequest.patient.name}</span>
                    </div>
                    <div className="lab-appointment-info-item">
                      <TestTube className="lab-info-icon" />
                      <span><strong>Test:</strong> {selectedRequest.testType}</span>
                    </div>
                    <div className="lab-appointment-info-item">
                      <Clock className="lab-info-icon" />
                      <span><strong>Status:</strong> {selectedRequest.status}</span>
                    </div>
                  </div>
                </div>

                {/* Date Picker */}
                <div className="lab-date-picker-section">
                  <h4 className="lab-section-title">Select Date</h4>
                  <div className="lab-date-time-pickers">
                    <div className="lab-date-picker-container">
                      <label className="lab-picker-label">Date:</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          handleDateSelect(e.target.value);
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        className="lab-date-input"
                      />
                    </div>
                    
                    <div className="lab-datetime-picker-container">
                      <label className="lab-picker-label">Date & Time:</label>
                      <input
                        type="datetime-local"
                        value={selectedDateTime}
                        onChange={(e) => setSelectedDateTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="lab-datetime-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Date and Time Selection Row */}
                <div className="lab-datetime-selection-row">
                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="lab-time-slots-section">
                      <h4 className="lab-section-title">Select Time</h4>
                      <div className="lab-time-slots-grid">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.value}
                            onClick={() => handleTimeSlotSelect(slot)}
                            disabled={!slot.isAvailable}
                            className={`lab-time-slot ${
                              selectedTimeSlot === slot.value ? 'lab-time-slot-selected' : ''
                            } ${
                              slot.isLunchBreak ? 'lab-time-slot-lunch' : 
                              slot.isBooked ? 'lab-time-slot-booked' : 
                              slot.isAvailable ? 'lab-time-slot-available' : 'lab-time-slot-disabled'
                            }`}
                          >
                            <span className="lab-time-slot-time">{slot.display}</span>
                            {slot.isLunchBreak && (
                              <span className="lab-time-slot-label">Lunch Break</span>
                            )}
                            {slot.isBooked && !slot.isLunchBreak && (
                              <span className="lab-time-slot-label">Booked</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Available Slots Display */}
                {selectedDate && availableSlots.length > 0 && (
                  <div className="lab-available-slots-info">
                    <p className="lab-slots-info-text">
                      Available slots for {selectedDate}: {availableSlots.filter(slot => slot.isAvailable).length} slots available
                    </p>
                  </div>
                )}

                {selectedDate && availableSlots.length === 0 && (
                  <div className="lab-no-slots-info">
                    <p className="lab-no-slots-text">No available slots for {selectedDate}</p>
                  </div>
                )}

                {!selectedDate && (
                  <div className="lab-select-date-prompt">
                    <p className="lab-prompt-text">Please select a date to view available time slots</p>
                  </div>
                )}

                {/* Remove the old time slots section since it's now in the row above */}
                {false && selectedDate && (
                  <div className="lab-time-slots-section">
                    <h4 className="lab-section-title">Available Time Slots for {selectedDate}</h4>
                    <div className="lab-time-slots-grid">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.value}
                          onClick={() => handleTimeSlotSelect(slot)}
                          disabled={!slot.isAvailable}
                          className={`lab-time-slot ${
                            selectedTimeSlot === slot.value ? 'lab-time-slot-selected' : ''
                          } ${
                            slot.isLunchBreak ? 'lab-time-slot-lunch' : 
                            slot.isBooked ? 'lab-time-slot-booked' : 
                            slot.isAvailable ? 'lab-time-slot-available' : 'lab-time-slot-disabled'
                          }`}
                        >
                          <span className="lab-time-slot-time">{slot.display}</span>
                          {slot.isLunchBreak && (
                            <span className="lab-time-slot-label">Lunch Break</span>
                          )}
                          {slot.isBooked && !slot.isLunchBreak && (
                            <span className="lab-time-slot-label">Booked</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Appointment Summary */}
                {((selectedDate && selectedTimeSlot) || selectedDateTime) && (
                  <div className="lab-appointment-summary">
                    <h4 className="lab-section-title">Selected Appointment</h4>
                    <div className="lab-appointment-summary-card">
                      <div className="lab-appointment-summary-item">
                        <Calendar className="lab-appointment-summary-icon" />
                        <span><strong>Date:</strong> {selectedDateTime ? selectedDateTime.split('T')[0] : selectedDate}</span>
                      </div>
                      <div className="lab-appointment-summary-item">
                        <Clock className="lab-appointment-summary-icon" />
                        <span><strong>Time:</strong> {
                          selectedDateTime ? 
                            new Date(selectedDateTime).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit', 
                              hour12: true 
                            }) : 
                            availableSlots.find(slot => slot.value === selectedTimeSlot)?.display
                        }</span>
                      </div>
                      <div className="lab-appointment-summary-item">
                        <User className="lab-appointment-summary-icon" />
                        <span><strong>Patient:</strong> {selectedRequest.patient.name}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="lab-modal-actions">
                  <button
                    onClick={handleCloseModal}
                    className="lab-btn lab-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAppointment}
                    disabled={!(selectedDate && selectedTimeSlot) && !selectedDateTime}
                    className="lab-btn lab-btn-confirm-appointment"
                  >
                    <CalendarDays className="lab-btn-icon" />
                    {isModifyingAppointment ? 'Update' : 'Confirm'} Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modalType === 'view' && selectedRequest && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-container lab-modal-large">
            <div className="lab-modal-header lab-modal-header-orange">
              <h3 className="lab-modal-title">Test Request Details - {selectedRequest.patient.name}</h3>
              <button
                onClick={handleCloseModal}
                className="lab-modal-close"
              >
                <X className="lab-close-icon" />
              </button>
            </div>

            <div className="lab-modal-body">
              <div className="lab-modal-content">
                {/* Doctor Information */}
                <div className="lab-info-card">
                  <h4 className="lab-section-title">Requesting Doctor</h4>
                  <div className="lab-info-grid">
                    <div className="lab-info-item">
                      <User className="lab-info-icon" />
                      <span>{selectedRequest.doctor.name}</span>
                    </div>
                    <div className="lab-info-item">
                      <span className="lab-info-label">Specialty:</span>
                      <span>{selectedRequest.doctor.specialty}</span>
                    </div>
                    <div className="lab-info-item">
                      <Calendar className="lab-info-icon" />
                      <span>Requested: {formatDate(selectedRequest.requestTime)}</span>
                    </div>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="lab-info-card">
                  <h4 className="lab-section-title">Patient Information</h4>
                  <div className="lab-info-grid">
                    <div className="lab-info-item">
                      <User className="lab-info-icon" />
                      <span>{selectedRequest.patient.name}, {selectedRequest.patient.age} years</span>
                    </div>
                    <div className="lab-info-item">
                      <Phone className="lab-info-icon" />
                      <span>{selectedRequest.patient.phone}</span>
                    </div>
                    <div className="lab-info-item">
                      <Mail className="lab-info-icon" />
                      <span>{selectedRequest.patient.email}</span>
                    </div>
                    <div className="lab-info-item">
                      <MapPin className="lab-info-icon" />
                      <span>{selectedRequest.patient.location}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-container lab-modal-small">
            <div className="lab-modal-header lab-modal-header-red">
              <h3 className="lab-modal-title">Confirm Logout</h3>
              <button
                onClick={handleLogoutCancel}
                className="lab-modal-close"
              >
                <X className="lab-close-icon" />
              </button>
            </div>

            <div className="lab-modal-body">
              <div className="lab-modal-content">
                <div className="lab-logout-confirmation">
                  <div className="lab-logout-icon-container">
                    <LogOut className="lab-logout-confirmation-icon" />
                  </div>
                  <p className="lab-logout-message">
                    Are you sure you want to log out? You will need to sign in again to access the dashboard.
                  </p>
                  
                  <div className="lab-logout-actions">
                    <button
                      onClick={handleLogoutCancel}
                      className="lab-btn lab-btn-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogoutConfirm}
                      className="lab-btn lab-btn-logout-confirm"
                    >
                      <LogOut className="lab-btn-icon" />
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

export default LabStaffDashboard;