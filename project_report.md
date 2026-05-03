# Project Report

## Title: Database Design and Implementation of a Ride-Hailing System (Uber Clone)

---

## 1. Introduction

Ride-hailing systems such as Uber have transformed urban transportation by enabling users to book rides through mobile or web applications. These systems rely heavily on efficient database management to handle users, drivers, ride requests, and fare calculations.

This project focuses on designing and implementing a simplified ride-hailing system with a strong emphasis on database design and system workflow. The system also includes basic predictive components for estimated time of arrival (ETA), traffic estimation, and dynamic fare calculation.

The primary goal of this project is to demonstrate practical implementation of database concepts including relational schema design, entity relationships, and SQL operations.

---

## 2. Objectives

- To design a structured relational database for a ride-hailing system  
- To implement user and driver management modules  
- To manage ride booking, assignment, and lifecycle tracking  
- To apply normalization and ensure data integrity  
- To execute SQL queries for data retrieval and analysis  
- To simulate real-world system workflows using backend integration  

---

## 3. Problem Statement

Traditional transportation systems lack efficiency in booking, tracking, and managing rides. Manual processes often lead to delays, inefficiency, and lack of transparency.

This project addresses these issues by designing a database-driven ride-hailing system that automates ride booking, driver assignment, fare calculation, and ride tracking in a structured and efficient manner.

---

## 4. System Overview

### 4.1 User Module
- User registration and login  
- Secure authentication using JWT  
- Ability to request rides  

### 4.2 Driver Module
- Driver profile management  
- Availability status tracking  
- Ride assignment functionality  

### 4.3 Ride Management Module
- Ride request creation  
- Driver assignment  
- Ride status tracking:
  - Requested  
  - Accepted  
  - Completed  

### 4.4 Fare and ETA Module
- Distance calculation between pickup and destination  
- ETA prediction using backend model  
- Dynamic fare calculation based on multiple factors  

---

## 5. Database Design

### 5.1 Entities

#### Users
- user_id (PK)  
- name  
- email  
- password  
- role  

#### Drivers
- driver_id (PK)  
- user_id (FK)  
- vehicle_type  
- availability_status  

#### Rides
- ride_id (PK)  
- user_id (FK)  
- driver_id (FK)  
- pickup_lat  
- pickup_lng  
- destination_lat  
- destination_lng  
- fare  
- status  
- created_at  

---

### 5.2 Relationships

- One user can have multiple rides (1:M)  
- One driver can handle multiple rides (1:M)  
- Each ride belongs to exactly one user and one driver  

---

### 5.3 Normalization

The database is normalized up to Third Normal Form (3NF) to:
- Eliminate redundancy  
- Maintain consistency  
- Improve efficiency  

---

## 6. System Workflow

1. User logs in  
2. User selects destination  
3. System sets pickup location (hardcoded)  
4. Backend processes:
   - distance calculation  
   - ETA prediction  
   - traffic estimation  
   - fare calculation  
5. Ride is stored in database (status = requested)  
6. Driver is assigned  
7. Status updated to accepted  
8. User views ride details  
9. Ride is completed and updated in database  

---

## 7. SQL Operations

### Supported Operations:
- INSERT (users, rides, drivers)  
- UPDATE (ride status changes)  
- SELECT (data retrieval)  
- JOIN (combined queries across tables)  

### Example Queries:
- Retrieve ride history of a user  
- Calculate total earnings per driver  
- Fetch all active rides  

---

## 8. Transaction Management

Ride booking is handled as a database transaction to ensure:
- Atomicity  
- Consistency  
- Reliability  

Steps:
- Create ride  
- Assign driver  
- Update status  

All steps execute as a single unit.

---

## 9. Tools and Technologies

- Frontend: HTML, CSS, JavaScript / React  
- Backend: Node.js with Express  
- Database: MySQL  
- Authentication: JWT  
- AI Module: Python-based models for ETA, traffic, and fare prediction  

---

## 10. Limitations

- No real-time GPS tracking  
- Simplified driver assignment logic  
- No payment integration  
- Limited scalability  

---

## 11. Future Enhancements

- Real-time ride tracking  
- Advanced driver-rider matching system  
- Payment gateway integration  
- Improved machine learning models  
- Mobile application support  

---

## 12. Conclusion

This project demonstrates the design and implementation of a database-driven ride-hailing system. It focuses on relational database design, system workflow, and integration with backend services.

The system applies core database concepts such as normalization, relationships, and transaction management while simulating real-world ride-hailing operations.
