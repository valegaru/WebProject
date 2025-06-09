# 📮 Postal Trip

**Plan it together, live it better.**

Postal Trip is a collaborative platform that transforms the experience of planning group trips. With intuitive tools like destination voting, shared expense tracking, and interactive maps, we aim to turn the chaos of planning into a smooth, fun, and democratic process.

---

## 🧠 Why Postal Trip?

Planning a trip with friends sounds fun, but in reality, it often becomes a headache:

* Who decides the destination?
* Who takes charge of the organization?
* How do we split the expenses?
* Where do we store all the trip info?

Postal Trip was created to solve all these challenges in a single web app.

---

## 👥 Target Audience

* **College students** planning trips on weekends or during breaks.
* **Busy professionals** who are often the “trip organizers” but want to share the responsibility.

---

## ✨ Key Features

### 🗳️ Destination MatchMaker

A fun and dynamic voting system that allows participants to select their preferred destination.

* One user creates a voting room
* A QR code or link is shared with the group
* Participants vote (like/dislike) on each destination
* The destination with the most likes is automatically selected as the winner
* The winner is saved in Firestore (`savedMatches`) and shown on the Home page under *Destination Matches*

### 🗺️ Interactive Map (Google Maps API)

Search for points of interest near your destination and save them in personalized lists like “Restaurants”, “Activities”, etc.

### 📆 Collaborative Expense Calendar

A calendar view to record and visualize trip expenses. Each entry includes amount, date, time, and involved participants.

### 👥 Participant Management

Add and manage group members for better coordination and shared responsibility.

---

## ⚙️ Technologies & Dependencies

### 🧩 Main Stack

* **React (Vite)** — Frontend framework
* **React Router DOM** — Page navigation and route handling
* **Firebase** — Backend solution

  * **Firebase Auth** — Authentication system
  * **Firestore** — Real-time NoSQL database
  * **Firebase Storage** — Image hosting

### 🌐 External APIs & Libraries

* **Google Maps API** — Location search, markers, and maps integration
* **Cloudinary** — Image upload and asset management
* **React Big Calendar** — Visual calendar for expenses
* **React DatePicker** — Custom date selectors

---

## 🧪 How to Run the Project Locally

1. Clone the repository:

```bash
git clone https://github.com/your_username/postal-trip.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file at the root with your Firebase and Google Maps credentials:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_GOOGLE_MAPS_API_KEY=...
```

4. Start the development server:

```bash
npm run dev
```

For local and network testing:

```bash
npm run dev -- --host
```

---


**Try Postal Trip** and plan your next group adventure like never before! 🚀



