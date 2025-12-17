# Edu 360 - Hệ thống quản lý giáo dục

Mockup hệ thống quản lý giáo dục với giao diện Modern Admin Dashboard.

## 🚀 Deploy miễn phí với tên miền miễn phí

### Option 1: GitHub Pages (Khuyến nghị - Dễ nhất)

**Tên miền miễn phí:** `https://ngatoki188.github.io/edu`

**Cách deploy:**
1. Vào repository: https://github.com/ngatoki188/edu
2. Vào **Settings** → **Pages**
3. Ở phần **Source**, chọn branch `master` và folder `/ (root)`
4. Click **Save**
5. Đợi vài phút, website sẽ có tại: `https://ngatoki188.github.io/edu`

### Option 2: Netlify (Tự động deploy từ GitHub)

**Tên miền miễn phí:** `https://edu-360.netlify.app` (hoặc tên tùy chọn)

**Cách deploy:**
1. Đăng ký tại: https://www.netlify.com (dùng GitHub account)
2. Click **Add new site** → **Import an existing project**
3. Chọn GitHub và repository `edu`
4. Deploy settings:
   - Build command: (để trống)
   - Publish directory: `/` (root)
5. Click **Deploy site**
6. Website sẽ có tại: `https://edu-360.netlify.app`

**Tùy chỉnh tên miền:**
- Vào **Site settings** → **Change site name**
- Đổi thành tên bạn muốn (ví dụ: `edu360` → `https://edu360.netlify.app`)

### Option 3: Vercel

**Tên miền miễn phí:** `https://edu-360.vercel.app`

**Cách deploy:**
1. Đăng ký tại: https://vercel.com (dùng GitHub account)
2. Click **Add New Project**
3. Import repository `edu`
4. Framework Preset: **Other**
5. Click **Deploy**
6. Website sẽ có tại: `https://edu-360.vercel.app`

### Option 4: Cloudflare Pages

**Tên miền miễn phí:** `https://edu-360.pages.dev`

**Cách deploy:**
1. Đăng ký tại: https://pages.cloudflare.com
2. Connect GitHub account
3. Chọn repository `edu`
4. Build settings:
   - Framework preset: **None**
   - Build command: (để trống)
   - Build output directory: `/`
5. Click **Save and Deploy**

## 📁 Cấu trúc dự án

```
MokupEDU360/
├── index.html          # Trang chính với tất cả modules
├── styles.css          # Styling Modern Admin Dashboard
├── script.js           # JavaScript xử lý navigation và functions
└── README.md           # File hướng dẫn này
```

## 🎨 Tính năng

- ✅ 5 Module quản lý đầy đủ
- ✅ Giao diện Modern Admin Dashboard
- ✅ Responsive design
- ✅ Modal xem chi tiết cho tất cả modules
- ✅ Form thêm mới với validation
- ✅ Theme màu xanh dương - trắng chuyên nghiệp

## 📱 Modules

1. **Khoản phí (FeeItem)** - Quản lý các khoản phí
2. **Đợt thanh toán** - Quản lý các đợt thanh toán
3. **Cấu hình đợt thanh toán** - Cấu hình mối quan hệ giữa đợt và khoản phí
4. **Cấu hình khoản phí cho học sinh** - Cấu hình chi tiết cho từng học sinh
5. **Quản lý khoản nợ** - Theo dõi và quản lý nợ của học sinh

## 🔧 Cài đặt local

1. Clone repository:
```bash
git clone https://github.com/ngatoki188/edu.git
cd edu
```

2. Mở file `index.html` bằng trình duyệt hoặc dùng local server:
```bash
# Với Python
python -m http.server 8000

# Với Node.js (npx)
npx serve
```

3. Truy cập: `http://localhost:8000`

## 📝 Lưu ý

- Tất cả các dịch vụ trên đều **miễn phí** và hỗ trợ **HTTPS tự động**
- GitHub Pages phù hợp nhất cho static website
- Netlify và Vercel có tính năng auto-deploy khi push code mới
- Có thể kết nối domain riêng (mất phí) nếu muốn

## 🔗 Links

- Repository: https://github.com/ngatoki188/edu
- GitHub Pages: https://ngatoki188.github.io/edu (sau khi enable)








