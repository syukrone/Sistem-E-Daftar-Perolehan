# System Prompt: JPAN Unit Perolehan Document Tracking & Management System

## 1. System Overview & Objective
You are tasked with building a modern, web-based Document Tracking and Management System for **Unit Perolehan, Jabatan Perkhidmatan Awam Negeri Sabah (JPAN)**. This system replaces a manual Excel / Google Sheets workflow with an automated digital pipeline that tracks physical paper documents arriving from the **Pengarah (Director)** through multi-tier review, task delegation, accounting updates, file closure, and report generation.

---

## 2. Target Design & UI Aesthetic
* **Aesthetic Style:** **iOS / Apple HIG Glassmorphism**.
* **Visual Elements:** Translucent frosted-glass card containers (`backdrop-blur-xl`, `bg-white/65`, `border-white/50`), glowing ambient mesh gradient background blobs (Sabah Blue `#3B82F6`, Emerald `#10B981`, Warm Amber `#F59E0B`), extra-rounded corners (`rounded-3xl` / `rounded-2xl`), and iOS-style segmented switches and pills.
* **Layout Structure:** iPadOS-style floating glass sidebar navigation, top blur header bar, high-density data tables, and slide-over/modal drawers.

---

## 3. User Roles & Access Permissions
1. **Unit Staff (`staff`):**
   * Keys in initial physical document log entries.
   * Views assigned procurement tasks.
   * Key in financial/accounting details (`update form`) and closes files.
   * Generates and exports category/period reports.
2. **Penolong Pengarah Kanan (`ppkp`):**
   * Reviews incoming documents and ticks the **PPKP Review Checkbox**.
   * Delegates reviewed documents to specific **Staff in Charge**.
   * Full search, filter, and reporting access.
3. **Penolong Pegawai Tadbir Kanan (`pptk`):**
   * Reviews incoming documents and ticks the **PPTK Review Checkbox**.
   * Delegates reviewed documents to specific **Staff in Charge**.
   * Full search, filter, and reporting access.
4. **Administrator (`admin`):**
   * Manages user accounts, categories, and system settings.

---

## 4. Business Workflow & Document Lifecycle
[ 1. Physical Doc Received ]
│
▼
[ 2. Staff Log Entry Form ] ──► Status: "pending_review"
│
▼
[ 3. Physical Doc Sent to PPKP & PPTK ] ──► Digital Review Checkboxes (PPKP [✓] & PPTK [✓])
│
▼
[ 4. Segregation & Assignment ] ──► Assigned to Staff in Charge (Status: "in_progress")
│
▼
[ 5. Staff Processing & Update ] ──► Key in LPO, Vendor, Amount, Invoice, Accounts Date, Remarks
│
▼
[ 6. File Closure ] ──► Status: "closed"
│
▼
[ 7. Report Generation Module ] ──► Export PDF / Excel reports by Category & Timeframe

---

## 5. Procurement Categories (6 Main Scopes)
1. **Sebut Harga & Tender Jabatan** (*Perkhidmatan/Bekalan: Sebut Harga/Tender Jabatan*)
2. **Pakej, Latihan & Waran** (*Perkhidmatan/Bekalan secara pakej, Konsultan latihan, yuran penyertaan kursus, waran peruntukan kecil*)
3. **Katering & Sajian** (*Tempahan makan & minum untuk mesyuarat, kursus, bengkel, program rasmi jabatan*)
4. **Pengangkutan & Penginapan** (*Waran Perjalanan Udara Awam (WPUA), penginapan, dan pengangkutan*)
5. **Aset, Sewaan & Penyelenggaraan** (*Pembelian, sewaan, penyelenggaraan, dan pembaikan kecil*)
6. **Pelbagai / Miscellaneous** (*Lain-lain permohonan: Pengurangan Yuran, Penjelasan AP, Maklum Balas Teguran, dll.*)

---

## 6. Form Specifications & Fields

