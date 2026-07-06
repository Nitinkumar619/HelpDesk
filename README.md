# 🛠️ IIITA Help Desk

**IIITA Help Desk** is a full-stack platform for IIIT Allahabad students to report and track campus-related issues — such as network failures, water problems, or maintenance requests. Students can create **tickets**, admins can assign professionals to solve them, and both can communicate in **real-time** via chat.  

---

## 🧠 Why IIITA Help Desk?

Students often face issues on campus but don’t have a clear channel to report them. **IIITA Help Desk** bridges this gap by:  
- Allowing students to submit tickets easily  
- Letting admins prioritize and assign tickets efficiently  
- Providing **real-time communication** between students, admin
- Tracking the status of tickets for accountability and transparency  

---

## ✨ Features

### 👤 For Students
- Submit **tickets** for issues like network, water, or maintenance  
- Track ticket status and receive updates from assigned professionals  
- Communicate in **real-time chat** with admin or staff  
- Optional anonymity for sensitive issues  

---

### 👮 For Admin
- View tickets based on **priority** or category  
- Assign professionals to tickets efficiently  
- Real-time chat with students for updates or clarifications  
- Track **ticket resolution progress**  


---

## 🔐 Authentication & Security
- ✅ **JWT-based authentication**  
- 🎫 Role-based access control for **students, admin**  
- 🗄️ Secure handling of ticket data and chat messages  

---

## ⚙️ Tech Stack

| Layer        | Stack                                |
|--------------|--------------------------------------|
| Frontend     | React + Vite + Tailwind CSS           |
| Backend      | Node.js + Express                     |
| Database     | PostgreSQL                            |
| Realtime     | Socket.IO                             |
| Auth         | JWT, Role-based Middleware            |

---

## 📁 Environment Configuration

### 📄 server/.env.example

```env
PORT=5000
SECRET_KEY=23o5u989=e
EMAIL=nyaysetu.@gmail.com
PASSWORD=ixvcujxv
DB_STRING=postgres://username:password@host:port/database


### 📄 client/.env.example
VITE_BACKEND_URL=http://localhost:...

```

---

## 🚀 Getting Started (Local Setup)

```bash
# 1. Clone the repo
git clone https://github.com/abhishek98093/HelpDesk.git
cd HelpDesk

# 2. Backend Setup
cd server
cp .env.example .env        # Fill in your real secrets
npm install
npm run dev

# 3. Frontend Setup
cd ../client
cp .env.example .env        # Fill in your real keys
npm install
npm run dev
```

---

## 💡 Contributions

We welcome feature suggestions, bug reports, and community contributions. Help us build a more transparent and accountable justice system together.

---

