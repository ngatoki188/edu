// Set current date in header
document.addEventListener('DOMContentLoaded', function() {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const today = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDateElement.textContent = today.toLocaleDateString('vi-VN', options);
    }

    // Initialize navigation
    initNavigation();
    initInvoiceTable();
});

// Navigation functionality
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const moduleContents = document.querySelectorAll('.module-content');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const moduleName = this.getAttribute('data-module');
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked nav item
            this.classList.add('active');

            // Hide all module contents
            moduleContents.forEach(content => content.classList.remove('active'));
            
            // Show selected module
            const targetModule = document.getElementById(`${moduleName}-module`);
            if (targetModule) {
                targetModule.classList.add('active');
            }

            // Update page title
            updatePageTitle(moduleName);
            
            // Special handling for grade-input module
            if (moduleName === 'grade-input') {
                setTimeout(function() {
                    // Initialize dropdown states
                    const semesterFilter = document.getElementById('grade-semester-filter');
                    const subjectFilter = document.getElementById('grade-subject-filter');
                    const classFilter = document.getElementById('grade-class-filter');
                    
                    if (subjectFilter) {
                        subjectFilter.disabled = !semesterFilter || !semesterFilter.value;
                    }
                    if (classFilter) {
                        classFilter.disabled = !semesterFilter || !semesterFilter.value || !subjectFilter || !subjectFilter.value;
                    }
                    
                    checkAndLoadTable();
                }, 100);
            }
            
            // Special handling for student-fee-config module
            if (moduleName === 'student-fee-config') {
                setTimeout(function() {
                    // Initialize dropdown states
                    const semesterFilter = document.getElementById('student-fee-semester-filter');
                    const periodFilter = document.getElementById('student-fee-period-filter');
                    const classFilter = document.getElementById('student-fee-class-filter');
                    
                    if (periodFilter) {
                        periodFilter.disabled = !semesterFilter || !semesterFilter.value;
                    }
                    if (classFilter) {
                        classFilter.disabled = !semesterFilter || !semesterFilter.value || !periodFilter || !periodFilter.value;
                    }
                    
                    checkAndLoadStudentFeeTable();
                }, 100);
            }

            // Special handling for fee-config module
            if (moduleName === 'fee-config') {
                setTimeout(function() {
                    loadFeeConfigTable();
                }, 100);
            }
            
            // Special handling for attendance module
            if (moduleName === 'attendance') {
                setTimeout(function() {
                    // Initialize dropdown states
                    const semesterFilter = document.getElementById('attendance-semester-filter');
                    const classFilter = document.getElementById('attendance-class-filter');
                    
                    if (classFilter) {
                        classFilter.disabled = !semesterFilter || !semesterFilter.value;
                    }
                    
                    checkAndLoadAttendanceTable();
                }, 100);
            }
            
            // Special handling for final-grade module
            if (moduleName === 'final-grade') {
                setTimeout(function() {
                    loadFinalGradeTable();
                }, 100);
            }
        });
    });
}

// Update page title based on module
function updatePageTitle(moduleName) {
    const pageTitle = document.querySelector('.page-title');
    const titles = {
        'feeitem': 'Quản lý Khoản phí',
        'payment-period': 'Quản lý Đợt thanh toán',
        'payment-config': 'Cấu hình Đợt thanh toán',
        'fee-config': 'Cấu hình phí',
        'student-fee-config': 'Cấu hình khoản phí cho học sinh',
        'debt-management': 'Quản lý khoản nợ',
        'invoice-management': 'Quản lý Hóa đơn',
        'final-grade': 'Nhập điểm cuối kỳ',
        'grade': 'Tạo đầu điểm',
        'grade-input': 'Nhập điểm',
        'grade-approval': 'Duyệt điểm cho Admin',
        'schedule': 'Lịch học',
        'attendance': 'Điểm danh'
    };
    
    if (pageTitle && titles[moduleName]) {
        pageTitle.textContent = titles[moduleName];
    }
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// FeeItem functions
function showAddFeeItemForm() {
    showModal('add-feeitem-modal');
}

// Payment Period functions
function showAddPaymentPeriodForm() {
    showModal('add-payment-period-modal');
}

// Show Payment Config Module (from Payment Period module)
function showPaymentConfigModule() {
    const moduleContents = document.querySelectorAll('.module-content');
    
    // Hide all module contents
    moduleContents.forEach(content => content.classList.remove('active'));
    
    // Show payment config module
    const targetModule = document.getElementById('payment-config-module');
    if (targetModule) {
        targetModule.classList.add('active');
    }
    
    // Update page title
    updatePageTitle('payment-config');
}

// Show Payment Config for specific period
function showPaymentConfigForPeriod(periodCode, periodName) {
    // Store selected period info for filtering
    window.selectedPaymentPeriod = {
        code: periodCode,
        name: periodName
    };
    
    // Show payment config module
    showPaymentConfigModule();
    
    // Filter payment config table by period (if needed)
    // In a real app, this would filter the data
    // For now, we just show all configs
}

// Show Payment Period Module (from Payment Config module)
function showPaymentPeriodModule() {
    const moduleContents = document.querySelectorAll('.module-content');
    
    // Hide all module contents
    moduleContents.forEach(content => content.classList.remove('active'));
    
    // Show payment period module
    const targetModule = document.getElementById('payment-period-module');
    if (targetModule) {
        targetModule.classList.add('active');
    }
    
    // Update page title
    updatePageTitle('payment-period');
    
    // Update nav item active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(nav => nav.classList.remove('active'));
    const paymentPeriodNav = document.querySelector('.nav-item[data-module="payment-period"]');
    if (paymentPeriodNav) {
        paymentPeriodNav.classList.add('active');
    }
}

// Payment Config functions
function showAddPaymentConfigForm() {
    // Display selected payment period if available
    const periodDisplay = document.getElementById('payment-config-period-display');
    if (periodDisplay && window.selectedPaymentPeriod) {
        periodDisplay.textContent = window.selectedPaymentPeriod.name + ' (' + window.selectedPaymentPeriod.code + ')';
        periodDisplay.style.color = '#2D2D2D';
    } else if (periodDisplay) {
        periodDisplay.textContent = '-- Chọn đợt thanh toán từ danh sách --';
        periodDisplay.style.color = '#505050';
    }
    
    showModal('add-payment-config-modal');
}

// Student Fee Config functions
function showAddStudentFeeConfigForm() {
    showModal('add-student-fee-config-modal');
}

// =========================
// Student Fee Config Status Workflow
// =========================

const studentFeeConfigStorage = {};

function getCurrentStudentFeeConfigKey() {
    const semesterFilter = document.getElementById('student-fee-semester-filter');
    const periodFilter = document.getElementById('student-fee-period-filter');
    const classFilter = document.getElementById('student-fee-class-filter');
    const semester = semesterFilter ? semesterFilter.value : '';
    const periodCode = periodFilter ? periodFilter.value : '';
    const classCode = classFilter ? classFilter.value : '';
    if (!semester || !periodCode || !classCode) return null;
    return { semester, periodCode, classCode };
}

function getStudentFeeConfigKeyStr(key) {
    return `${key.semester}__${key.periodCode}__${key.classCode}`;
}

function findFeeConfigRecordByKey(key) {
    return feeConfigData.find(x =>
        x.semester === key.semester &&
        x.periodCode === key.periodCode &&
        x.classCode === key.classCode
    );
}

function ensureFeeConfigRecordForKey(key) {
    let cfg = findFeeConfigRecordByKey(key);
    if (cfg) {
        // Backward-compat for older objects
        if (typeof cfg.rejectReason === 'undefined') cfg.rejectReason = '';
        if (typeof cfg.resubmitNote === 'undefined') cfg.resubmitNote = '';
        return cfg;
    }
    cfg = {
        id: feeConfigNextId++,
        semester: key.semester,
        periodCode: key.periodCode,
        classCode: key.classCode,
        status: 'Đang soạn',
        rejectReason: '',
        resubmitNote: ''
    };
    feeConfigData.unshift(cfg);
    return cfg;
}

function renderStudentFeeConfigStatusUI() {
    const badgeEl = document.getElementById('student-fee-config-status-badge');
    const saveBtn = document.getElementById('student-fee-config-save-btn');
    const approveBtn = document.getElementById('student-fee-config-approve-btn');
    const rejectBtn = document.getElementById('student-fee-config-reject-btn');
    const feedbackBox = document.getElementById('student-fee-config-feedback-box');
    const feedbackInner = document.getElementById('student-fee-config-feedback-inner');
    const reasonText = document.getElementById('student-fee-config-reject-reason-text');
    const resubmitRow = document.getElementById('student-fee-config-resubmit-row');
    const resubmitText = document.getElementById('student-fee-config-resubmit-text');
    const needsRevise = document.getElementById('student-fee-config-needs-revise');

    const key = getCurrentStudentFeeConfigKey();
    if (!key) {
        if (badgeEl) badgeEl.innerHTML = '';
        if (saveBtn) saveBtn.disabled = true;
        if (approveBtn) approveBtn.style.display = 'none';
        if (rejectBtn) rejectBtn.style.display = 'none';
        if (feedbackBox) feedbackBox.style.display = 'none';
        return;
    }

    const cfg = ensureFeeConfigRecordForKey(key);
    const status = cfg.status || 'Đang soạn';

    if (badgeEl) badgeEl.innerHTML = getFeeConfigStatusBadge(status);

    // Default states
    if (approveBtn) approveBtn.style.display = 'none';
    if (rejectBtn) rejectBtn.style.display = 'none';
    if (feedbackBox) feedbackBox.style.display = 'none';
    if (resubmitRow) resubmitRow.style.display = 'none';
    if (needsRevise) needsRevise.style.display = 'none';

    if (status === 'Đang soạn') {
        if (saveBtn) saveBtn.disabled = false;
    } else if (status === 'Chờ xác nhận') {
        if (saveBtn) saveBtn.disabled = true;
        if (approveBtn) approveBtn.style.display = 'inline-flex';
        if (rejectBtn) rejectBtn.style.display = 'inline-flex';

        // Nếu đây là bản gửi lại sau khi bị từ chối: hiển thị lý do + lời xác nhận
        if (cfg.rejectReason) {
            if (feedbackBox) feedbackBox.style.display = 'block';
            if (feedbackInner) feedbackInner.style.background = '#FFF8E1';
            if (reasonText) reasonText.textContent = ` ${cfg.rejectReason}`;
            if (cfg.resubmitNote) {
                if (resubmitRow) resubmitRow.style.display = 'block';
                if (resubmitText) resubmitText.textContent = ` ${cfg.resubmitNote}`;
            }
        }
    } else if (status === 'Xác nhận') {
        if (saveBtn) saveBtn.disabled = true;
    } else if (status === 'Từ chối') {
        if (saveBtn) saveBtn.disabled = false; // cho biên soạn lại rồi gửi lại
        if (feedbackBox) feedbackBox.style.display = 'block';
        if (feedbackInner) feedbackInner.style.background = '#FFF6F6';
        if (reasonText) reasonText.textContent = cfg.rejectReason ? ` ${cfg.rejectReason}` : ' (không có)';
        if (needsRevise) needsRevise.style.display = 'block';
    } else {
        if (saveBtn) saveBtn.disabled = false;
    }
}

function approveStudentFeeConfig() {
    const key = getCurrentStudentFeeConfigKey();
    if (!key) return;
    const cfg = ensureFeeConfigRecordForKey(key);
    if (cfg.status !== 'Chờ xác nhận') {
        alert('Chỉ có thể chấp nhận khi trạng thái là "Chờ xác nhận".');
        return;
    }
    cfg.status = 'Xác nhận';
    cfg.rejectReason = '';
    cfg.resubmitNote = '';
    loadFeeConfigTable();
    renderStudentFeeConfigStatusUI();
    alert('Đã chấp nhận cấu hình.');
}

function openRejectStudentFeeConfigModal() {
    const key = getCurrentStudentFeeConfigKey();
    if (!key) return;
    const cfg = ensureFeeConfigRecordForKey(key);
    if (cfg.status !== 'Chờ xác nhận') {
        alert('Chỉ có thể từ chối khi trạng thái là "Chờ xác nhận".');
        return;
    }
    const input = document.getElementById('student-fee-config-reject-reason-input');
    if (input) input.value = '';
    showModal('student-fee-config-reject-modal');
}

function submitRejectStudentFeeConfig() {
    const reasonInput = document.getElementById('student-fee-config-reject-reason-input');
    const reason = reasonInput ? reasonInput.value.trim() : '';
    if (!reason) {
        alert('Vui lòng nhập lý do từ chối.');
        return;
    }
    const key = getCurrentStudentFeeConfigKey();
    if (!key) return;
    const cfg = ensureFeeConfigRecordForKey(key);
    if (cfg.status !== 'Chờ xác nhận') {
        alert('Chỉ có thể từ chối khi trạng thái là "Chờ xác nhận".');
        return;
    }
    cfg.status = 'Từ chối';
    cfg.rejectReason = reason;
    cfg.resubmitNote = '';
    closeModal('student-fee-config-reject-modal');
    loadFeeConfigTable();
    renderStudentFeeConfigStatusUI();
    alert('Đã từ chối cấu hình.');
}

function openResubmitStudentFeeConfigModal() {
    const key = getCurrentStudentFeeConfigKey();
    if (!key) return;
    const cfg = ensureFeeConfigRecordForKey(key);
    if (cfg.status !== 'Từ chối') {
        alert('Chỉ dùng "Gửi lại duyệt" khi trạng thái là "Từ chối".');
        return;
    }
    const input = document.getElementById('student-fee-config-resubmit-note-input');
    if (input) input.value = '';
    showModal('student-fee-config-resubmit-modal');
}

function submitResubmitStudentFeeConfig() {
    const noteInput = document.getElementById('student-fee-config-resubmit-note-input');
    const note = noteInput ? noteInput.value.trim() : '';
    if (!note) {
        alert('Vui lòng nhập lời xác nhận đã chỉnh sửa.');
        return;
    }

    // Gọi lại luồng lưu nhưng kèm lời xác nhận
    saveStudentFeeConfig({ resubmitNote: note, fromModal: true });
    closeModal('student-fee-config-resubmit-modal');
}

// Grade Point functions
function showAddGradePointForm() {
    showModal('add-grade-point-modal');
}


// Load Grade Points from table
function getGradePoints() {
    // Get grade points from the grade-point-table-body
    const tableBody = document.getElementById('grade-point-table-body');
    const rows = tableBody.querySelectorAll('tr');
    const gradePoints = [];
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 7) {
            gradePoints.push({
                code: cells[1].textContent.trim(),
                subject: cells[2].textContent.trim(),
                name: cells[3].textContent.trim(),
                weight: cells[4].textContent.trim(),
                maxScore: cells[5].textContent.trim()
            });
        }
    });
    
    return gradePoints;
}