### A. Initial Log Entry Form (Staff Entry)
* `id` / `Bil.`: Auto-incrementing entry ID.
* `tarikh_terima`: Date picker (Date physical paper received).
* `bahagian_memohon`: Requesting division/unit (Text / Dropdown).
* `no_rujukan_fail`: File reference number (Text input).
* `tarikh_rujukan_fail`: Date stated on the file (Date picker).
* `tajuk`: Application summary / subject title (Textarea).
* `category_id`: Dropdown select (Categories 1 to 6).

### B. Review & Assignment Actions (PPKP & PPTK)
* `review_ppkp`: Boolean checkbox (`TRUE` / `FALSE`) + timestamp (`review_ppkp_at`).
* `review_pptk`: Boolean checkbox (`TRUE` / `FALSE`) + timestamp (`review_pptk_at`).
* `assigned_to_user_id`: Foreign key linking to assigned `users.id`.
* Status auto-transitions to `ready_for_assignment` when both reviewers check their boxes, then to `in_progress` once assigned.

### C. Update Form (Assigned Staff in Charge)
* `no_pesanan_kerajaan`: Government Purchase Order / Local Order (LPO / PK) Number.
* `nama_pembekal`: Supplier / Company / Agency Name.
* `amaun`: Monetary amount in Ringgit Malaysia (RM, 2 decimal places).
* `no_invois`: Supplier invoice number and date.
* `tarikh_hantar_akaun`: Date documents/vouchers sent to Finance/Accounts.
* `catatan`: Remarks, audit comments, or status notes.
* Action: **"Save Update & Close File"** (Sets status to `closed`).

---

## 7. Dedicated Reports Module (`Laporan`)

### Filters Page
1. **Category Filter:** Multi-select or radio toggle for Categories 1–6 (or *Semua Kategori*).
2. **Timeframe Filter:**
   * **Segmented iOS Control:** Toggle between `Bulanan (Monthly)` and `Tahunan (Yearly)`.
   * **Bulanan:** Select Month & Year (e.g., *July 2026*).
   * **Tahunan:** Select Year (e.g., *2026*).

### Generated Report Output Table Columns
| Bil. | Nama Syarikat / Agensi | Perkara / Tajuk | Amaun (RM) | No. Pesanan Kerajaan (PK) | No. Invois & Tarikh | Tarikh Penghantaran ke Unit Akaun | Catatan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |

### Export Functionalities
* **Print / Export PDF:** Formatted printable page layout with JPAN letterhead header.
* **Export Excel / CSV:** Spreadsheet output containing filtered data entries.

---

## 8. Database Schema Blueprint

```sql
-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('staff', 'ppkp', 'pptk', 'admin') NOT NULL DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

-- Documents Table (Main Entry)
CREATE TABLE documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tarikh_terima DATE NOT NULL,
    bahagian_memohon VARCHAR(255) NOT NULL,
    no_rujukan_fail VARCHAR(255) NOT NULL,
    tarikh_rujukan_fail DATE NULL,
    tajuk TEXT NOT NULL,
    category_id INT NOT NULL,
    status ENUM('pending_review', 'ready_for_assignment', 'in_progress', 'closed') DEFAULT 'pending_review',
    review_ppkp BOOLEAN DEFAULT FALSE,
    review_ppkp_at TIMESTAMP NULL,
    review_pptk BOOLEAN DEFAULT FALSE,
    review_pptk_at TIMESTAMP NULL,
    assigned_to_user_id BIGINT NULL,
    created_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id),
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

-- Procurement Updates Table
CREATE TABLE procurement_updates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_id BIGINT NOT NULL,
    no_pesanan_kerajaan VARCHAR(255) NULL,
    nama_pembekal VARCHAR(255) NULL,
    amaun DECIMAL(12,2) NULL,
    no_invois VARCHAR(255) NULL,
    tarikh_hantar_akaun DATE NULL,
    catatan TEXT NULL,
    updated_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by_user_id) REFERENCES users(id)
);