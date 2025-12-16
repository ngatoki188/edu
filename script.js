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
        'student-fee-config': 'Cấu hình khoản phí cho học sinh',
        'debt-management': 'Quản lý khoản nợ',
        'invoice-management': 'Quản lý Hóa đơn',
        'grade': 'Tạo đầu điểm',
        'grade-input': 'Nhập điểm',
        'grade-approval': 'Duyệt điểm cho Admin',
        'schedule': 'Lịch học',
        'attendance': 'Điểm danh',
        'fee-approval': 'Duyệt phí cho học sinh'
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
    
    // Keep first 3 columns (#, Mã SV, Họ và tên) and last column (Ghi chú)
    // Remove dynamic grade point columns (from index 3 to last-1)
    const fixedColumns = 3; // #, Mã SV, Họ và tên
    const lastColumnIndex = existingHeaders.length - 1; // Ghi chú
    
    // Remove columns from right to left to avoid index shifting issues
    for (let i = lastColumnIndex - 1; i >= fixedColumns; i--) {
        existingHeaders[i].remove();
    }
    
    // Add dynamic columns
    filteredPoints.forEach((point, index) => {
        const th = document.createElement('th');
        th.textContent = `${point.name} (${point.weight})`;
        th.setAttribute('data-grade-point', point.code);
        th.setAttribute('data-max-score', point.maxScore);
        headerRow.insertBefore(th, headerRow.querySelector('th:last-child'));
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
        const notesInput = row.querySelector('.notes-input');
        
        const grades = {};
        gradeInputs.forEach(input => {
            const gradePoint = input.getAttribute('data-grade-point');
            grades[gradePoint] = parseFloat(input.value) || 0;
        });
        
        students.push({
            code: studentCode,
            grades: grades,
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

// Fee Approval Functions
let currentFeeApprovalId = null;

// Show fee approval detail
function showFeeApprovalDetail(id) {
    currentFeeApprovalId = id;
    
    // Mock data - in real app, this would be an API call
    const feeApprovalData = {
        1: {
            studentCode: 'STU001',
            studentName: 'Nguyễn Văn A',
            class: '10A1',
            semester: 'Học kỳ 1',
            period: 'First Semester Payment',
            periodCode: 'PP001',
            date: '15/01/2024',
            status: 'pending',
            note: 'Học sinh đã nộp đầy đủ các khoản phí theo đợt thanh toán',
            feeItems: [
                { name: 'Tuition Fee', amount: '500,000 MMK' },
                { name: 'Library Fee', amount: '50,000 MMK' }
            ],
            total: '550,000 MMK'
        },
        2: {
            studentCode: 'STU002',
            studentName: 'Trần Thị B',
            class: '10A2',
            semester: 'Học kỳ 1',
            period: 'First Semester Payment',
            periodCode: 'PP001',
            date: '16/01/2024',
            status: 'approved',
            note: 'Đã duyệt và xác nhận thanh toán',
            feeItems: [
                { name: 'Tuition Fee', amount: '500,000 MMK' },
                { name: 'Library Fee', amount: '50,000 MMK' },
                { name: 'Lab Fee', amount: '50,000 MMK' }
            ],
            total: '600,000 MMK'
        },
        3: {
            studentCode: 'STU003',
            studentName: 'Lê Văn C',
            class: '11A1',
            semester: 'Học kỳ 1',
            period: 'First Semester Payment',
            periodCode: 'PP001',
            date: '17/01/2024',
            status: 'pending',
            note: 'Chờ admin duyệt',
            feeItems: [
                { name: 'Tuition Fee', amount: '500,000 MMK' },
                { name: 'Library Fee', amount: '20,000 MMK' }
            ],
            total: '520,000 MMK'
        }
    };
    
    const data = feeApprovalData[id] || feeApprovalData[1];
    
    // Set detail information
    document.getElementById('fee-approval-detail-student-code').textContent = data.studentCode;
    document.getElementById('fee-approval-detail-student-name').textContent = data.studentName;
    document.getElementById('fee-approval-detail-class').textContent = data.class;
    document.getElementById('fee-approval-detail-semester').textContent = data.semester;
    document.getElementById('fee-approval-detail-period').textContent = data.period;
    document.getElementById('fee-approval-detail-period-code').textContent = data.periodCode;
    document.getElementById('fee-approval-detail-date').textContent = data.date;
    document.getElementById('fee-approval-detail-note').textContent = data.note;
    document.getElementById('fee-approval-detail-total').textContent = data.total;
    
    // Set status
    const statusElement = document.getElementById('fee-approval-detail-status');
    const approveBtn = document.getElementById('fee-approval-approve-btn');
    const rejectBtn = document.getElementById('fee-approval-reject-btn');
    
    if (data.status === 'approved') {
        statusElement.innerHTML = '<span class="badge badge-success">Đã duyệt</span>';
        if (approveBtn) approveBtn.style.display = 'none';
        if (rejectBtn) rejectBtn.style.display = 'none';
    } else if (data.status === 'rejected') {
        statusElement.innerHTML = '<span class="badge badge-danger">Đã từ chối</span>';
        if (approveBtn) approveBtn.style.display = 'none';
        if (rejectBtn) rejectBtn.style.display = 'none';
    } else {
        statusElement.innerHTML = '<span class="badge badge-warning">Chờ duyệt</span>';
        if (approveBtn) approveBtn.style.display = 'inline-flex';
        if (rejectBtn) rejectBtn.style.display = 'inline-flex';
    }
    
    // Build fee items table
    const feeItemsTableBody = document.getElementById('fee-approval-detail-fee-items');
    if (feeItemsTableBody) {
        feeItemsTableBody.innerHTML = '';
        
        data.feeItems.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.amount}</td>
            `;
            feeItemsTableBody.appendChild(tr);
        });
    }
    
    showModal('fee-approval-detail-modal');
}

// Approve fee
function approveFee(id) {
    if (confirm('Bạn có chắc chắn muốn duyệt phí này?')) {
        // Update status in table
        const rows = document.querySelectorAll('#fee-approval-table-body tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells[0].textContent.trim() === id.toString()) {
                cells[6].innerHTML = '<span class="badge badge-success">Đã duyệt</span>';
                const actionCell = cells[7];
                actionCell.innerHTML = '<button class="btn-icon btn-view" title="Xem chi tiết" onclick="showFeeApprovalDetail(' + id + ')">👁️</button>';
            }
        });
        alert('Đã duyệt phí thành công!');
    }
}

// Reject fee
function rejectFee(id) {
    if (confirm('Bạn có chắc chắn muốn từ chối phí này?')) {
        const reason = prompt('Vui lòng nhập lý do từ chối:');
        if (reason) {
            // Update status in table
            const rows = document.querySelectorAll('#fee-approval-table-body tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells[0].textContent.trim() === id.toString()) {
                    cells[6].innerHTML = '<span class="badge badge-danger">Đã từ chối</span>';
                    const actionCell = cells[7];
                    actionCell.innerHTML = '<button class="btn-icon btn-view" title="Xem chi tiết" onclick="showFeeApprovalDetail(' + id + ')">👁️</button>';
                }
            });
            alert('Đã từ chối phí. Lý do: ' + reason);
        }
    }
}

// Approve from detail modal
function approveFeeFromDetail() {
    if (currentFeeApprovalId) {
        approveFee(currentFeeApprovalId);
        closeModal('fee-approval-detail-modal');
    }
}

// Reject from detail modal
function rejectFeeFromDetail() {
    if (currentFeeApprovalId) {
        rejectFee(currentFeeApprovalId);
        closeModal('fee-approval-detail-modal');
    }
}

// Filter fee approval list
function filterFeeApprovalList() {
    const statusFilter = document.getElementById('fee-approval-status-filter');
    const selectedStatus = statusFilter ? statusFilter.value : '';
    const rows = document.querySelectorAll('#fee-approval-table-body tr');
    
    rows.forEach(row => {
        if (!selectedStatus) {
            row.style.display = '';
            return;
        }
        
        const statusCell = row.querySelector('td:nth-child(7)');
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
}


// Save student fee config
function saveStudentFeeConfig() {
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
    alert('Đã lưu cấu hình khoản phí thành công!');
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
        
        alert('Đã ghi nhận thanh toán thành công!');
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
    if (status.includes('xác nhận') || status.includes('Đã')) {
        statusElement.innerHTML = '<span class="badge badge-success">Đã xác nhận</span>';
        // Hide confirm button if already confirmed
        const confirmBtn = document.getElementById('invoice-confirm-btn');
        if (confirmBtn) confirmBtn.style.display = 'none';
    } else {
        statusElement.innerHTML = '<span class="badge badge-warning">Chờ xác nhận</span>';
        const confirmBtn = document.getElementById('invoice-confirm-btn');
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