// Handle semester change
function onSemesterChange() {
    const semesterFilter = document.getElementById('grade-semester-filter');
    const subjectFilter = document.getElementById('grade-subject-filter');
    const classFilter = document.getElementById('grade-class-filter');
    
    // Disable subject and class if no semester selected
    if (subjectFilter) {
        subjectFilter.disabled = !semesterFilter || !semesterFilter.value;
        if (!semesterFilter || !semesterFilter.value) {
            subjectFilter.value = '';
        }
    }
    if (classFilter) {
        classFilter.disabled = !semesterFilter || !semesterFilter.value;
        if (!semesterFilter || !semesterFilter.value) {
            classFilter.value = '';
        }
    }
    
    checkAndLoadTable();
}

// Handle subject change
function onSubjectChange() {
    const semesterFilter = document.getElementById('grade-semester-filter');
    const subjectFilter = document.getElementById('grade-subject-filter');
    const classFilter = document.getElementById('grade-class-filter');
    
    // Disable class if no subject selected
    if (classFilter) {
        classFilter.disabled = !subjectFilter || !subjectFilter.value;
        if (!subjectFilter || !subjectFilter.value) {
            classFilter.value = '';
        }
    }
    
    checkAndLoadTable();
}

// Handle class change
function onClassChange() {
    checkAndLoadTable();
}

// Check if all filters are selected and load table
function checkAndLoadTable() {
    const semesterFilter = document.getElementById('grade-semester-filter');
    const subjectFilter = document.getElementById('grade-subject-filter');
    const classFilter = document.getElementById('grade-class-filter');
    
    const hasSemester = semesterFilter && semesterFilter.value;
    const hasSubject = subjectFilter && subjectFilter.value;
    const hasClass = classFilter && classFilter.value;
    
    if (hasSemester && hasSubject && hasClass) {
        loadGradeInputTable();
    } else {
        // Show appropriate message
        const tableBody = document.getElementById('grade-input-table-body');
        const headerRow = document.getElementById('grade-input-table-header');
        const colCount = headerRow ? headerRow.querySelectorAll('th').length : 4;
        
        if (!hasSemester) {
            tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Vui lòng chọn kỳ học để hiển thị bảng nhập điểm</td></tr>';
        } else if (!hasSubject) {
            tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Vui lòng chọn môn học để hiển thị bảng nhập điểm</td></tr>';
        } else if (!hasClass) {
            tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Vui lòng chọn lớp để hiển thị bảng nhập điểm</td></tr>';
        }
    }
}

// Load Grade Input Table
function loadGradeInputTable() {
    const semesterFilter = document.getElementById('grade-semester-filter');
    const classFilter = document.getElementById('grade-class-filter');
    const subjectFilter = document.getElementById('grade-subject-filter');
    
    if (!semesterFilter || !classFilter || !subjectFilter) return;
    
    const selectedSemester = semesterFilter.value;
    const selectedClass = classFilter.value;
    const selectedSubjectValue = subjectFilter.value;
    const gradePoints = getGradePoints();
    
    // Require all three selections
    if (!selectedSemester) {
        const tableBody = document.getElementById('grade-input-table-body');
        const headerRow = document.getElementById('grade-input-table-header');
        const colCount = headerRow ? headerRow.querySelectorAll('th').length : 4;
        tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Vui lòng chọn kỳ học để hiển thị bảng nhập điểm</td></tr>';
        return;
    }
    
    if (!selectedSubjectValue) {
        const tableBody = document.getElementById('grade-input-table-body');
        const headerRow = document.getElementById('grade-input-table-header');
        const colCount = headerRow ? headerRow.querySelectorAll('th').length : 4;
        tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Vui lòng chọn môn học để hiển thị bảng nhập điểm</td></tr>';
        return;
    }
    
    if (!selectedClass) {
        const tableBody = document.getElementById('grade-input-table-body');
        const headerRow = document.getElementById('grade-input-table-header');
        const colCount = headerRow ? headerRow.querySelectorAll('th').length : 4;
        tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Vui lòng chọn lớp để hiển thị bảng nhập điểm</td></tr>';
        return;
    }
    
    // Filter by subject
    const subjectMap = {
        'math': 'Toán',
        'literature': 'Văn',
        'english': 'Anh',
        'physics': 'Lý',
        'chemistry': 'Hóa',
        'biology': 'Sinh',
        'history': 'Sử',
        'geography': 'Địa'
    };
    const selectedSubject = subjectMap[selectedSubjectValue];
    const filteredPoints = gradePoints.filter(gp => gp.subject === selectedSubject);
    
    if (filteredPoints.length === 0) {
        const tableBody = document.getElementById('grade-input-table-body');
        const headerRow = document.getElementById('grade-input-table-header');
        const colCount = headerRow ? headerRow.querySelectorAll('th').length : 4;
        tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Chưa có đầu điểm nào cho môn học này. Vui lòng tạo đầu điểm ở tab "Tạo đầu điểm" trước.</td></tr>';
        return;
    }
    
    // Build table header
    const headerRow = document.getElementById('grade-input-table-header');
    const existingHeaders = Array.from(headerRow.querySelectorAll('th'));
    
    // Keep first 3 columns (#, Mã SV, Họ và tên) and last 2 columns (Điểm tổng kết, Ghi chú)
    // Remove dynamic grade point columns (from index 3 to last-2)
    const fixedColumns = 3; // #, Mã SV, Họ và tên
    const lastColumnIndex = existingHeaders.length - 1; // Ghi chú
    const totalScoreColumnIndex = existingHeaders.length - 2; // Điểm tổng kết
    
    // Remove columns from right to left to avoid index shifting issues
    // Keep last 2 columns (Điểm tổng kết and Ghi chú)
    for (let i = totalScoreColumnIndex - 1; i >= fixedColumns; i--) {
        existingHeaders[i].remove();
    }
    
    // Add dynamic columns (before "Điểm tổng kết" column)
    const totalScoreHeader = headerRow.querySelector('th:nth-last-child(2)'); // Điểm tổng kết
    filteredPoints.forEach((point, index) => {
        const th = document.createElement('th');
        th.textContent = `${point.name} (${point.weight})`;
        th.setAttribute('data-grade-point', point.code);
        th.setAttribute('data-max-score', point.maxScore);
        headerRow.insertBefore(th, totalScoreHeader);
    });
    
    // Build table body
    const tableBody = document.getElementById('grade-input-table-body');
    tableBody.innerHTML = '';
    
    // Mock student data by class
    const studentsByClass = {
        '10A1': [
            { code: '3120410024', lastName: 'Trương Hồ', firstName: 'An' },
            { code: '3121560010', lastName: 'Nguyễn Quốc', firstName: 'Anh' },
            { code: '3120480015', lastName: 'Trần Phạm Ngọc', firstName: 'Ánh' },
            { code: '3120410048', lastName: 'Huỳnh Gia', firstName: 'Bảo' }
        ],
        '10A2': [
            { code: '3120410025', lastName: 'Lê Văn', firstName: 'Cường' },
            { code: '3121560011', lastName: 'Phạm Thị', firstName: 'Dung' },
            { code: '3120480016', lastName: 'Hoàng Văn', firstName: 'Đức' }
        ],
        '11A1': [
            { code: '3120410026', lastName: 'Vũ Thị', firstName: 'Hoa' },
            { code: '3121560012', lastName: 'Đặng Văn', firstName: 'Hùng' }
        ],
        '11A2': [
            { code: '3120410027', lastName: 'Bùi Thị', firstName: 'Lan' },
            { code: '3121560013', lastName: 'Trịnh Văn', firstName: 'Minh' }
        ],
        '12A1': [
            { code: '3120410028', lastName: 'Ngô Thị', firstName: 'Nga' },
            { code: '3121560014', lastName: 'Lý Văn', firstName: 'Phong' }
        ],
        '12A2': [
            { code: '3120410029', lastName: 'Đỗ Thị', firstName: 'Quỳnh' },
            { code: '3121560015', lastName: 'Võ Văn', firstName: 'Sơn' }
        ]
    };
    
    const students = studentsByClass[selectedClass] || [];
    
    if (students.length === 0) {
        const headerRow = document.getElementById('grade-input-table-header');
        const colCount = headerRow ? headerRow.querySelectorAll('th').length : 4;
        tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Lớp này chưa có học sinh</td></tr>';
        return;
    }
    
    students.forEach((student, rowIndex) => {
        const tr = document.createElement('tr');
        const fullName = `${student.lastName} ${student.firstName}`;
        
        // Create fixed columns: #, Mã SV, Họ và tên
        const sttTd = document.createElement('td');
        sttTd.textContent = rowIndex + 1;
        tr.appendChild(sttTd);
        
        const codeTd = document.createElement('td');
        codeTd.textContent = student.code;
        tr.appendChild(codeTd);
        
        const nameTd = document.createElement('td');
        nameTd.textContent = fullName;
        tr.appendChild(nameTd);
        
        // Add grade input cells for each grade point
        filteredPoints.forEach(point => {
            const td = document.createElement('td');
            td.className = 'grade-input-cell';
            td.innerHTML = `<input type="number" 
                                   class="grade-input" 
                                   data-student-code="${student.code}"
                                   data-grade-point="${point.code}"
                                   data-max-score="${point.maxScore}"
                                   min="0" 
                                   max="${point.maxScore}" 
                                   step="0.1" 
                                   value="1.0">`;
            tr.appendChild(td);
        });
        
        // Add total score column (before notes)
        const totalScoreTd = document.createElement('td');
        totalScoreTd.className = 'grade-input-cell';
        totalScoreTd.innerHTML = `<input type="number" 
                                         class="total-score-input" 
                                         data-student-code="${student.code}"
                                         min="0" 
                                         max="10" 
                                         step="0.1" 
                                         placeholder="0.0">`;
        tr.appendChild(totalScoreTd);
        
        // Add notes column (always last)
        const notesTd = document.createElement('td');
        notesTd.className = 'grade-input-cell';
        notesTd.innerHTML = `<input type="text" 
                                    class="notes-input" 
                                    data-student-code="${student.code}"
                                    placeholder="Ghi chú">`;
        tr.appendChild(notesTd);
        
        tableBody.appendChild(tr);
    });
}


// Save Grades
function saveGrades() {
    const students = [];
    const tableBody = document.getElementById('grade-input-table-body');
    const rows = tableBody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const studentCode = cells[1].textContent.trim();
        const gradeInputs = row.querySelectorAll('.grade-input');
        const totalScoreInput = row.querySelector('.total-score-input');
        const notesInput = row.querySelector('.notes-input');
        
        const grades = {};
        gradeInputs.forEach(input => {
            const gradePoint = input.getAttribute('data-grade-point');
            grades[gradePoint] = parseFloat(input.value) || 0;
        });
        
        students.push({
            code: studentCode,
            grades: grades,
            totalScore: totalScoreInput ? parseFloat(totalScoreInput.value) || 0 : 0,
            notes: notesInput ? notesInput.value : ''
        });
    });
    
    console.log('Saving grades:', students);
    alert('Đã lưu điểm thành công!');
}

// Grade Approval Functions
let currentApprovalId = null;

