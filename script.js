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
        'grade-approval': 'Duyệt điểm cho Admin'
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

// Payment Config functions
function showAddPaymentConfigForm() {
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
    document.getElementById('feeitem-detail-amount').textContent = cells[4].textContent;
    document.getElementById('feeitem-detail-unit').textContent = cells[5].textContent;
    showModal('feeitem-detail-modal');
}

// Payment Period Detail
function showPaymentPeriodDetail(cells) {
    document.getElementById('payment-period-detail-code').textContent = cells[1].textContent;
    document.getElementById('payment-period-detail-name-en').textContent = cells[2].textContent;
    document.getElementById('payment-period-detail-name-my').textContent = cells[3].textContent;
    document.getElementById('payment-period-detail-start-date').textContent = cells[4].textContent;
    document.getElementById('payment-period-detail-end-date').textContent = cells[5].textContent;
    
    // Calculate days
    try {
        const startDateStr = cells[4].textContent.trim();
        const endDateStr = cells[5].textContent.trim();
        const startDate = new Date(startDateStr.split('/').reverse().join('-'));
        const endDate = new Date(endDateStr.split('/').reverse().join('-'));
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        document.getElementById('payment-period-detail-days').textContent = days + ' ngày';
    } catch (e) {
        document.getElementById('payment-period-detail-days').textContent = 'N/A';
    }
    
    showModal('payment-period-detail-modal');
}

// Payment Config Detail
function showPaymentConfigDetail(cells) {
    document.getElementById('payment-config-detail-id').textContent = 'PC' + cells[0].textContent.padStart(3, '0');
    document.getElementById('payment-config-detail-period').textContent = cells[1].textContent;
    document.getElementById('payment-config-detail-period-code').textContent = 'PP' + cells[0].textContent.padStart(3, '0');
    document.getElementById('payment-config-detail-feeitem').textContent = cells[2].textContent;
    document.getElementById('payment-config-detail-feeitem-code').textContent = 'FEE' + cells[0].textContent.padStart(3, '0');
    document.getElementById('payment-config-detail-amount').textContent = '500,000 MMK'; // Mock data
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
    
    const paymentRate = totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(2) : '0.00';
    document.getElementById('debt-detail-payment-rate').textContent = paymentRate + '%';
    
    // Get status from table (cells[6] is the status column)
    const statusText = cells[6].textContent.trim();
    const statusElement = document.getElementById('debt-detail-expiry-status');
    if (statusText.includes('hết hạn') || statusText.includes('Đã')) {
        statusElement.innerHTML = '<span class="badge badge-danger">Đã hết hạn</span>';
    } else {
        statusElement.innerHTML = '<span class="badge badge-success">Chưa hết hạn</span>';
    }
    
    showModal('debt-detail-modal');
}

// Invoice Detail
function showInvoiceDetail(cells) {
    // Get data from table row
    const invoiceCode = cells[1].textContent.trim();
    const studentCode = cells[2].textContent.trim();
    const studentName = cells[3].textContent.trim();
    const period = cells[4].textContent.trim();
    const requiredAmount = cells[5].textContent.trim();
    const paidAmount = cells[6].textContent.trim();
    const status = cells[7].textContent.trim();
    
    // Set basic information
    document.getElementById('invoice-detail-code').textContent = invoiceCode;
    document.getElementById('invoice-detail-date').textContent = new Date().toLocaleDateString('vi-VN');
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
    const requiredAmountNum = parseInt(requiredAmount.replace(/[^\d]/g, '')) || 0;
    const paidAmountNum = parseInt(paidAmount.replace(/[^\d]/g, '')) || 0;
    const remainingAmount = requiredAmountNum - paidAmountNum;
    const paymentPercentage = requiredAmountNum > 0 ? ((paidAmountNum / requiredAmountNum) * 100).toFixed(2) : '0.00';
    
    // Set amounts
    document.getElementById('invoice-detail-required-amount').textContent = requiredAmount;
    document.getElementById('invoice-detail-total-paid').textContent = paidAmount;
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
