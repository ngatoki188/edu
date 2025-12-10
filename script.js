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
        'invoice-management': 'Quản lý Hóa đơn'
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