// Show approval detail
function showApprovalDetail(id) {
    currentApprovalId = id;
    
    // Mock data - in real app, this would be an API call
    const approvalData = {
        1: {
            semester: 'Học kỳ 1',
            subject: 'Toán',
            class: '10A1',
            teacher: 'Nguyễn Văn A',
            date: '15/01/2024',
            studentCount: 25,
            status: 'pending',
            note: 'Đã nhập đầy đủ điểm cho tất cả học sinh trong lớp',
            grades: [
                { code: '3120410024', name: 'Trương Hồ An', midterm: 8.5, final: 9.0, homework: 7.5, average: 8.4 },
                { code: '3121560010', name: 'Nguyễn Quốc Anh', midterm: 7.0, final: 8.0, homework: 8.5, average: 7.7 },
                { code: '3120480015', name: 'Trần Phạm Ngọc Ánh', midterm: 9.0, final: 8.5, homework: 9.0, average: 8.8 }
            ]
        },
        2: {
            semester: 'Học kỳ 1',
            subject: 'Văn',
            class: '10A2',
            teacher: 'Trần Thị B',
            date: '16/01/2024',
            studentCount: 30,
            status: 'approved',
            note: 'Đã duyệt và công bố điểm',
            grades: [
                { code: '3120410025', name: 'Lê Văn Cường', midterm: 8.0, final: 8.5, homework: 7.0, average: 8.0 },
                { code: '3121560011', name: 'Phạm Thị Dung', midterm: 7.5, final: 8.0, homework: 8.0, average: 7.8 }
            ]
        },
        3: {
            semester: 'Học kỳ 1',
            subject: 'Anh',
            class: '11A1',
            teacher: 'Lê Văn C',
            date: '17/01/2024',
            studentCount: 28,
            status: 'pending',
            note: 'Chờ admin duyệt',
            grades: [
                { code: '3120410026', name: 'Vũ Thị Hoa', midterm: 8.0, final: 8.5, homework: 8.0, average: 8.2 },
                { code: '3121560012', name: 'Đặng Văn Hùng', midterm: 7.0, final: 7.5, homework: 7.5, average: 7.3 }
            ]
        }
    };
    
    const data = approvalData[id] || approvalData[1];
    
    // Set detail information
    document.getElementById('approval-detail-semester').textContent = data.semester;
    document.getElementById('approval-detail-subject').textContent = data.subject;
    document.getElementById('approval-detail-class').textContent = data.class;
    document.getElementById('approval-detail-teacher').textContent = data.teacher;
    document.getElementById('approval-detail-date').textContent = data.date;
    document.getElementById('approval-detail-student-count').textContent = data.studentCount;
    document.getElementById('approval-detail-note').textContent = data.note;
    
    // Set status
    const statusElement = document.getElementById('approval-detail-status');
    const approveBtn = document.getElementById('approval-approve-btn');
    const rejectBtn = document.getElementById('approval-reject-btn');
    
    if (data.status === 'approved') {
        statusElement.innerHTML = '<span class="badge badge-success">Đã duyệt</span>';
        approveBtn.style.display = 'none';
        rejectBtn.style.display = 'none';
    } else if (data.status === 'rejected') {
        statusElement.innerHTML = '<span class="badge badge-danger">Đã từ chối</span>';
        approveBtn.style.display = 'none';
        rejectBtn.style.display = 'none';
    } else {
        statusElement.innerHTML = '<span class="badge badge-warning">Chờ duyệt</span>';
        approveBtn.style.display = 'inline-flex';
        rejectBtn.style.display = 'inline-flex';
    }
    
    // Build grades table
    const gradesTableBody = document.getElementById('approval-detail-grades');
    gradesTableBody.innerHTML = '';
    
    data.grades.forEach((grade, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${grade.code}</td>
            <td>${grade.name}</td>
            <td>${grade.midterm}</td>
            <td>${grade.final}</td>
            <td>${grade.homework}</td>
            <td><strong>${grade.average}</strong></td>
        `;
        gradesTableBody.appendChild(tr);
    });
    
    showModal('approval-detail-modal');
}

// Approve grade
function approveGrade(id) {
    if (confirm('Bạn có chắc chắn muốn duyệt điểm này?')) {
        // Update status in table
        const rows = document.querySelectorAll('#grade-approval-table-body tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells[0].textContent.trim() === id.toString()) {
                cells[7].innerHTML = '<span class="badge badge-success">Đã duyệt</span>';
                const actionCell = cells[8];
                actionCell.innerHTML = '<button class="btn-icon btn-view" title="Xem chi tiết" onclick="showApprovalDetail(' + id + ')">👁️</button>';
            }
        });
        alert('Đã duyệt điểm thành công!');
    }
}

// Reject grade
function rejectGrade(id) {
    if (confirm('Bạn có chắc chắn muốn từ chối điểm này?')) {
        const reason = prompt('Vui lòng nhập lý do từ chối:');
        if (reason) {
            // Update status in table
            const rows = document.querySelectorAll('#grade-approval-table-body tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells[0].textContent.trim() === id.toString()) {
                    cells[7].innerHTML = '<span class="badge badge-danger">Đã từ chối</span>';
                    const actionCell = cells[8];
                    actionCell.innerHTML = '<button class="btn-icon btn-view" title="Xem chi tiết" onclick="showApprovalDetail(' + id + ')">👁️</button>';
                }
            });
            alert('Đã từ chối điểm. Lý do: ' + reason);
        }
    }
}

// Approve from detail modal
function approveGradeFromDetail() {
    if (currentApprovalId) {
        approveGrade(currentApprovalId);
        closeModal('approval-detail-modal');
    }
}

// Reject from detail modal
function rejectGradeFromDetail() {
    if (currentApprovalId) {
        rejectGrade(currentApprovalId);
        closeModal('approval-detail-modal');
    }
}

// Filter approval list
function filterApprovalList() {
    const statusFilter = document.getElementById('approval-status-filter');
    const selectedStatus = statusFilter ? statusFilter.value : '';
    const rows = document.querySelectorAll('#grade-approval-table-body tr');
    
    rows.forEach(row => {
        if (!selectedStatus) {
            row.style.display = '';
            return;
        }
        
        const statusCell = row.querySelector('td:nth-child(8)');
        if (statusCell) {
            const statusText = statusCell.textContent.trim();
            let shouldShow = false;
            
            if (selectedStatus === 'pending' && statusText.includes('Chờ duyệt')) {
                shouldShow = true;
            } else if (selectedStatus === 'approved' && statusText.includes('Đã duyệt')) {
                shouldShow = true;
            } else if (selectedStatus === 'rejected' && statusText.includes('Đã từ chối')) {
                shouldShow = true;
            }
            
            row.style.display = shouldShow ? '' : 'none';
        }
    });
}

// Schedule Functions
let schedules = [
    { id: 1, teacher: 'emp1', room: 'R001', fromDate: '2025-11-19T15:44', toDate: '2025-11-19T17:44', note: 'dạy và học' },
    { id: 2, teacher: 'nsa001', room: '101', fromDate: '2025-12-09T11:00', toDate: '2025-12-10T00:00', note: '' }
];

// Show add schedule form
function showAddScheduleForm() {
    const form = document.getElementById('schedule-form');
    if (form) {
        form.reset();
        form.removeAttribute('data-editing-id');
        showModal('add-schedule-modal');
    }
}

// Format datetime for display
function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
}

// Add new schedule
function addSchedule() {
    const teacher = document.getElementById('schedule-teacher').value;
    const room = document.getElementById('schedule-room').value;
    const fromDate = document.getElementById('schedule-from-date').value;
    const toDate = document.getElementById('schedule-to-date').value;
    const note = document.getElementById('schedule-note').value;
    
    if (!teacher || !room || !fromDate || !toDate) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    const newSchedule = {
        id: schedules.length + 1,
        teacher: teacher,
        room: room,
        fromDate: fromDate,
        toDate: toDate,
        note: note
    };
    
    schedules.push(newSchedule);
    updateScheduleTable();
    updateAttendanceTable();
    closeModal('add-schedule-modal');
    alert('Đã thêm lịch học thành công!');
}

// Update schedule table
function updateScheduleTable() {
    const tableBody = document.getElementById('schedule-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    schedules.forEach((schedule, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${schedule.teacher}</td>
            <td>${schedule.room}</td>
            <td>${formatDateTime(schedule.fromDate)}</td>
            <td>${formatDateTime(schedule.toDate)}</td>
            <td>${schedule.note || ''}</td>
            <td class="action-cell">
                <button class="btn-icon btn-edit" title="Sửa" onclick="editSchedule(${schedule.id})">✏️</button>
                <button class="btn-icon btn-delete" title="Xóa" onclick="deleteSchedule(${schedule.id})">🗑️</button>
                <button class="btn-icon btn-active" title="Thêm" onclick="addScheduleItem(${schedule.id})">+</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Edit schedule
function editSchedule(id) {
    const schedule = schedules.find(s => s.id === id);
    if (!schedule) return;
    
    document.getElementById('schedule-teacher').value = schedule.teacher;
    document.getElementById('schedule-room').value = schedule.room;
    document.getElementById('schedule-from-date').value = schedule.fromDate;
    document.getElementById('schedule-to-date').value = schedule.toDate;
    document.getElementById('schedule-note').value = schedule.note;
    
    // Store editing ID
    document.getElementById('schedule-form').setAttribute('data-editing-id', id);
    showModal('add-schedule-modal');
}

// Delete schedule
function deleteSchedule(id) {
    if (confirm('Bạn có chắc chắn muốn xóa lịch học này?')) {
        schedules = schedules.filter(s => s.id !== id);
        updateScheduleTable();
        updateAttendanceTable();
        alert('Đã xóa lịch học thành công!');
    }
}

// Add schedule item (duplicate)
function addScheduleItem(id) {
    const schedule = schedules.find(s => s.id === id);
    if (!schedule) return;
    
    const newSchedule = {
        id: schedules.length + 1,
        teacher: schedule.teacher,
        room: schedule.room,
        fromDate: schedule.fromDate,
        toDate: schedule.toDate,
        note: schedule.note
    };
    
    schedules.push(newSchedule);
    updateScheduleTable();
    updateAttendanceTable();
    alert('Đã thêm lịch học mới!');
}

// Attendance Functions
// Handle semester change for attendance
function onAttendanceSemesterChange() {
    const semesterFilter = document.getElementById('attendance-semester-filter');
    const classFilter = document.getElementById('attendance-class-filter');
    
    // Disable class if no semester selected
    if (classFilter) {
        classFilter.disabled = !semesterFilter || !semesterFilter.value;
        if (!semesterFilter || !semesterFilter.value) {
            classFilter.value = '';
        }
    }
    
    checkAndLoadAttendanceTable();
}

// Handle class change for attendance
function onAttendanceClassChange() {
    checkAndLoadAttendanceTable();
}

// Check if all filters are selected and load table
function checkAndLoadAttendanceTable() {
    const semesterFilter = document.getElementById('attendance-semester-filter');
    const classFilter = document.getElementById('attendance-class-filter');
    
    const hasSemester = semesterFilter && semesterFilter.value;
    const hasClass = classFilter && classFilter.value;
    
    if (hasSemester && hasClass) {
        loadAttendanceTable();
    } else {
        // Show appropriate message
        const tableBody = document.getElementById('attendance-table-body');
        const headerRow = document.getElementById('attendance-table-header');
        const colCount = headerRow ? headerRow.querySelectorAll('th').length : 4;
        
        if (!hasSemester) {
            tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Vui lòng chọn kỳ học để hiển thị bảng điểm danh</td></tr>';
        } else if (!hasClass) {
            tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Vui lòng chọn lớp để hiển thị bảng điểm danh</td></tr>';
        }
    }
}

// Load attendance table
function loadAttendanceTable() {
    const classFilter = document.getElementById('attendance-class-filter');
    if (!classFilter || !classFilter.value) return;
    
    const selectedClass = classFilter.value;
    
    // Build table header
    const headerRow = document.getElementById('attendance-table-header');
    if (!headerRow) return;
    const existingHeaders = Array.from(headerRow.querySelectorAll('th'));
    
    // Keep first 3 columns (#, Mã SV, Họ và tên) and last column (Ghi chú)
    // Remove dynamic schedule columns (from index 3 to last-1)
    const fixedColumns = 3; // #, Mã SV, Họ và tên
    const lastColumnIndex = existingHeaders.length - 1; // Ghi chú
    
    // Remove columns from right to left to avoid index shifting issues
    for (let i = lastColumnIndex - 1; i >= fixedColumns; i--) {
        existingHeaders[i].remove();
    }
    
    // Add dynamic columns for schedules
    schedules.forEach((schedule) => {
        const th = document.createElement('th');
        th.textContent = `${schedule.teacher} - ${schedule.room} (${formatDateTime(schedule.fromDate)})`;
        th.setAttribute('data-schedule-id', schedule.id);
        headerRow.insertBefore(th, headerRow.querySelector('th:last-child'));
    });
    
    // Build table body
    const tableBody = document.getElementById('attendance-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    // Mock student data by class
    const studentsByClass = {
        '10A1': [
            { code: '3120410024', lastName: 'Trương Hồ', firstName: 'An' },
            { code: '3121560010', lastName: 'Nguyễn Quốc', firstName: 'Anh' },
            { code: '3120480015', lastName: 'Trần Phạm Ngọc', firstName: 'Ánh' },
            { code: '3120410048', lastName: 'Huỳnh Gia', firstName: 'Bảo' }
        ],
        '10A2': [
            { code: '3120410025', lastName: 'Lê Văn', firstName: 'Cường' },
            { code: '3121560011', lastName: 'Phạm Thị', firstName: 'Dung' },
            { code: '3120480016', lastName: 'Hoàng Văn', firstName: 'Đức' }
        ],
        '11A1': [
            { code: '3120410026', lastName: 'Vũ Thị', firstName: 'Hoa' },
            { code: '3121560012', lastName: 'Đặng Văn', firstName: 'Hùng' }
        ],
        '11A2': [
            { code: '3120410027', lastName: 'Bùi Thị', firstName: 'Lan' },
            { code: '3121560013', lastName: 'Trịnh Văn', firstName: 'Minh' }
        ],
        '12A1': [
            { code: '3120410028', lastName: 'Ngô Thị', firstName: 'Nga' },
            { code: '3121560014', lastName: 'Lý Văn', firstName: 'Phong' }
        ],
        '12A2': [
            { code: '3120410029', lastName: 'Đỗ Thị', firstName: 'Quỳnh' },
            { code: '3121560015', lastName: 'Võ Văn', firstName: 'Sơn' }
        ]
    };
    
    const students = studentsByClass[selectedClass] || [];
    
    if (students.length === 0) {
        const headerRow = document.getElementById('attendance-table-header');
        const colCount = headerRow ? headerRow.querySelectorAll('th').length : 4;
        tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Lớp này chưa có học sinh</td></tr>';
        return;
    }
    
    students.forEach((student, rowIndex) => {
        const tr = document.createElement('tr');
        const fullName = `${student.lastName} ${student.firstName}`;
        
        // Create fixed columns: #, Mã SV, Họ và tên
        const sttTd = document.createElement('td');
        sttTd.textContent = rowIndex + 1;
        tr.appendChild(sttTd);
        
        const codeTd = document.createElement('td');
        codeTd.textContent = student.code;
        tr.appendChild(codeTd);
        
        const nameTd = document.createElement('td');
        nameTd.textContent = fullName;
        tr.appendChild(nameTd);
        
        // Add dynamic schedule columns with checkboxes
        schedules.forEach((schedule) => {
            const attendanceTd = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'attendance-checkbox';
            checkbox.setAttribute('data-schedule-id', schedule.id);
            checkbox.setAttribute('data-student-code', student.code);
            checkbox.style.width = '20px';
            checkbox.style.height = '20px';
            checkbox.style.cursor = 'pointer';
            attendanceTd.style.textAlign = 'center';
            attendanceTd.appendChild(checkbox);
            tr.appendChild(attendanceTd);
        });
        
        // Add notes column
        const notesTd = document.createElement('td');
        const notesInput = document.createElement('input');
        notesInput.type = 'text';
        notesInput.className = 'form-control notes-input';
        notesInput.setAttribute('data-student-code', student.code);
        notesInput.placeholder = 'Ghi chú';
        notesInput.style.width = '100%';
        notesTd.appendChild(notesInput);
        tr.appendChild(notesTd);
        
        tableBody.appendChild(tr);
    });
}

// Update attendance table when schedules change
function updateAttendanceTable() {
    const semesterFilter = document.getElementById('attendance-semester-filter');
    const classFilter = document.getElementById('attendance-class-filter');
    if (semesterFilter && semesterFilter.value && classFilter && classFilter.value) {
        loadAttendanceTable();
    }
}

// Save attendance
function saveAttendance() {
    const tableBody = document.getElementById('attendance-table-body');
    if (!tableBody) return;
    const rows = tableBody.querySelectorAll('tr');
    const attendanceData = [];
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 4) return; // Skip empty rows
        
        const studentCode = cells[1].textContent.trim();
        const checkboxes = row.querySelectorAll('.attendance-checkbox');
        const notesInput = row.querySelector('.notes-input');
        
        const attendance = {};
        checkboxes.forEach(checkbox => {
            const scheduleId = checkbox.getAttribute('data-schedule-id');
            attendance[scheduleId] = checkbox.checked;
        });
        
        attendanceData.push({
            code: studentCode,
            attendance: attendance,
            notes: notesInput ? notesInput.value : ''
        });
    });
    
    console.log('Saving attendance:', attendanceData);
    alert('Đã lưu điểm danh thành công!');
}

// Student Fee Config Functions
// Mock payment periods data
const paymentPeriodsData = {
    'semester1': [
        { code: 'PP001', name: 'First Semester Payment', nameMy: 'ပထမနှစ်ဝက် ငွေပေးချေမှု', feeItems: ['FEE001', 'FEE002'] },
        { code: 'PP002', name: 'Mid Semester Payment', nameMy: 'အလယ်နှစ်ဝက် ငွေပေးချေမှု', feeItems: ['FEE001'] }
    ],
    'semester2': [
        { code: 'PP003', name: 'Second Semester Payment', nameMy: 'ဒုတိယနှစ်ဝက် ငွေပေးချေမှု', feeItems: ['FEE001', 'FEE002', 'FEE003'] }
    ],
    'semester3': [
        { code: 'PP004', name: 'Third Semester Payment', nameMy: 'တတိယနှစ်ဝက် ငွေပေးချေမှု', feeItems: ['FEE001'] }
    ]
};

// Mock fee items data
const feeItemsData = {
    'FEE001': { code: 'FEE001', nameEn: 'Tuition Fee', nameMy: 'ကျောင်းလချေး' },
    'FEE002': { code: 'FEE002', nameEn: 'Library Fee', nameMy: 'စာကြည့်တိုက်ခ' },
    'FEE003': { code: 'FEE003', nameEn: 'Lab Fee', nameMy: 'လက်တွေ့ခန်းခ' }
};

// Handle semester change for student fee config
function onStudentFeeSemesterChange() {
    const semesterFilter = document.getElementById('student-fee-semester-filter');
    const periodFilter = document.getElementById('student-fee-period-filter');
    const classFilter = document.getElementById('student-fee-class-filter');
    
    // Disable period and class if no semester selected
    if (periodFilter) {
        periodFilter.disabled = !semesterFilter || !semesterFilter.value;
        periodFilter.innerHTML = '<option value="">-- Chọn đợt thanh toán --</option>';
        if (semesterFilter && semesterFilter.value) {
            const periods = paymentPeriodsData[semesterFilter.value] || [];
            periods.forEach(period => {
                const option = document.createElement('option');
                option.value = period.code;
                option.textContent = period.name;
                periodFilter.appendChild(option);
            });
        }
    }
    if (classFilter) {
        classFilter.disabled = !semesterFilter || !semesterFilter.value;
        if (!semesterFilter || !semesterFilter.value) {
            classFilter.value = '';
        }
    }
    
    checkAndLoadStudentFeeTable();
}

// Handle period change for student fee config
function onStudentFeePeriodChange() {
    const semesterFilter = document.getElementById('student-fee-semester-filter');
    const periodFilter = document.getElementById('student-fee-period-filter');
    const classFilter = document.getElementById('student-fee-class-filter');
    
    // Disable class if no period selected
    if (classFilter) {
        classFilter.disabled = !periodFilter || !periodFilter.value;
        if (!periodFilter || !periodFilter.value) {
            classFilter.value = '';
        }
    }
    
    checkAndLoadStudentFeeTable();
}

// Handle class change for student fee config
function onStudentFeeClassChange() {
    checkAndLoadStudentFeeTable();
}

// Check if all filters are selected and load table
function checkAndLoadStudentFeeTable() {
    const semesterFilter = document.getElementById('student-fee-semester-filter');
    const periodFilter = document.getElementById('student-fee-period-filter');
    const classFilter = document.getElementById('student-fee-class-filter');
    
    const hasSemester = semesterFilter && semesterFilter.value;
    const hasPeriod = periodFilter && periodFilter.value;
    const hasClass = classFilter && classFilter.value;
    
    if (hasSemester && hasPeriod && hasClass) {
        loadStudentFeeConfigTable();
    } else {
        // Show appropriate message
        const tableBody = document.getElementById('student-fee-config-table-body');
        const headerRow = document.getElementById('student-fee-config-table-header');
        const colCount = headerRow ? headerRow.querySelectorAll('th').length : 4;
        
        if (!hasSemester) {
            tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Vui lòng chọn kỳ học để hiển thị bảng cấu hình</td></tr>';
        } else if (!hasPeriod) {
            tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Vui lòng chọn đợt thanh toán để hiển thị bảng cấu hình</td></tr>';
        } else if (!hasClass) {
            tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Vui lòng chọn lớp để hiển thị bảng cấu hình</td></tr>';
        }
    }

    // Update status UI
    renderStudentFeeConfigStatusUI();
}

// Load Student Fee Config Table
function loadStudentFeeConfigTable() {
    const semesterFilter = document.getElementById('student-fee-semester-filter');
    const periodFilter = document.getElementById('student-fee-period-filter');
    const classFilter = document.getElementById('student-fee-class-filter');
    
    if (!semesterFilter || !periodFilter || !classFilter) return;
    
    const selectedSemester = semesterFilter.value;
    const selectedPeriodCode = periodFilter.value;
    const selectedClass = classFilter.value;

    // Ensure config record exists and reflect status
    ensureFeeConfigRecordForKey({ semester: selectedSemester, periodCode: selectedPeriodCode, classCode: selectedClass });
    
    // Get payment period data
    const periods = paymentPeriodsData[selectedSemester] || [];
    const selectedPeriod = periods.find(p => p.code === selectedPeriodCode);
    
    if (!selectedPeriod) {
        const tableBody = document.getElementById('student-fee-config-table-body');
        const headerRow = document.getElementById('student-fee-config-table-header');
        const colCount = headerRow ? headerRow.querySelectorAll('th').length : 4;
        tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Không tìm thấy đợt thanh toán</td></tr>';
        return;
    }
    
    // Get fee items for this period
    const feeItemCodes = selectedPeriod.feeItems || [];
    const feeItems = feeItemCodes.map(code => feeItemsData[code]).filter(item => item);
    
    if (feeItems.length === 0) {
        const tableBody = document.getElementById('student-fee-config-table-body');
        const headerRow = document.getElementById('student-fee-config-table-header');
        const colCount = headerRow ? headerRow.querySelectorAll('th').length : 4;
        tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Đợt thanh toán này chưa có khoản phí nào. Vui lòng cấu hình khoản phí cho đợt thanh toán trước.</td></tr>';
        return;
    }
    
    // Build table header
    const headerRow = document.getElementById('student-fee-config-table-header');
    const existingHeaders = Array.from(headerRow.querySelectorAll('th'));
    
    // Keep first 3 columns (#, Mã SV, Họ và tên) and last column (Ghi chú)
    // Remove dynamic fee item columns (from index 3 to last-1)
    const fixedColumns = 3; // #, Mã SV, Họ và tên
    const lastColumnIndex = existingHeaders.length - 1; // Ghi chú
    
    // Remove columns from right to left to avoid index shifting issues
    for (let i = lastColumnIndex - 1; i >= fixedColumns; i--) {
        existingHeaders[i].remove();
    }
    
    // Add dynamic columns for fee items
    feeItems.forEach((item) => {
        const th = document.createElement('th');
        th.textContent = `${item.nameEn} (${item.nameMy})`;
        th.setAttribute('data-fee-item', item.code);
        headerRow.insertBefore(th, headerRow.querySelector('th:last-child'));
    });
    
    // Build table body
    const tableBody = document.getElementById('student-fee-config-table-body');
    tableBody.innerHTML = '';
    
    // Mock student data by class
    const studentsByClass = {
        '10A1': [
            { code: '3120410024', lastName: 'Trương Hồ', firstName: 'An' },
            { code: '3121560010', lastName: 'Nguyễn Quốc', firstName: 'Anh' },
            { code: '3120480015', lastName: 'Trần Phạm Ngọc', firstName: 'Ánh' },
            { code: '3120410048', lastName: 'Huỳnh Gia', firstName: 'Bảo' }
        ],
        '10A2': [
            { code: '3120410025', lastName: 'Lê Văn', firstName: 'Cường' },
            { code: '3121560011', lastName: 'Phạm Thị', firstName: 'Dung' },
            { code: '3120480016', lastName: 'Hoàng Văn', firstName: 'Đức' }
        ],
        '11A1': [
            { code: '3120410026', lastName: 'Vũ Thị', firstName: 'Hoa' },
            { code: '3121560012', lastName: 'Đặng Văn', firstName: 'Hùng' }
        ],
        '11A2': [
            { code: '3120410027', lastName: 'Bùi Thị', firstName: 'Lan' },
            { code: '3121560013', lastName: 'Trịnh Văn', firstName: 'Minh' }
        ],
        '12A1': [
            { code: '3120410028', lastName: 'Ngô Thị', firstName: 'Nga' },
            { code: '3121560014', lastName: 'Lý Văn', firstName: 'Phong' }
        ],
        '12A2': [
            { code: '3120410029', lastName: 'Đỗ Thị', firstName: 'Quỳnh' },
            { code: '3121560015', lastName: 'Võ Văn', firstName: 'Sơn' }
        ]
    };
    
    const students = studentsByClass[selectedClass] || [];
    
    if (students.length === 0) {
        const headerRow = document.getElementById('student-fee-config-table-header');
        const colCount = headerRow ? headerRow.querySelectorAll('th').length : 4;
        tableBody.innerHTML = '<tr><td colspan="' + colCount + '" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Lớp này chưa có học sinh</td></tr>';
        return;
    }
    
    students.forEach((student, rowIndex) => {
        const tr = document.createElement('tr');
        const fullName = `${student.lastName} ${student.firstName}`;
        
        // Create fixed columns: #, Mã SV, Họ và tên
        const sttTd = document.createElement('td');
        sttTd.textContent = rowIndex + 1;
        tr.appendChild(sttTd);
        
        const codeTd = document.createElement('td');
        codeTd.textContent = student.code;
        tr.appendChild(codeTd);
        
        const nameTd = document.createElement('td');
        nameTd.textContent = fullName;
        tr.appendChild(nameTd);
        
        // Add dynamic fee item columns
        feeItems.forEach((item) => {
            const feeTd = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'form-control fee-input';
            input.setAttribute('data-fee-item', item.code);
            input.setAttribute('data-student-code', student.code);
            input.placeholder = 'Nhập số tiền';
            input.style.width = '100%';
            input.style.minWidth = '120px';
            feeTd.appendChild(input);
            tr.appendChild(feeTd);
        });
        
        // Add notes column
        const notesTd = document.createElement('td');
        const notesInput = document.createElement('input');
        notesInput.type = 'text';
        notesInput.className = 'form-control notes-input';
        notesInput.setAttribute('data-student-code', student.code);
        notesInput.placeholder = 'Ghi chú';
        notesInput.style.width = '100%';
        notesTd.appendChild(notesInput);
        tr.appendChild(notesTd);
        
        tableBody.appendChild(tr);
    });

    renderStudentFeeConfigStatusUI();
}


// Save student fee config
function saveStudentFeeConfig(options = {}) {
    const key = getCurrentStudentFeeConfigKey();
    if (!key) {
        alert('Vui lòng chọn kỳ học, đợt thanh toán và lớp trước.');
        return;
    }

    const cfg = ensureFeeConfigRecordForKey(key);
    if (cfg.status === 'Chờ xác nhận') {
        alert('Cấu hình đang ở trạng thái "Chờ xác nhận". Vui lòng chờ chấp nhận/từ chối.');
        return;
    }
    if (cfg.status === 'Xác nhận') {
        alert('Cấu hình đã được xác nhận. Không thể sửa đổi.');
        return;
    }
    if (cfg.status === 'Từ chối' && !options.fromModal) {
        // Bị từ chối -> yêu cầu xác nhận đã chỉnh sửa trước khi gửi lại
        openResubmitStudentFeeConfigModal();
        return;
    }

    const tableBody = document.getElementById('student-fee-config-table-body');
    const rows = tableBody.querySelectorAll('tr');
    const students = [];
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 4) return; // Skip empty rows
        
        const studentCode = cells[1].textContent.trim();
        const feeInputs = row.querySelectorAll('.fee-input');
        const notesInput = row.querySelector('.notes-input');
        
        const fees = {};
        feeInputs.forEach(input => {
            const feeItem = input.getAttribute('data-fee-item');
            const amount = parseFloat(input.value) || 0;
            fees[feeItem] = amount;
        });
        
        students.push({
            code: studentCode,
            fees: fees,
            notes: notesInput ? notesInput.value : ''
        });
    });
    
    console.log('Saving student fee config:', students);

    // Store values (mock)
    const keyStr = getStudentFeeConfigKeyStr(key);
    studentFeeConfigStorage[keyStr] = {
        updatedAt: new Date().toISOString(),
        students
    };

    // Move status: Đang soạn -> Chờ xác nhận
    // Nếu đang Từ chối và đã xác nhận chỉnh sửa -> Chờ xác nhận, giữ lại lý do từ chối + lưu lời xác nhận
    cfg.status = 'Chờ xác nhận';
    if (options.resubmitNote) {
        cfg.resubmitNote = options.resubmitNote;
    } else {
        cfg.rejectReason = '';
        cfg.resubmitNote = '';
    }

    loadFeeConfigTable();
    renderStudentFeeConfigStatusUI();

    if (options.resubmitNote) {
        alert('Đã ghi nhận chỉnh sửa và gửi lại. Trạng thái chuyển sang "Chờ xác nhận".');
    } else {
        alert('Đã lưu cấu hình. Trạng thái chuyển sang "Chờ xác nhận".');
    }
}

// Load students based on selected class
function loadStudents() {
    const classSelect = document.getElementById('class-select');
    const studentSelect = document.getElementById('student-select');
    
    if (!classSelect || !studentSelect) return;
    
    const selectedClass = classSelect.value;
    studentSelect.innerHTML = '<option value="">-- Chọn học sinh --</option>';
    
    if (selectedClass) {
        // Mock data - in real app, this would be an API call
        const students = {
            '10A1': [
                { id: '1', name: 'Nguyễn Văn A' },
                { id: '2', name: 'Trần Thị B' },
                { id: '3', name: 'Lê Văn C' }
            ],
            '10A2': [
                { id: '4', name: 'Phạm Văn D' },
                { id: '5', name: 'Hoàng Thị E' }
            ],
            '11A1': [
                { id: '6', name: 'Vũ Văn F' },
                { id: '7', name: 'Đặng Thị G' }
            ]
        };
        
        const classStudents = students[selectedClass] || [];
        classStudents.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.name;
            studentSelect.appendChild(option);
        });
    }
}

// Load fee items based on selected payment period
function loadFeeItems() {
    const paymentPeriodSelect = document.getElementById('payment-period-select');
    const feeItemsCheckbox = document.getElementById('fee-items-checkbox');
    const discountItemsCheckbox = document.getElementById('discount-items-checkbox');
    
    if (!paymentPeriodSelect || !feeItemsCheckbox) return;
    
    const selectedPeriod = paymentPeriodSelect.value;
    feeItemsCheckbox.innerHTML = '';
    discountItemsCheckbox.innerHTML = '';
    
    if (selectedPeriod) {
        // Mock data - in real app, this would be an API call
        const feeItems = [
            { id: '1', name: 'Tuition Fee - 500,000 MMK' },
            { id: '2', name: 'Library Fee - 50,000 MMK' },
            { id: '3', name: 'Lab Fee - 100,000 MMK' },
            { id: '4', name: 'Sports Fee - 75,000 MMK' }
        ];
        
        feeItems.forEach(item => {
            // Add to payment items
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';
            checkboxItem.innerHTML = `
                <input type="checkbox" id="fee-${item.id}" name="fee-items" value="${item.id}">
                <label for="fee-${item.id}">${item.name}</label>
            `;
            feeItemsCheckbox.appendChild(checkboxItem);
            
            // Add to discount items (same items can be selected for discount)
            const discountCheckboxItem = document.createElement('div');
            discountCheckboxItem.className = 'checkbox-item';
            discountCheckboxItem.innerHTML = `
                <input type="checkbox" id="discount-${item.id}" name="discount-items" value="${item.id}">
                <label for="discount-${item.id}">${item.name}</label>
            `;
            discountItemsCheckbox.appendChild(discountCheckboxItem);
        });
    }
}

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    // FeeItem form
    const feeItemForm = document.getElementById('feeitem-form');
    if (feeItemForm) {
        feeItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Đã lưu thông tin FeeItem thành công!');
            closeModal('add-feeitem-modal');
            feeItemForm.reset();
        });
    }
    
    // Schedule form
    const scheduleForm = document.getElementById('schedule-form');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const editingId = scheduleForm.getAttribute('data-editing-id');
            if (editingId) {
                // Update existing schedule
                const schedule = schedules.find(s => s.id === parseInt(editingId));
                if (schedule) {
                    schedule.teacher = document.getElementById('schedule-teacher').value;
                    schedule.room = document.getElementById('schedule-room').value;
                    schedule.fromDate = document.getElementById('schedule-from-date').value;
                    schedule.toDate = document.getElementById('schedule-to-date').value;
                    schedule.note = document.getElementById('schedule-note').value;
                    updateScheduleTable();
                    updateAttendanceTable();
                    alert('Đã cập nhật lịch học thành công!');
                }
                scheduleForm.removeAttribute('data-editing-id');
            } else {
                // Add new schedule
                addSchedule();
            }
            closeModal('add-schedule-modal');
            scheduleForm.reset();
        });
    }
    
    // Initialize schedule table (only if schedule module exists)
    const scheduleTableBody = document.getElementById('schedule-table-body');
    if (scheduleTableBody) {
        updateScheduleTable();
    }

    // Payment Period form
    const paymentPeriodForm = document.getElementById('payment-period-form');
    if (paymentPeriodForm) {
        paymentPeriodForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Đã lưu thông tin Đợt thanh toán thành công!');
            closeModal('add-payment-period-modal');
            paymentPeriodForm.reset();
        });
    }

    // Payment Config form
    const paymentConfigForm = document.getElementById('payment-config-form');
    if (paymentConfigForm) {
        paymentConfigForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Đã lưu thông tin Cấu hình thành công!');
            closeModal('add-payment-config-modal');
            paymentConfigForm.reset();
        });
    }

    // Student Fee Config form
    const studentFeeConfigForm = document.getElementById('student-fee-config-form');
    if (studentFeeConfigForm) {
        studentFeeConfigForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Đã lưu thông tin Cấu hình khoản phí cho học sinh thành công!');
            closeModal('add-student-fee-config-modal');
            studentFeeConfigForm.reset();
            // Reset dynamic selects
            document.getElementById('student-select').innerHTML = '<option value="">-- Chọn học sinh --</option>';
            document.getElementById('fee-items-checkbox').innerHTML = '';
            document.getElementById('discount-items-checkbox').innerHTML = '';
        });
    }

    // Fee Config form
    const feeConfigForm = document.getElementById('fee-config-form');
    if (feeConfigForm) {
        feeConfigForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveFeeConfig();
        });
    }

    // Grade Point form
    const gradePointForm = document.getElementById('grade-point-form');
    if (gradePointForm) {
        gradePointForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(gradePointForm);
            const inputs = gradePointForm.querySelectorAll('input, select, textarea');
            const code = inputs[0].value;
            const subject = inputs[1].options[inputs[1].selectedIndex].text;
            const name = inputs[2].value;
            const weight = inputs[3].value + '%';
            const maxScore = inputs[4].value;
            const notes = inputs[5].value;
            
            // Add new row to grade-point-table-body
            const tableBody = document.getElementById('grade-point-table-body');
            const rowCount = tableBody.querySelectorAll('tr').length + 1;
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${rowCount}</td>
                <td>${code}</td>
                <td>${subject}</td>
                <td>${name}</td>
                <td>${weight}</td>
                <td>${maxScore}</td>
                <td>${notes}</td>
                <td class="action-cell">
                    <button class="btn-icon btn-edit" title="Sửa">✏️</button>
                    <button class="btn-icon btn-delete" title="Xóa">🗑️</button>
                    <button class="btn-icon btn-active" title="Active">✓</button>
                </td>
            `;
            tableBody.appendChild(newRow);
            
            alert('Đã lưu thông tin Đầu điểm thành công!');
            closeModal('add-grade-point-modal');
            gradePointForm.reset();
            
            // Reload grade input table if on that tab
            const gradeInputTab = document.getElementById('grade-input-tab');
            if (gradeInputTab.classList.contains('active')) {
                loadGradeInputTable();
            }
        });
    }
});

