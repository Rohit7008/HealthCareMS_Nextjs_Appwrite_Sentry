Absolutely! Here's your refined and impressive `README.md` for **CarePulsePMS**, matching the clean and professional tone you shared — while including the ✨ Admin Dashboard ✨ and everything that makes your project stand out.

---

# 💊 CarePulsePMS – Patient Management System

[Live Demo 🚀](https://carepulsepms.vercel.app)

CarePulsePMS is a modern, scalable, and responsive **Patient Management System** built for hospitals, clinics, and individual healthcare providers to streamline appointment scheduling and doctor management — through a clean and intuitive interface.

Built using **Next.js 14**, **Appwrite**, **React Hook Form**, **Zod**, and **Tailwind CSS**, it enables patients to seamlessly book, edit, or cancel appointments, and provides an **admin dashboard** to efficiently manage doctors and appointment statuses.

---

## 🔍 Features

### 👨‍⚕️ Patient Side
- ✅ Book appointments by selecting doctors and time slots
- ✅ Add reason and notes for appointment
- ✅ Cancel appointments with confirmation and reason
- ✅ Track live appointment status (Scheduled, Cancelled)
- ✅ Mobile-first design for ease of use

### 🗂️ Admin Dashboard
- ✅ Add, update, or remove doctors with images and details
- ✅ View and manage all appointments
- ✅ Update status: Scheduled | Cancelled | Completed
- ✅ Filter and search by patient, doctor, or date
- ✅ Fully responsive dashboard interface

---

## 📸 Screenshots

### Patient Appointment Flow  
![image](https://github.com/user-attachments/assets/69e5836a-6d81-4b5d-b7d3-a7486ea890d0)
![image](https://github.com/user-attachments/assets/32c21e18-869b-479f-b7d9-b95128370a2d)
![image](https://github.com/user-attachments/assets/e2a6a0ad-eaf7-44ff-8be8-1c7ca392415d)
![image](https://github.com/user-attachments/assets/fb373697-29be-4c74-8729-28c5c73f2361)
![image](https://github.com/user-attachments/assets/d5b8e7fc-d484-420b-b068-b2c712890b46)

### Admin Dashboard  
![image](https://github.com/user-attachments/assets/afd47e8c-5ee9-4802-af3d-089fe25f42fa)


---

## ⚙️ Tech Stack

| Frontend        | Backend              | Styling        | Hosting / Tools |
|----------------|----------------------|----------------|-----------------|
| Next.js 14      | Appwrite (Cloud)     | Tailwind CSS   | Vercel          |
| TypeScript      | Appwrite DB + Auth   | ShadCN UI      | GitHub          |
| React Hook Form | Appwrite Collections | CSS Modules    |                 |
| Zod             | Appwrite Functions   |                |                 |

---

## 🧠 How It Works

1. **Patients** select a doctor, choose a time, and book an appointment.
2. **Appwrite** stores all appointment and doctor data in structured collections.
3. **Admins** access a secure dashboard to manage appointments and doctors.
4. **Forms** are validated using **React Hook Form + Zod**, ensuring great UX and minimal errors.

---

## 🛠️ Getting Started (Locally)

```bash
# Clone the repository
git clone https://github.com/your-username/carepulsepms.git
cd carepulsepms

# Install dependencies
npm install

# Setup Appwrite credentials in `.env.local`
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE=your_database_id
```

Then, run the development server:

```bash
npm run dev
```

> Make sure to configure your **Appwrite collections** for `doctors` and `appointments`.

---

## 📁 Folder Structure

```
carepulsepms/
├── app/                # App router with route-level layout
│   ├── patients/       # Patient appointment flow
│   ├── admin/          # Admin dashboard and routes
├── components/         # Reusable UI components
├── constants/          # Doctor static list & roles
├── lib/                # Appwrite actions & logic
├── types/              # Appwrite & custom types
├── public/             # Static doctor images
```

---

## 🎯 Upcoming Features

- 🧑‍💻 Role-based authentication (Admin / Patient)
- 📱 Dedicated Patient Portal with appointment history
- 📧 Email & push notifications
- 🗓️ Doctor availability & working hours logic
- 📊 Analytics dashboard with charts

---

## 👨‍💻 Author

**Rohit Pottavathini**  
Full-Stack Developer | Designer | Automation Enthusiast  
🌐 [carepulsepms.vercel.app](https://carepulsepms.vercel.app)  
📸 [Instagram](https://instagram.com/urbannxt) · 🧑‍💻 [GitHub](https://github.com/rohitpotti) · 💼 [LinkedIn](https://linkedin.com/in/rohitpotti)

---

## 📃 License

Licensed under the [MIT License](LICENSE).

---

### ⭐️ Found this useful?

If this project helped you or inspired you, drop a ⭐ on the [GitHub repo](https://github.com/your-username/carepulsepms) — it keeps me building 🚀

---
