# Employee Attendance Tracking System

## Overview

This application is designed to simplify attendance tracking for employers and employees using geolocation-based check-ins and check-outs. The system ensures secure and accurate attendance recording while calculating work hours automatically based on geo-fence status.

### Features

#### **Employer Panel**

- **Geo-Fence Management**:  
  Employers can create, update, activate, and deactivate geo-fences for their office locations.
- **Employee Management**:  
  Employers can view all employees, manage attendance logs, and approve/reject attendance requests.
- **Attendance Reports**:  
  Employers can view and download attendance reports for a specific date range in CSV or PDF format.
- **Alerts and Notifications**:  
  Employers receive alerts if employees check out from outside the geo-fence.

#### **Employee Panel**

- **Geo-Fence Check**:  
  Employees can verify if they are inside the geo-fence using geolocation detection.
- **Attendance Tracking**:  
  Employees can check in and check out, with work hours automatically calculated based on the difference between the two.
- **Alerts**:  
  Employees are notified if they check out outside the geo-fence, and an alert is sent to the employer.

### Upcoming Feature

- **Face Recognition**:  
  Integration of face recognition for additional security during check-ins and check-outs is planned for the near future.

## Technology Stack

### **Backend**

- **Node.js**: Backend runtime environment.
- **Express**: Framework for building RESTful APIs.
- **MongoDB**: Database for storing employer, employee, geo-fence, and attendance data.
- **JWT**: Used for authentication.

### **Frontend**

- **React**: Frontend framework for building an interactive UI.
- **React-Leaflet** or **Google Maps API**: For geo-fence visualization and management.
- **Geolocation API**: For detecting employee location during attendance.

## Database Schema

### **Employer Collection**

- Stores employer details and associated geo-fence and employee data.

### **Employee Collection**

- Stores employee details, including attendance logs.

### **Geo-Fence Collection**

- Stores geo-fence details such as location, radius, and status.

### **Attendance Collection**

- Tracks check-in and check-out times, work hours, and geo-fence statuses.

### **Alert Collection**

- Stores alerts triggered when employees check out from outside the geo-fence.

## Workflow

1. **Employer Panel**:

   - Employers log in to manage geo-fences and employees.
   - Employers can view attendance logs, approve/reject attendance, and receive alerts.

2. **Employee Panel**:
   - Employees log in to check their geo-fence status and mark attendance.
   - The system validates attendance based on geo-fence status at check-in and check-out times.

## Installation and Setup

1. Clone the repository.
   ```bash
   git clone <repository_url>
   ```