// =========================
// Fee Config Module (Cấu hình phí)
// =========================

let feeConfigData = [
    { id: 1, semester: 'semester1', periodCode: 'PP001', classCode: '10A1', status: 'Đang soạn' },
    { id: 2, semester: 'semester1', periodCode: 'PP002', classCode: '10A2', status: 'Chờ xác nhận' },
    { id: 3, semester: 'semester2', periodCode: 'PP003', classCode: '11A1', status: 'Xác nhận' },
    { id: 4, semester: 'semester3', periodCode: 'PP004', classCode: '12A2', status: 'Từ chối' }
];
let feeConfigNextId = 5;

function getSemesterLabel(semesterKey) {
    const map = {
        semester1: 'Học kỳ 1',
        semester2: 'Học kỳ 2',
        semester3: 'Học kỳ 3'
    };
    return map[semesterKey] || semesterKey || '-';
}

function findPaymentPeriod(semesterKey, periodCode) {
    const periods = (typeof paymentPeriodsData !== 'undefined' && paymentPeriodsData[semesterKey]) ? paymentPeriodsData[semesterKey] : [];
    return periods.find(p => p.code === periodCode) || null;
}

function getFeeConfigStatusBadge(status) {
    const s = status || 'Đang soạn';
    let badgeClass = 'badge-primary';
    if (s === 'Chờ xác nhận') badgeClass = 'badge-warning';
    if (s === 'Xác nhận') badgeClass = 'badge-success';
    if (s === 'Từ chối') badgeClass = 'badge-danger';
    return `<span class="badge ${badgeClass}">${s}</span>`;
}

