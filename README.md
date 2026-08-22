# Dayflow - Human Resource Management System

Every workday, perfectly aligned.

## Overview

Dayflow is a Human Resource Management System (HRMS) designed to digitize and streamline core HR operations such as employee onboarding, profile management, attendance tracking, leave management, payroll visibility, and approval workflows.

## Scope

The system provides:

* Secure authentication (Sign Up / Sign In)
* Role-based access for Admin/HR and Employee users
* Employee profile management
* Daily and weekly attendance tracking
* Leave and time-off management
* Leave and attendance approval workflows
* Payroll and salary visibility
* Email and notification alerts
* Analytics and reports

## User Roles

### Admin / HR Officer

* Manage employees
* View employee profiles
* View attendance records for all employees
* Approve or reject leave requests
* Add comments to leave decisions
* View payroll information
* Update employee salary structures
* Access reports and analytics

### Employee

* Register and sign in
* View personal profile
* View job details and salary structure
* View personal documents and profile picture
* Edit limited profile information
* Check in and check out
* View personal attendance
* Apply for leave
* View leave request status
* View payroll information

## Authentication

Users can register using:

* Employee ID
* Email
* Password
* Role (Employee / HR)

Email verification is required, and passwords must follow security rules.

Users sign in using their email and password. Incorrect credentials display an error message, while successful authentication redirects the user to the dashboard.

## Dashboard

### Employee Dashboard

Provides quick access to:

* Profile
* Attendance
* Leave Requests
* Logout

The dashboard also displays recent activity or alerts.

### Admin / HR Dashboard

Provides access to:

* Employee list
* Attendance records
* Leave approvals
* Employee switching

## Employee Profile Management

Employees can view:

* Personal details
* Job details
* Salary structure
* Documents
* Profile picture

Employees can edit limited fields such as:

* Address
* Phone number
* Profile picture

Admins can edit all employee details.

## Attendance Management

The system supports daily and weekly attendance views.

Employees can check in and check out.

Attendance statuses include:

* Present
* Absent
* Half-day
* Leave

Employees can view only their own attendance, while Admin/HR users can view attendance for all employees.

## Leave \& Time-Off Management

Employees can:

* Select a leave type
* Choose a date range
* Add remarks
* Submit leave requests

Supported leave types include:

* Paid Leave
* Sick Leave
* Unpaid Leave

Leave request statuses include:

* Pending
* Approved
* Rejected

Admin/HR users can view all leave requests, approve or reject requests, and add comments. Changes are reflected immediately in employee records.

## Payroll / Salary Management

Employee payroll data is read-only.

Admins can:

* View payroll for all employees
* Update salary structures
* Ensure payroll accuracy

## Notifications \& Reports

The system includes:

* Email and notification alerts
* Analytics and reports dashboard
* Salary slip reports
* Attendance reports

## Future Enhancements

The project specification indicates a future-enhancement section for extending the HRMS beyond the current requirements.

## 



View our app in AI Studio: https://dayflow-hrms-4300.ai.studio



Run Locally



\*\*Prerequisites:\*\*  Node.js





1\. Install dependencies:

&#x20;  `npm install`

2\. Set the `GEMINI\_API\_KEY` in \[.env.local](.env.local) to your Gemini API key

3\. Run the app:

&#x20;  `npm run dev`



