Dayflow HRMS - Product Requirements Document (PRD)

1. Overview
Product Name: Dayflow - Human Resource Management System  
Tagline: Every workday, perfectly aligned.  
Purpose: A web platform to manage employee profiles, daily attendance, leave workflows, and salary visibility.  

2. User Roles
Admin / HR Officer: Full access to manage all employees, approve leaves, track organization-wide attendance, and update salary structures.
Employee: Standard access to view personal profile, log daily check-in/out, submit leave requests, and view individual salary details.  

3. Functional Requirements
Authentication & Sign In:
Sign Up: Register using Employee ID, email, password, and assigned role (Employee or HR/Admin) with email verification. 
Sign In: Login with email and password, displaying error alerts on failure and routing to the dashboard on success.

Dashboards:
Employee Dashboard: Quick cards for Profile, Attendance, Leave Requests, and Logout, plus recent alerts.  
Admin Dashboard: Company-wide view showing employee lists, attendance records, pending leave approvals, and employee switching.
Profile Management:

View Profile: Displays personal details, job information, salary structure, uploaded documents, and profile picture.  
Edit Rights: Employees can only update contact info, address, and profile photo. Admins can edit all fields.  
Attendance Tracking:
Logging: Daily check-in and check-out buttons for employees.  
Views: Daily and weekly views displaying status types: Present, Absent, Half-day, and Leave.  
Permissions: Employees view only their own records; Admins/HR view all employee records. 

 Leave & Time-Off:

Apply: Employees select leave type (Paid, Sick, Unpaid), pick date ranges, and add remarks.  
Status Flow: Pending, Approved, or Rejected.  
Approval: Admins can review all requests, approve or reject them, and add comments.  
Payroll & Salary:
Employee View: Read-only access to individual salary structure.  
Admin Control: View and update salary structures across all employees.  

4. Future Scope
Automated email and alert notifications. 
 Reports and analytics dashboard for attendance and salary slips.