function loadFeeConfigTable() {
    const tableBody = document.getElementById('fee-config-table-body');
    if (!tableBody) return;

    const statusFilterEl = document.getElementById('fee-config-status-filter');
    const selectedStatus = statusFilterEl ? statusFilterEl.value : '';
    const filtered = selectedStatus ? feeConfigData.filter(x => (x.status || 'Đang soạn') === selectedStatus) : feeConfigData;

    if (!filtered || filtered.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">
                    ${selectedStatus ? 'Không có cấu hình phí phù hợp với trạng thái đã chọn.' : 'Chưa có cấu hình phí. Nhấn “Tạo cấu hình mới” để thêm.'}
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = '';
    filtered.forEach((cfg, idx) => {
        const tr = document.createElement('tr');
        const period = findPaymentPeriod(cfg.semester, cfg.periodCode);
        const periodName = period ? period.name : (cfg.periodCode || '-');

        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${cfg.classCode || '-'}</td>
            <td>${periodName}</td>
            <td>${getSemesterLabel(cfg.semester)}</td>
            <td>${getFeeConfigStatusBadge(cfg.status)}</td>
            <td class="action-cell">
                <button class="btn-icon" title="Xem chi tiết" onclick="showFeeConfigDetail(${cfg.id})">👁️</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function filterFeeConfigList() {
    loadFeeConfigTable();
}

function showAddFeeConfigForm() {
    const title = document.getElementById('fee-config-modal-title');
    if (title) title.textContent = 'Tạo cấu hình mới';

    const idEl = document.getElementById('fee-config-id');
    const semesterEl = document.getElementById('fee-config-semester');
    const periodEl = document.getElementById('fee-config-period');
    const classEl = document.getElementById('fee-config-class');
    const statusGroup = document.getElementById('fee-config-status-group');
    const statusEl = document.getElementById('fee-config-status');

    if (idEl) idEl.value = '';
    if (semesterEl) semesterEl.value = '';
    if (classEl) classEl.value = '';
    if (statusEl) statusEl.value = 'Đang soạn';
    if (statusGroup) statusGroup.style.display = 'none';

    if (periodEl) {
        periodEl.innerHTML = '<option value="">-- Chọn đợt thanh toán --</option>';
        periodEl.disabled = true;
        periodEl.value = '';
    }

    showModal('add-fee-config-modal');
}

function onFeeConfigSemesterChange() {
    const semesterEl = document.getElementById('fee-config-semester');
    const periodEl = document.getElementById('fee-config-period');
    if (!semesterEl || !periodEl) return;

    const semesterKey = semesterEl.value;
    periodEl.innerHTML = '<option value="">-- Chọn đợt thanh toán --</option>';
    periodEl.disabled = !semesterKey;

    if (!semesterKey) return;

    const periods = (typeof paymentPeriodsData !== 'undefined' && paymentPeriodsData[semesterKey]) ? paymentPeriodsData[semesterKey] : [];
    periods.forEach(period => {
        const option = document.createElement('option');
        option.value = period.code;
        option.textContent = period.name;
        periodEl.appendChild(option);
    });
}

function saveFeeConfig() {
    const idEl = document.getElementById('fee-config-id');
    const semesterEl = document.getElementById('fee-config-semester');
    const periodEl = document.getElementById('fee-config-period');
    const classEl = document.getElementById('fee-config-class');
    const statusEl = document.getElementById('fee-config-status');
    const statusGroup = document.getElementById('fee-config-status-group');

    const id = idEl && idEl.value ? parseInt(idEl.value, 10) : null;
    const semester = semesterEl ? semesterEl.value : '';
    const periodCode = periodEl ? periodEl.value : '';
    const classCode = classEl ? classEl.value : '';

    if (!semester || !periodCode || !classCode) {
        alert('Vui lòng chọn đủ: Kỳ học, Đợt thanh toán, Lớp.');
        return;
    }

    // Prevent duplicates
    const existed = feeConfigData.find(x =>
        x.semester === semester &&
        x.periodCode === periodCode &&
        x.classCode === classCode &&
        (id === null || x.id !== id)
    );
    if (existed) {
        alert('Cấu hình này đã tồn tại (trùng Kỳ học + Đợt thanh toán + Lớp).');
        return;
    }

    if (id !== null) {
        const cfg = feeConfigData.find(x => x.id === id);
        if (!cfg) {
            alert('Không tìm thấy cấu hình để cập nhật.');
            return;
        }
        cfg.semester = semester;
        cfg.periodCode = periodCode;
        cfg.classCode = classCode;
        // Chỉ cho đổi trạng thái khi đang ở chế độ sửa (statusGroup hiển thị)
        if (statusGroup && statusGroup.style.display !== 'none' && statusEl) {
            cfg.status = statusEl.value || cfg.status || 'Đang soạn';
        }
        alert('Đã cập nhật cấu hình phí thành công!');
    } else {
        feeConfigData.unshift({
            id: feeConfigNextId++,
            semester,
            periodCode,
            classCode,
            status: 'Đang soạn'
        });
        alert('Đã tạo cấu hình phí mới thành công!');
    }

    closeModal('add-fee-config-modal');
    const form = document.getElementById('fee-config-form');
    if (form) form.reset();
    loadFeeConfigTable();
}

function editFeeConfig(id) {
    const cfg = feeConfigData.find(x => x.id === id);
    if (!cfg) return;

    const title = document.getElementById('fee-config-modal-title');
    if (title) title.textContent = 'Sửa cấu hình phí';

    const idEl = document.getElementById('fee-config-id');
    const semesterEl = document.getElementById('fee-config-semester');
    const periodEl = document.getElementById('fee-config-period');
    const classEl = document.getElementById('fee-config-class');
    const statusGroup = document.getElementById('fee-config-status-group');
    const statusEl = document.getElementById('fee-config-status');

    if (idEl) idEl.value = String(cfg.id);
    if (semesterEl) semesterEl.value = cfg.semester || '';

    // Populate periods based on semester then select
    onFeeConfigSemesterChange();
    if (periodEl) {
        periodEl.disabled = false;
        periodEl.value = cfg.periodCode || '';
    }
    if (classEl) classEl.value = cfg.classCode || '';

    if (statusGroup) statusGroup.style.display = 'block';
    if (statusEl) statusEl.value = cfg.status || 'Đang soạn';

    showModal('add-fee-config-modal');
}

function deleteFeeConfig(id) {
    const cfg = feeConfigData.find(x => x.id === id);
    if (!cfg) return;
    if (!confirm('Bạn có chắc chắn muốn xóa cấu hình này?')) return;

    feeConfigData = feeConfigData.filter(x => x.id !== id);
    loadFeeConfigTable();
    alert('Đã xóa cấu hình phí thành công!');
}

function showFeeConfigDetail(id) {
    const cfg = feeConfigData.find(x => x.id === id);
    if (!cfg) return;
    // Xem chi tiết = chuyển qua bảng cấu hình khoản phí cho học sinh
    openStudentFeeConfigWithFilters(cfg.semester, cfg.periodCode, cfg.classCode);
}

function openStudentFeeConfigWithFilters(semesterKey, periodCode, classCode) {
    const navItem = document.querySelector('.nav-item[data-module="student-fee-config"]');
    if (navItem) navItem.click();

    setTimeout(() => {
        const semesterFilter = document.getElementById('student-fee-semester-filter');
        const periodFilter = document.getElementById('student-fee-period-filter');
        const classFilter = document.getElementById('student-fee-class-filter');

        if (semesterFilter) {
            semesterFilter.value = semesterKey || '';
            onStudentFeeSemesterChange();
        }

        setTimeout(() => {
            if (periodFilter) {
                periodFilter.value = periodCode || '';
                onStudentFeePeriodChange();
            }

            setTimeout(() => {
                if (classFilter) {
                    classFilter.value = classCode || '';
                    onStudentFeeClassChange();
                }
            }, 60);
        }, 80);
    }, 160);
}

// Action button handlers (View, Edit, Delete, Active)
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-view')) {
        const row = e.target.closest('tr');
        if (row) {
            const module = getCurrentModule();
            showDetailModal(module, row);
        }
    } else if (e.target.closest('.btn-edit')) {
        alert('Chức năng chỉnh sửa');
    } else if (e.target.closest('.btn-delete')) {
        if (confirm('Bạn có chắc chắn muốn xóa mục này?')) {
            alert('Đã xóa thành công');
        }
    } else if (e.target.closest('.btn-active')) {
        alert('Đã kích hoạt thành công');
    }
});

// Get current active module
function getCurrentModule() {
    const activeModule = document.querySelector('.module-content.active');
    if (activeModule) {
        const moduleId = activeModule.id;
        if (moduleId.includes('feeitem')) return 'feeitem';
        if (moduleId.includes('payment-period')) return 'payment-period';
        if (moduleId.includes('payment-config')) return 'payment-config';
        if (moduleId.includes('student-fee-config')) return 'student-fee-config';
        if (moduleId.includes('debt-management')) return 'debt-management';
        if (moduleId.includes('invoice-management')) return 'invoice-management';
        if (moduleId.includes('grade-input')) return 'grade-input';
        if (moduleId.includes('grade-module') && !moduleId.includes('grade-input')) return 'grade';
    }
    return null;
}

// Show detail modal based on module and row data
function showDetailModal(module, row) {
    const cells = row.querySelectorAll('td');
    
    switch(module) {
        case 'feeitem':
            showFeeItemDetail(cells);
            break;
        case 'payment-period':
            showPaymentPeriodDetail(cells);
            break;
        case 'payment-config':
            showPaymentConfigDetail(cells);
            break;
        case 'student-fee-config':
            showStudentFeeConfigDetail(cells);
            break;
        case 'debt-management':
            showDebtDetail(cells);
            break;
        case 'invoice-management':
            showInvoiceDetail(cells);
            break;
    }
}

// FeeItem Detail
function showFeeItemDetail(cells) {
    document.getElementById('feeitem-detail-code').textContent = cells[1].textContent;
    document.getElementById('feeitem-detail-name-en').textContent = cells[2].textContent;
    document.getElementById('feeitem-detail-name-my').textContent = cells[3].textContent;
    document.getElementById('feeitem-detail-description').textContent = cells[4].textContent || 'Không có mô tả';
    showModal('feeitem-detail-modal');
}

// Payment Period Detail
function showPaymentPeriodDetail(cells) {
    const periodCode = cells[1].textContent.trim();
    
    document.getElementById('payment-period-detail-code').textContent = periodCode;
    document.getElementById('payment-period-detail-semester').textContent = cells[2].textContent;
    document.getElementById('payment-period-detail-name-en').textContent = cells[3].textContent;
    document.getElementById('payment-period-detail-name-my').textContent = cells[4].textContent;
    document.getElementById('payment-period-detail-start-date').textContent = cells[5].textContent;
    document.getElementById('payment-period-detail-end-date').textContent = cells[6].textContent;
    
    // Load and display fee items for this payment period
    loadPaymentPeriodFeeItems(periodCode);
    
    showModal('payment-period-detail-modal');
}

// Load fee items for payment period
function loadPaymentPeriodFeeItems(periodCode) {
    // Mock data - in real app, this would be an API call filtered by periodCode
    const paymentConfigs = {
        'PP001': [
            { feeItemName: 'Tuition Fee', feeItemCode: 'FEE001', note: 'Phí học phí hàng kỳ' },
            { feeItemName: 'Library Fee', feeItemCode: 'FEE002', note: 'Phí thư viện' },
            { feeItemName: 'Lab Fee', feeItemCode: 'FEE003', note: 'Phí phòng lab' }
        ],
        'PP002': [
            { feeItemName: 'Tuition Fee', feeItemCode: 'FEE001', note: 'Phí học phí hàng kỳ' },
            { feeItemName: 'Library Fee', feeItemCode: 'FEE002', note: 'Phí thư viện' }
        ],
        'PP003': [
            { feeItemName: 'Tuition Fee', feeItemCode: 'FEE001', note: 'Phí học phí hàng kỳ' }
        ]
    };
    
    const feeItems = paymentConfigs[periodCode] || [];
    const feeItemsTableBody = document.getElementById('payment-period-detail-fee-items');
    const feeItemsEmpty = document.getElementById('payment-period-detail-fee-items-empty');
    
    if (feeItemsTableBody && feeItemsEmpty) {
        if (feeItems.length === 0) {
            feeItemsTableBody.innerHTML = '';
            feeItemsEmpty.style.display = 'block';
        } else {
            feeItemsEmpty.style.display = 'none';
            feeItemsTableBody.innerHTML = '';
            
            feeItems.forEach((item, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.feeItemName}</td>
                    <td>${item.feeItemCode}</td>
                    <td>${item.note || '-'}</td>
                `;
                feeItemsTableBody.appendChild(tr);
            });
        }
    }
}

// Payment Config Detail
function showPaymentConfigDetail(cells) {
    document.getElementById('payment-config-detail-id').textContent = 'PC' + cells[0].textContent.padStart(3, '0');
    document.getElementById('payment-config-detail-period').textContent = cells[1].textContent;
    document.getElementById('payment-config-detail-period-code').textContent = 'PP' + cells[0].textContent.padStart(3, '0');
    document.getElementById('payment-config-detail-feeitem').textContent = cells[2].textContent;
    document.getElementById('payment-config-detail-feeitem-code').textContent = 'FEE' + cells[0].textContent.padStart(3, '0');
    document.getElementById('payment-config-detail-note').textContent = cells[3].textContent || 'Không có ghi chú';
    showModal('payment-config-detail-modal');
}

// Student Fee Config Detail
function showStudentFeeConfigDetail(cells) {
    document.getElementById('student-fee-config-detail-student-code').textContent = cells[1].textContent;
    document.getElementById('student-fee-config-detail-student-name').textContent = cells[2].textContent;
    document.getElementById('student-fee-config-detail-class').textContent = cells[3].textContent;
    document.getElementById('student-fee-config-detail-period').textContent = cells[4].textContent;
    document.getElementById('student-fee-config-detail-period-code').textContent = 'PP001';
    document.getElementById('student-fee-config-detail-note-en').textContent = cells[5].textContent || 'Không có ghi chú';
    document.getElementById('student-fee-config-detail-note-my').textContent = 'ပထမနှစ်ဝက်အတွက် ငွေပေးချေမှု';
    document.getElementById('student-fee-config-detail-total').textContent = cells[6].textContent;
    document.getElementById('student-fee-config-detail-total-discount').textContent = '100,000 MMK';
    document.getElementById('student-fee-config-detail-final-amount').textContent = '1,400,000 MMK';
    showModal('student-fee-config-detail-modal');
}

// Debt Detail
function showDebtDetail(cells) {
    // Get debt ID from row
    currentDebtId = parseInt(cells[0].textContent.trim()) || null;
    
    document.getElementById('debt-detail-student-code').textContent = cells[1].textContent;
    document.getElementById('debt-detail-student-name').textContent = cells[2].textContent;
    document.getElementById('debt-detail-class').textContent = '10A1'; // Mock data
    document.getElementById('debt-detail-period').textContent = cells[3].textContent;
    document.getElementById('debt-detail-period-code').textContent = 'PP001';
    document.getElementById('debt-detail-start-date').textContent = '01/01/2024';
    document.getElementById('debt-detail-end-date').textContent = '31/03/2024';
    document.getElementById('debt-detail-total-amount').textContent = cells[4].textContent;
    
    // Note: cells[5] is now "Số tiền nợ", cells[6] is "Trạng thái", cells[7] is "Hành động"
    const debtText = cells[5].textContent;
    const debtAmount = parseInt(debtText.replace(/[^\d]/g, '')) || 0;
    const totalAmount = parseInt(cells[4].textContent.replace(/[^\d]/g, '')) || 0;
    const paidAmount = totalAmount - debtAmount;
    
    document.getElementById('debt-detail-paid-amount').textContent = paidAmount.toLocaleString('vi-VN') + ' MMK';
    document.getElementById('debt-detail-debt-amount').textContent = debtText;
    
    // Get status from table (cells[6] is the status column)
    const statusText = cells[6].textContent.trim();
    const statusElement = document.getElementById('debt-detail-expiry-status');
    if (statusText.includes('hết hạn') || statusText.includes('Đã hết')) {
        statusElement.innerHTML = '<span class="badge badge-danger">Đã hết hạn</span>';
    } else if (statusText.includes('thanh toán đủ')) {
        statusElement.innerHTML = '<span class="badge badge-success">Đã thanh toán đủ</span>';
    } else {
        statusElement.innerHTML = '<span class="badge badge-success">Chưa hết hạn</span>';
    }
    
    // Display payment history
    const paymentHistoryBody = document.getElementById('debt-payment-history');
    const paymentHistoryEmpty = document.getElementById('debt-payment-history-empty');
    
    if (paymentHistoryBody && paymentHistoryEmpty) {
        const history = paymentHistory[currentDebtId] || [];
        
        if (history.length === 0) {
            paymentHistoryBody.innerHTML = '';
            paymentHistoryEmpty.style.display = 'block';
        } else {
            paymentHistoryEmpty.style.display = 'none';
            paymentHistoryBody.innerHTML = '';
            
            history.forEach((payment, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${payment.date}</td>
                    <td>${payment.amount.toLocaleString('vi-VN')} MMK</td>
                    <td>${payment.method}</td>
                    <td>${payment.payerName || '-'}</td>
                    <td>${payment.payerPhone || '-'}</td>
                    <td>${payment.recorder || '-'}</td>
                    <td>${payment.note || '-'}</td>
                `;
                paymentHistoryBody.appendChild(tr);
            });
        }
    }
    
    showModal('debt-detail-modal');
}

