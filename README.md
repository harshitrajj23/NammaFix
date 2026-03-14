# NammaFix – AI Powered Civic Issue Resolution Platform

NammaFix is a civic technology platform designed to connect citizens, government authorities, and media organizations to improve urban issue reporting and resolution. The system enables citizens to report city problems, allows government departments to manage and resolve them efficiently, and provides media organizations with transparency dashboards for civic accountability.

The platform integrates AI analysis, geotagging, analytics dashboards, and automated deadline alerts to create a more responsive and transparent civic governance system.

------------------------------------------------------------

Project Overview

NammaFix helps streamline the lifecycle of civic complaints from reporting to resolution.

Citizens can submit complaints such as potholes, garbage overflow, and traffic issues. These complaints are automatically analyzed, categorized, and geotagged. Government authorities can then respond, assign resolution deadlines, and track performance. Media organizations can monitor civic performance through analytics dashboards and identify recurring issues.

------------------------------------------------------------

Key Features

Citizen Portal
- Report civic issues with images and location
- AI-based complaint classification
- Duplicate complaint detection
- Voting system for recurring problems
- Complaint status tracking
- Citizen credit system for reporting issues

Government Dashboard
- Real-time complaint management
- Department based routing of complaints
- Response submission system
- Resolution deadline assignment
- Automatic email alerts when deadlines are missed
- SLA monitoring for accountability

Media Analytics Dashboard
- City-wide complaint analytics
- Civic issue heatmap visualization
- Government performance tracking
- Monthly complaint and resolution analysis
- Recurring civic problem identification
- Constituency performance ratings

------------------------------------------------------------

AI Modules

AI Image Analysis
Uploaded images are analyzed to detect the type of civic issue such as potholes, garbage overflow, or infrastructure damage.

Duplicate Complaint Detection
When a user submits a complaint, the system checks if a similar complaint exists nearby. If found, the user is prompted to confirm whether they are experiencing the same issue.

Civic Heatmap Analytics
A visual heatmap displays complaint density across different regions of the city, helping identify problem hotspots.

------------------------------------------------------------

Government Performance Tracking

The system tracks important governance metrics including:

Response Time
Average time taken by government officers to respond to complaints.

Resolution Rate
Percentage of complaints resolved successfully.

Citizen Satisfaction
Feedback score provided by citizens.

SLA Compliance
Monitoring whether complaint deadlines were met or violated.

------------------------------------------------------------

System Workflow

Citizen reports an issue
↓
AI analyzes the uploaded image
↓
Duplicate complaint detection
↓
Complaint stored in database
↓
Government officer receives the complaint
↓
Officer assigns deadline and submits response
↓
Email alerts triggered if SLA deadlines are missed
↓
Media dashboard visualizes analytics and trends

------------------------------------------------------------

Technology Stack

Frontend
Next.js
React
TypeScript
Tailwind CSS

Backend
Next.js API Routes

Database
Supabase (PostgreSQL)

AI Integration
Mistral AI

Email Notification System
Resend Email API

Data Visualization
Charts and heatmaps

------------------------------------------------------------

Project Structure

app
│
├── citizen
│   ├── complaints
│   └── dashboard
│
├── government
│   ├── new-problems
│   ├── recurring
│   └── response
│
├── media
│   └── dashboard
│
├── api
│   ├── government
│   └── ai
│
components
hooks
lib
scripts

------------------------------------------------------------

Installation and Setup

Step 1: Clone the repository

git clone https://github.com/harshitraj23/NammaFix.git
cd NammaFix

Step 2: Install dependencies

npm install

Step 3: Configure environment variables

Create a .env.local file and add:

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

MISTRAL_API_KEY=your_mistral_api_key
RESEND_API_KEY=your_resend_api_key

Step 4: Run the development server

npm run dev

Open the application in your browser at

http://localhost:3000

------------------------------------------------------------

Application Routes

Citizen Portal
/citizen

Government Dashboard
/government

Media Analytics Dashboard
/media

------------------------------------------------------------

Deadline Alert System

Government officers assign resolution deadlines for each complaint. If the complaint is not resolved before the deadline, the system automatically sends email alerts and records an SLA violation.

------------------------------------------------------------

Future Enhancements

Mobile application for citizens
AI chatbot for complaint submission
Predictive maintenance using complaint trends
Integration with smart city infrastructure
Public civic data APIs

------------------------------------------------------------

Hackathon Information

Project developed during a 48-hour hackathon focused on building AI-powered solutions for civic governance and transparency.

------------------------------------------------------------

Author

Vega Sync

GitHub
https://github.com/harshitraj23

------------------------------------------------------------

License

This project is open source and available under the MIT License.