// Show debt detail from row button
function showDebtDetailFromRow(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');
    showDebtDetail(cells);
}

// Update Debt Functions
let currentUpdateDebtId = null;

// Show update debt modal
function showUpdateDebtModal(id) {
    currentUpdateDebtId = id;
    
    // Mock data - in real app, this would be an API call
    const debtData = {
        1: {
            studentCode: 'STU001',
            studentName: 'Nguyễn Văn A',
            period: 'First Semester Payment',
            feeItems: [
                { id: 1, name: 'Tuition Fee', amount: 500000, paid: false },
                { id: 2, name: 'Library Fee', amount: 50000, paid: true },
                { id: 3, name: 'Lab Fee', amount: 100000, paid: false }
            ]
        },
        2: {
            studentCode: 'STU002',
            studentName: 'Trần Thị B',
            period: 'First Semester Payment',
            feeItems: [
                { id: 1, name: 'Tuition Fee', amount: 500000, paid: true },
                { id: 2, name: 'Library Fee', amount: 50000, paid: true },
                { id: 3, name: 'Lab Fee', amount: 100000, paid: false }
            ]
        },
        3: {
            studentCode: 'STU003',
            studentName: 'Lê Văn C',
            period: 'Second Semester Payment',
            feeItems: [
                { id: 1, name: 'Tuition Fee', amount: 400000, paid: true },
                { id: 2, name: 'Library Fee', amount: 50000, paid: false }
            ]
        }
    };
    
    const data = debtData[id] || debtData[1];
    
    // Set student information
    document.getElementById('update-debt-student-code').textContent = data.studentCode;
    document.getElementById('update-debt-student-name').textContent = data.studentName;
    document.getElementById('update-debt-period').textContent = data.period;
    
    // Build fee items table
    const feeItemsTableBody = document.getElementById('update-debt-fee-items');
    if (feeItemsTableBody) {
        feeItemsTableBody.innerHTML = '';
        
        data.feeItems.forEach((item, index) => {
            const tr = document.createElement('tr');
            const paidStatus = item.paid ? '<span class="badge badge-success">Đã đóng</span>' : '<span class="badge badge-danger">Chưa đóng</span>';
            tr.innerHTML = `
                <td style="text-align: center;">
                    <input type="checkbox" class="fee-checkbox" data-fee-id="${item.id}" data-amount="${item.amount}" ${item.paid ? 'checked' : ''} onchange="updateTotalSelected()">
                </td>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.amount.toLocaleString('vi-VN')} MMK</td>
                <td>${paidStatus}</td>
            `;
            feeItemsTableBody.appendChild(tr);
        });
    }
    
    // Update total selected
    updateTotalSelected();
    
    // Reset select all checkbox
    const selectAllCheckbox = document.getElementById('select-all-fees');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
    }
    
    showModal('update-debt-modal');
}

// Toggle all fees
function toggleAllFees(checkbox) {
    const feeCheckboxes = document.querySelectorAll('.fee-checkbox');
    feeCheckboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });
    updateTotalSelected();
}

// Update total selected amount
function updateTotalSelected() {
    const selectedCheckboxes = document.querySelectorAll('.fee-checkbox:checked');
    let total = 0;
    
    selectedCheckboxes.forEach(checkbox => {
        const amount = parseInt(checkbox.getAttribute('data-amount')) || 0;
        total += amount;
        
        // Update status in table row
        const row = checkbox.closest('tr');
        if (row) {
            const statusCell = row.querySelector('td:last-child');
            if (statusCell) {
                statusCell.innerHTML = '<span class="badge badge-success">Đã đóng</span>';
            }
        }
    });
    
    // Update unchecked items status
    const uncheckedCheckboxes = document.querySelectorAll('.fee-checkbox:not(:checked)');
    uncheckedCheckboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        if (row) {
            const statusCell = row.querySelector('td:last-child');
            if (statusCell) {
                statusCell.innerHTML = '<span class="badge badge-danger">Chưa đóng</span>';
            }
        }
    });
    
    const totalElement = document.getElementById('update-debt-total-selected');
    if (totalElement) {
        totalElement.textContent = total.toLocaleString('vi-VN') + ' MMK';
    }
    
    // Update select all checkbox state
    const allCheckboxes = document.querySelectorAll('.fee-checkbox');
    const selectAllCheckbox = document.getElementById('select-all-fees');
    if (selectAllCheckbox && allCheckboxes.length > 0) {
        const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
        const someChecked = Array.from(allCheckboxes).some(cb => cb.checked);
        selectAllCheckbox.checked = allChecked;
        selectAllCheckbox.indeterminate = someChecked && !allChecked;
    }
}

// Save debt update
function saveDebtUpdate() {
    if (!currentUpdateDebtId) {
        alert('Không tìm thấy thông tin khoản nợ');
        return;
    }
    
    const selectedCheckboxes = document.querySelectorAll('.fee-checkbox:checked');
    if (selectedCheckboxes.length === 0) {
        alert('Vui lòng chọn ít nhất một khoản phí đã đóng');
        return;
    }
    
    const selectedFeeIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-fee-id'));
    const totalSelected = Array.from(selectedCheckboxes).reduce((sum, cb) => {
        return sum + (parseInt(cb.getAttribute('data-amount')) || 0);
    }, 0);
    
    if (confirm(`Bạn có chắc chắn muốn cập nhật ${selectedCheckboxes.length} khoản phí đã đóng? Tổng số tiền: ${totalSelected.toLocaleString('vi-VN')} MMK`)) {
        // Update the debt table
        const rows = document.querySelectorAll('#debt-table-body tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells[0].textContent.trim() === currentUpdateDebtId.toString()) {
                // Get current debt amount
                const debtText = cells[5].textContent;
                const currentDebt = parseInt(debtText.replace(/[^\d]/g, '')) || 0;
                const totalAmount = parseInt(cells[4].textContent.replace(/[^\d]/g, '')) || 0;
                
                // Calculate new debt (this is simplified - in real app, you'd need to calculate based on selected fees)
                // For now, we'll just reduce the debt by the total selected amount
                const newDebt = Math.max(0, currentDebt - totalSelected);
                const newPaid = totalAmount - newDebt;
                
                // Update debt amount
                if (newDebt === 0) {
                    cells[5].innerHTML = '<span class="badge badge-success">0 MMK</span>';
                } else {
                    cells[5].innerHTML = '<span class="badge badge-danger">' + newDebt.toLocaleString('vi-VN') + ' MMK</span>';
                }
                
                // Update status if debt is fully paid
                if (newDebt === 0) {
                    cells[6].innerHTML = '<span class="badge badge-success">Đã thanh toán đủ</span>';
                }
            }
        });
        
        alert('Đã cập nhật khoản phí thành công!');
        closeModal('update-debt-modal');
    }
}

// Payment History Storage
let paymentHistory = {
    1: [
        { id: 1, date: '10/01/2024', amount: 300000, method: 'Tiền mặt', payerName: 'Nguyễn Văn B', payerPhone: '0901234567', recorder: 'Admin', note: 'Thanh toán một phần' }
    ],
    2: [],
    3: []
};

// Invoice Storage
let invoices = [
    { id: 1, code: 'INV001', studentCode: 'STU001', studentName: 'Nguyễn Văn A', period: 'First Semester Payment', requiredAmount: 1500000, paidAmount: 1000000, status: 'pending' },
    { id: 2, code: 'INV002', studentCode: 'STU002', studentName: 'Trần Thị B', period: 'First Semester Payment', requiredAmount: 1500000, paidAmount: 1500000, status: 'approved' }
];
let nextInvoiceId = 3;
let nextInvoiceCode = 3;
let currentInvoiceId = null;

// Record Payment Functions
let currentRecordPaymentId = null;

// Show record payment modal
function showRecordPaymentModal(id) {
    currentRecordPaymentId = id;
    
    // Mock data - in real app, this would be an API call
    const debtData = {
        1: {
            studentCode: 'STU001',
            studentName: 'Nguyễn Văn A',
            period: 'First Semester Payment',
            remainingDebt: 500000,
            feeItems: [
                { id: 1, name: 'Tuition Fee', amount: 500000, paid: 300000 },
                { id: 2, name: 'Library Fee', amount: 50000, paid: 50000 },
                { id: 3, name: 'Lab Fee', amount: 100000, paid: 0 }
            ]
        },
        2: {
            studentCode: 'STU002',
            studentName: 'Trần Thị B',
            period: 'First Semester Payment',
            remainingDebt: 300000,
            feeItems: [
                { id: 1, name: 'Tuition Fee', amount: 500000, paid: 500000 },
                { id: 2, name: 'Library Fee', amount: 50000, paid: 50000 },
                { id: 3, name: 'Lab Fee', amount: 100000, paid: 70000 }
            ]
        },
        3: {
            studentCode: 'STU003',
            studentName: 'Lê Văn C',
            period: 'Second Semester Payment',
            remainingDebt: 200000,
            feeItems: [
                { id: 1, name: 'Tuition Fee', amount: 400000, paid: 400000 },
                { id: 2, name: 'Library Fee', amount: 50000, paid: 25000 }
            ]
        }
    };
    
    const data = debtData[id] || debtData[1];
    
    // Set student information
    document.getElementById('record-payment-student-code').textContent = data.studentCode;
    document.getElementById('record-payment-student-name').textContent = data.studentName;
    document.getElementById('record-payment-period').textContent = data.period;
    document.getElementById('record-payment-remaining-debt').textContent = data.remainingDebt.toLocaleString('vi-VN') + ' MMK';
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('record-payment-date').value = today;
    
    // Set recorder (get from user profile)
    const recorderName = document.querySelector('.user-name') ? document.querySelector('.user-name').textContent.trim() : 'Admin';
    document.getElementById('record-payment-recorder').value = recorderName;
    
    // Build fee items table (only show unpaid or partially paid fees)
    const feeItemsTableBody = document.getElementById('record-payment-fee-items');
    if (feeItemsTableBody) {
        feeItemsTableBody.innerHTML = '';
        
        const unpaidFees = data.feeItems.filter(item => item.paid < item.amount);
        
        unpaidFees.forEach((item, index) => {
            const remaining = item.amount - item.paid;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: center;">
                    <input type="checkbox" class="payment-fee-checkbox" data-fee-id="${item.id}" data-amount="${remaining}" onchange="updatePaymentAmount()">
                </td>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${remaining.toLocaleString('vi-VN')} MMK</td>
                <td><span class="badge badge-warning">Còn thiếu ${remaining.toLocaleString('vi-VN')} MMK</span></td>
            `;
            feeItemsTableBody.appendChild(tr);
        });
        
        if (unpaidFees.length === 0) {
            feeItemsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">Tất cả các khoản phí đã được thanh toán đủ</td></tr>';
        }
    }
    
    // Reset form
    const form = document.getElementById('record-payment-form');
    if (form) {
        form.reset();
        document.getElementById('record-payment-date').value = today;
        // Keep recorder name after reset
        document.getElementById('record-payment-recorder').value = recorderName;
    }
    
    // Reset select all checkbox
    const selectAllCheckbox = document.getElementById('select-all-payment-fees');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
    }
    
    showModal('record-payment-modal');
}

// Show record payment modal from detail
function showRecordPaymentModalFromDetail() {
    if (currentDebtId) {
        closeModal('debt-detail-modal');
        showRecordPaymentModal(currentDebtId);
    }
}

// Toggle all payment fees
function toggleAllPaymentFees(checkbox) {
    const feeCheckboxes = document.querySelectorAll('.payment-fee-checkbox');
    feeCheckboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });
    updatePaymentAmount();
}

// Update payment amount from selected fees
function updatePaymentAmount() {
    const selectedCheckboxes = document.querySelectorAll('.payment-fee-checkbox:checked');
    let total = 0;
    
    selectedCheckboxes.forEach(checkbox => {
        const amount = parseInt(checkbox.getAttribute('data-amount')) || 0;
        total += amount;
    });
    
    const amountInput = document.getElementById('record-payment-amount');
    if (amountInput) {
        amountInput.value = total > 0 ? total : '';
    }
}

// Save record payment
function saveRecordPayment() {
    if (!currentRecordPaymentId) {
        alert('Không tìm thấy thông tin khoản nợ');
        return;
    }
    
    const form = document.getElementById('record-payment-form');
    if (!form || !form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const paymentDate = document.getElementById('record-payment-date').value;
    const paymentAmount = parseInt(document.getElementById('record-payment-amount').value) || 0;
    const paymentMethod = document.getElementById('record-payment-method').value;
    const payerName = document.getElementById('record-payment-payer-name').value.trim();
    const payerPhone = document.getElementById('record-payment-payer-phone').value.trim();
    const recorder = document.getElementById('record-payment-recorder').value.trim();
    const paymentNote = document.getElementById('record-payment-note').value || '';
    
    if (paymentAmount <= 0) {
        alert('Vui lòng nhập số tiền thanh toán hợp lệ');
        return;
    }
    
    if (!payerName) {
        alert('Vui lòng nhập tên người nộp');
        return;
    }
    
    if (!payerPhone) {
        alert('Vui lòng nhập số điện thoại người nộp');
        return;
    }
    
    const methodText = {
        'cash': 'Tiền mặt',
        'transfer': 'Chuyển khoản',
        'card': 'Thẻ'
    };
    
    // Get selected fee items
    const selectedFees = Array.from(document.querySelectorAll('.payment-fee-checkbox:checked')).map(cb => ({
        id: cb.getAttribute('data-fee-id'),
        amount: parseInt(cb.getAttribute('data-amount'))
    }));
    
    if (confirm(`Bạn có chắc chắn muốn ghi nhận thanh toán ${paymentAmount.toLocaleString('vi-VN')} MMK?`)) {
        let createdInvoice = null;

        // Add to payment history
        if (!paymentHistory[currentRecordPaymentId]) {
            paymentHistory[currentRecordPaymentId] = [];
        }
        
        const newPayment = {
            id: Date.now(),
            date: new Date(paymentDate).toLocaleDateString('vi-VN'),
            amount: paymentAmount,
            method: methodText[paymentMethod] || paymentMethod,
            payerName: payerName,
            payerPhone: payerPhone,
            recorder: recorder,
            note: paymentNote,
            fees: selectedFees
        };
        
        paymentHistory[currentRecordPaymentId].push(newPayment);
        
        // Create new invoice
        const debtRow = Array.from(document.querySelectorAll('#debt-table-body tr')).find(row => {
            const cells = row.querySelectorAll('td');
            return cells[0].textContent.trim() === currentRecordPaymentId.toString();
        });
        
        if (debtRow) {
            const cells = debtRow.querySelectorAll('td');
            const studentCode = cells[1].textContent.trim();
            const studentName = cells[2].textContent.trim();
            const period = cells[3].textContent.trim();
            const totalAmount = parseInt(cells[4].textContent.replace(/[^\d]/g, '')) || 0;
            
            // Calculate total paid amount (including this payment)
            const existingPaid = totalAmount - (parseInt(cells[5].textContent.replace(/[^\d]/g, '')) || 0);
            const newPaidAmount = existingPaid + paymentAmount;
            
            // Generate invoice code
            const invoiceCode = 'INV' + String(nextInvoiceCode).padStart(3, '0');
            
            // Create new invoice
            const newInvoice = {
                id: nextInvoiceId++,
                code: invoiceCode,
                studentCode: studentCode,
                studentName: studentName,
                period: period,
                requiredAmount: totalAmount,
                paidAmount: newPaidAmount,
                status: newPaidAmount >= totalAmount ? 'approved' : 'pending',
                paymentDate: newPayment.date,
                payerName: payerName,
                payerPhone: payerPhone,
                recorder: recorder
            };
            
            invoices.push(newInvoice);
            nextInvoiceCode++;
            createdInvoice = newInvoice;
            
            // Update invoice table
            updateInvoiceTable();
        }
        
        // Update debt table
        const rows = document.querySelectorAll('#debt-table-body tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells[0].textContent.trim() === currentRecordPaymentId.toString()) {
                // Get current debt amount
                const debtText = cells[5].textContent;
                const currentDebt = parseInt(debtText.replace(/[^\d]/g, '')) || 0;
                const totalAmount = parseInt(cells[4].textContent.replace(/[^\d]/g, '')) || 0;
                
                // Calculate new debt
                const newDebt = Math.max(0, currentDebt - paymentAmount);
                
                // Update debt amount
                if (newDebt === 0) {
                    cells[5].innerHTML = '<span class="badge badge-success">0 MMK</span>';
                    cells[6].innerHTML = '<span class="badge badge-success">Đã thanh toán đủ</span>';
                } else {
                    cells[5].innerHTML = '<span class="badge badge-danger">' + newDebt.toLocaleString('vi-VN') + ' MMK</span>';
                }
            }
        });
        
        if (createdInvoice) {
            alert(`Đã ghi nhận thanh toán thành công! Hệ thống đã sinh hóa đơn ${createdInvoice.code}.`);
        } else {
            alert('Đã ghi nhận thanh toán thành công! (Chưa sinh được hóa đơn do thiếu dữ liệu đợt/hoá đơn)');
        }
        closeModal('record-payment-modal');
        
        // If debt detail modal was open, refresh it
        if (currentDebtId === currentRecordPaymentId) {
            // Refresh debt detail to show new payment history
            setTimeout(() => {
                const row = document.querySelector(`#debt-table-body tr:has(td:first-child:contains("${currentRecordPaymentId}"))`);
                if (!row) {
                    const rows = document.querySelectorAll('#debt-table-body tr');
                    rows.forEach(r => {
                        const cells = r.querySelectorAll('td');
                        if (cells[0].textContent.trim() === currentRecordPaymentId.toString()) {
                            showDebtDetail(cells);
                        }
                    });
                } else {
                    const cells = row.querySelectorAll('td');
                    showDebtDetail(cells);
                }
            }, 100);
        }
    }
}

// Update Invoice Table
function updateInvoiceTable() {
    const invoiceTableBody = document.getElementById('invoice-table-body');
    if (!invoiceTableBody) return;
    
    invoiceTableBody.innerHTML = '';
    
    // Sort invoices by id descending (newest first)
    const sortedInvoices = [...invoices].sort((a, b) => b.id - a.id);
    
    sortedInvoices.forEach((invoice, index) => {
        const tr = document.createElement('tr');
        const statusBadge = invoice.status === 'approved' 
            ? '<span class="badge badge-success">Đã xác nhận</span>'
            : '<span class="badge badge-warning">Chờ xác nhận</span>';
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${invoice.code}</td>
            <td>${invoice.studentCode}</td>
            <td>${invoice.studentName}</td>
            <td>${invoice.period}</td>
            <td>${invoice.requiredAmount.toLocaleString('vi-VN')} MMK</td>
            <td>${invoice.paidAmount.toLocaleString('vi-VN')} MMK</td>
            <td>${statusBadge}</td>
            <td class="action-cell">
                <button class="btn-icon btn-view" title="Xem chi tiết" onclick="showInvoiceDetailFromRow(this)">👁️</button>
            </td>
        `;
        tr.setAttribute('data-invoice-id', invoice.id);
        invoiceTableBody.appendChild(tr);
    });
}

// Initialize invoice table on page load
function initInvoiceTable() {
    updateInvoiceTable();
}

// Show invoice detail from row
function showInvoiceDetailFromRow(button) {
    const row = button.closest('tr');
    const invoiceId = parseInt(row.getAttribute('data-invoice-id'));
    if (invoiceId) {
        const invoice = invoices.find(inv => inv.id === invoiceId);
        if (invoice) {
            showInvoiceDetail(invoice);
        }
    }
}

// Invoice Detail
function showInvoiceDetail(invoice) {
    currentInvoiceId = invoice.id;
    // Get data from invoice object
    const invoiceCode = invoice.code;
    const studentCode = invoice.studentCode;
    const studentName = invoice.studentName;
    const period = invoice.period;
    const requiredAmount = invoice.requiredAmount;
    const paidAmount = invoice.paidAmount;
    const status = invoice.status;
    
    // Set basic information
    document.getElementById('invoice-detail-code').textContent = invoiceCode;
    document.getElementById('invoice-detail-date').textContent = invoice.paymentDate || new Date().toLocaleDateString('vi-VN');
    document.getElementById('invoice-detail-student-code').textContent = studentCode;
    document.getElementById('invoice-detail-student-name').textContent = studentName;
    document.getElementById('invoice-detail-class').textContent = '10A1'; // Mock data
    document.getElementById('invoice-detail-period').textContent = period;
    document.getElementById('invoice-detail-period-code').textContent = 'PP001';
    document.getElementById('invoice-detail-period-start').textContent = '01/01/2024';
    document.getElementById('invoice-detail-period-end').textContent = '31/03/2024';
    
    // Set status
    const statusElement = document.getElementById('invoice-detail-status');
    const confirmBtn = document.getElementById('invoice-confirm-btn');
    if (status === 'approved') {
        statusElement.innerHTML = '<span class="badge badge-success">Đã xác nhận</span>';
        if (confirmBtn) confirmBtn.style.display = 'none';
    } else {
        statusElement.innerHTML = '<span class="badge badge-warning">Chờ xác nhận</span>';
        if (confirmBtn) confirmBtn.style.display = 'inline-flex';
    }
    
    // Calculate amounts
    const requiredAmountNum = requiredAmount;
    const paidAmountNum = paidAmount;
    const remainingAmount = requiredAmountNum - paidAmountNum;
    const paymentPercentage = requiredAmountNum > 0 ? ((paidAmountNum / requiredAmountNum) * 100).toFixed(2) : '0.00';
    
    // Set amounts
    document.getElementById('invoice-detail-required-amount').textContent = requiredAmountNum.toLocaleString('vi-VN') + ' MMK';
    document.getElementById('invoice-detail-total-paid').textContent = paidAmountNum.toLocaleString('vi-VN') + ' MMK';
    document.getElementById('invoice-detail-total-remaining').textContent = remainingAmount.toLocaleString('vi-VN') + ' MMK';
    document.getElementById('invoice-detail-payment-percentage').textContent = paymentPercentage + '%';
    
    // Mock detail items - in real app, this would come from API
    const detailItems = [
        { name: 'Tuition Fee', amount: 500000, paid: 300000 },
        { name: 'Library Fee', amount: 50000, paid: 50000 },
        { name: 'Lab Fee', amount: 100000, paid: 100000 },
        { name: 'Sports Fee', amount: 75000, paid: 50000 }
    ];
    
    const itemsTableBody = document.getElementById('invoice-detail-items');
    itemsTableBody.innerHTML = '';
    let totalAmount = 0;
    let totalPaid = 0;
    
    detailItems.forEach((item, index) => {
        const remaining = item.amount - item.paid;
        totalAmount += item.amount;
        totalPaid += item.paid;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.amount.toLocaleString('vi-VN')} MMK</td>
            <td>${item.paid.toLocaleString('vi-VN')} MMK</td>
            <td>${remaining > 0 ? `<span class="badge badge-danger">${remaining.toLocaleString('vi-VN')} MMK</span>` : '<span class="badge badge-success">0 MMK</span>'}</td>
        `;
        itemsTableBody.appendChild(row);
    });
    
    // Update totals
    document.getElementById('invoice-detail-total-amount').textContent = totalAmount.toLocaleString('vi-VN') + ' MMK';
    document.getElementById('invoice-detail-paid-amount').textContent = totalPaid.toLocaleString('vi-VN') + ' MMK';
    const totalRemaining = totalAmount - totalPaid;
    document.getElementById('invoice-detail-remaining').textContent = totalRemaining.toLocaleString('vi-VN') + ' MMK';
    
    showModal('invoice-detail-modal');
}

// Confirm Invoice
function confirmInvoice() {
    if (confirm('Bạn có chắc chắn muốn xác nhận hóa đơn này?')) {
        if (currentInvoiceId) {
            const inv = invoices.find(x => x.id === currentInvoiceId);
            if (inv) {
                inv.status = 'approved';
            }
            updateInvoiceTable();
        }

        // Update status in modal
        const statusElement = document.getElementById('invoice-detail-status');
        statusElement.innerHTML = '<span class="badge badge-success">Đã xác nhận</span>';
        
        // Hide confirm button
        const confirmBtn = document.getElementById('invoice-confirm-btn');
        if (confirmBtn) confirmBtn.style.display = 'none';
        
        alert('Đã xác nhận hóa đơn thành công!');
        
        // In real app, you would update the database here
        // Then refresh the table to show updated status
    }
}

// ==================== Final Grade Module - Nhập điểm cuối kỳ ====================

// Mock data for final grades
let finalGradeData = {
    1: { id: 1, studentCode: 'STU001', studentName: 'Nguyễn Văn A', subject: 'Toán', class: '10A1', semester: 'Học kỳ 1', score: 8.5, note: 'Điểm tốt' },
    2: { id: 2, studentCode: 'STU002', studentName: 'Trần Thị B', subject: 'Văn', class: '10A2', semester: 'Học kỳ 1', score: 7.0, note: 'Cần cải thiện' },
    3: { id: 3, studentCode: 'STU003', studentName: 'Lê Văn C', subject: 'Anh', class: '10A1', semester: 'Học kỳ 1', score: 9.0, note: 'Xuất sắc' },
    4: { id: 4, studentCode: 'STU004', studentName: 'Phạm Thị D', subject: 'Toán', class: '11A1', semester: 'Học kỳ 2', score: 8.0, note: '' },
    5: { id: 5, studentCode: 'STU005', studentName: 'Hoàng Văn E', subject: 'Lý', class: '11A2', semester: 'Học kỳ 2', score: 7.5, note: 'Ổn định' }
};

// Mock data for students by class
let studentsByClassForGrade = {
    '10A1': [
        { code: 'STU001', name: 'Nguyễn Văn A' },
        { code: 'STU003', name: 'Lê Văn C' },
        { code: 'STU006', name: 'Vũ Thị F' }
    ],
    '10A2': [
        { code: 'STU002', name: 'Trần Thị B' },
        { code: 'STU007', name: 'Đỗ Văn G' }
    ],
    '11A1': [
        { code: 'STU004', name: 'Phạm Thị D' },
        { code: 'STU008', name: 'Bùi Văn H' }
    ],
    '11A2': [
        { code: 'STU005', name: 'Hoàng Văn E' },
        { code: 'STU009', name: 'Ngô Thị I' }
    ],
    '12A1': [
        { code: 'STU010', name: 'Lý Văn J' },
        { code: 'STU011', name: 'Trương Thị K' }
    ],
    '12A2': [
        { code: 'STU012', name: 'Đinh Văn L' },
        { code: 'STU013', name: 'Võ Thị M' }
    ]
};

let nextFinalGradeId = 6;

// Load final grade table
function loadFinalGradeTable() {
    const tableBody = document.getElementById('final-grade-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    const grades = Object.values(finalGradeData);
    
    if (grades.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 40px; color: #505050; font-size: 14px;">Chưa có dữ liệu điểm cuối kỳ.</td></tr>`;
        return;
    }

    grades.forEach((grade, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${grade.studentCode}</td>
            <td>${grade.studentName}</td>
            <td>${grade.subject}</td>
            <td>${grade.class}</td>
            <td>${grade.semester}</td>
            <td><strong>${grade.score}</strong></td>
            <td>${grade.note || '-'}</td>
            <td class="action-cell">
                <button class="btn-icon btn-edit" title="Sửa" onclick="editFinalGrade(${grade.id})">✏️</button>
                <button class="btn-icon btn-delete" title="Xóa" onclick="deleteFinalGrade(${grade.id})">🗑️</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Show add final grade form
function showAddFinalGradeForm() {
    // Reset form
    const form = document.getElementById('final-grade-form');
    form.reset();
    form.removeAttribute('data-editing-id');
    document.getElementById('final-grade-student').innerHTML = '<option value="">-- Chọn học sinh --</option>';
    
    showModal('add-final-grade-modal');
}

// Handle class change to load students
document.addEventListener('DOMContentLoaded', function() {
    const classSelect = document.getElementById('final-grade-class');
    const studentSelect = document.getElementById('final-grade-student');
    
    if (classSelect && studentSelect) {
        classSelect.addEventListener('change', function() {
            const selectedClass = this.value;
            studentSelect.innerHTML = '<option value="">-- Chọn học sinh --</option>';
            
            if (selectedClass && studentsByClassForGrade[selectedClass]) {
                studentsByClassForGrade[selectedClass].forEach(student => {
                    const option = document.createElement('option');
                    option.value = student.code;
                    option.textContent = `${student.code} - ${student.name}`;
                    studentSelect.appendChild(option);
                });
            }
        });
    }
});

// Save final grade
function saveFinalGrade() {
    const semester = document.getElementById('final-grade-semester').value;
    const subject = document.getElementById('final-grade-subject').value;
    const classValue = document.getElementById('final-grade-class').value;
    const studentCode = document.getElementById('final-grade-student').value;
    const score = parseFloat(document.getElementById('final-grade-score').value);
    const note = document.getElementById('final-grade-note').value;

    if (!semester || !subject || !classValue || !studentCode || isNaN(score)) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }

    if (score < 0 || score > 10) {
        alert('Điểm phải từ 0 đến 10!');
        return;
    }

    // Find student name
    const students = studentsByClassForGrade[classValue] || [];
    const student = students.find(s => s.code === studentCode);
    const studentName = student ? student.name : '';

    // Create new grade entry
    const newGrade = {
        id: nextFinalGradeId++,
        studentCode: studentCode,
        studentName: studentName,
        subject: subject,
        class: classValue,
        semester: semester,
        score: score,
        note: note
    };

    finalGradeData[newGrade.id] = newGrade;

    // Reload table
    loadFinalGradeTable();

    // Close modal
    closeModal('add-final-grade-modal');

    alert('Thêm điểm cuối kỳ thành công!');
}

// Edit final grade
function editFinalGrade(id) {
    const grade = finalGradeData[id];
    if (!grade) return;

    // Populate form
    document.getElementById('final-grade-semester').value = grade.semester;
    document.getElementById('final-grade-subject').value = grade.subject;
    document.getElementById('final-grade-class').value = grade.class;
    
    // Load students for the class
    const classSelect = document.getElementById('final-grade-class');
    const studentSelect = document.getElementById('final-grade-student');
    studentSelect.innerHTML = '<option value="">-- Chọn học sinh --</option>';
    
    if (studentsByClassForGrade[grade.class]) {
        studentsByClassForGrade[grade.class].forEach(student => {
            const option = document.createElement('option');
            option.value = student.code;
            option.textContent = `${student.code} - ${student.name}`;
            if (student.code === grade.studentCode) {
                option.selected = true;
            }
            studentSelect.appendChild(option);
        });
    }
    
    document.getElementById('final-grade-score').value = grade.score;
    document.getElementById('final-grade-note').value = grade.note || '';

    // Store editing ID
    document.getElementById('final-grade-form').dataset.editingId = id;

    showModal('add-final-grade-modal');
}

// Delete final grade
function deleteFinalGrade(id) {
    if (confirm('Bạn có chắc chắn muốn xóa điểm này?')) {
        delete finalGradeData[id];
        loadFinalGradeTable();
        alert('Đã xóa điểm thành công!');
    }
}

// Update form submit to handle edit
document.addEventListener('DOMContentLoaded', function() {
    const finalGradeForm = document.getElementById('final-grade-form');
    if (finalGradeForm) {
        finalGradeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const editingId = this.dataset.editingId;
            if (editingId) {
                updateFinalGrade(editingId);
            } else {
                saveFinalGrade();
            }
        });
    }
});

// Update final grade
function updateFinalGrade(id) {
    const semester = document.getElementById('final-grade-semester').value;
    const subject = document.getElementById('final-grade-subject').value;
    const classValue = document.getElementById('final-grade-class').value;
    const studentCode = document.getElementById('final-grade-student').value;
    const score = parseFloat(document.getElementById('final-grade-score').value);
    const note = document.getElementById('final-grade-note').value;

    if (!semester || !subject || !classValue || !studentCode || isNaN(score)) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }

    if (score < 0 || score > 10) {
        alert('Điểm phải từ 0 đến 10!');
        return;
    }

    // Find student name
    const students = studentsByClassForGrade[classValue] || [];
    const student = students.find(s => s.code === studentCode);
    const studentName = student ? student.name : '';

    // Update grade entry
    finalGradeData[id] = {
        id: id,
        studentCode: studentCode,
        studentName: studentName,
        subject: subject,
        class: classValue,
        semester: semester,
        score: score,
        note: note
    };

    // Reload table
    loadFinalGradeTable();

    // Close modal
    closeModal('add-final-grade-modal');

    // Clear editing ID
    document.getElementById('final-grade-form').removeAttribute('data-editing-id');

    alert('Cập nhật điểm cuối kỳ thành công!');
}
