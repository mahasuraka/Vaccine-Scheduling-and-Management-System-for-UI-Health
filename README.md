# CS480: Final Project 

### Name: Maha Lakshmi Suraka
### UIN:660682722

<hr/>

## Introduction

Web App serves as a vaccination appointment portal designed to streamline the entire process, offering a user-friendly experience for patients, nurses, and administrators.

### Features:

1. Patient Registration & Booking

Patients can easily register themselves on webapp, providing essential information to create a secure profile. Once registered, the webapp allows users to  book vaccination appointments and handle their previous appointments. The patients can additionally view their previous appointments.

2. Nurse Portal

The webapp includes a dedicated Nurse Portal alowing the professionals to manage and oversee vaccination appointments. Nurses can schedule their working hours,cancel previously scheduled hours and mark appoitments as completed.

3. Admin Portal

Web App's Admin Portal provides the access to register a new nurse, view all nurses and patients. Additionally admins will have access to handle inventory for the vaccines which are being administered.

### Technology Stack

React: The frontend is built using React, providing a responsive and dynamic user interface for patients, nurses, and administrators.

Express: The backend is powered by Express, a scalable Node.js framework, ensuring efficient data flow and seamless communication between the frontend and the database.

MySQL: The database layer is handled by MySQL, a relational database management system. This ensures secure storage and retrieval of patient, nurse, schedule and appointment data.


## Setup Guidelines

To setup the project locally, following steps needs to be taken. 

#### Prerequisites

1. Node.js
2. NPM

Visit the official Node.js website. Download the latest LTS version for your operating system. Follow the installation instructions provided on the website. To verify the installation, open a terminal or command prompt and run the following commands:

```
node -v
npm -v
```

You should see version numbers for both Node.js and NPM.

3. MySQL

Install latest version of MySQL community server on your system.

### Steps

#### API (PORT 3000)
- Navigate to api directory
- Run `npm install` to install all the modules.
- Update the values in config.json (This includes the sql sever connection credentials)
- Use `npm run start` to run the server.

#### Clinet (PORT 8080)
- Navigate to client directory
- Run `npm install` to install all the modules.
- Use `npm run start` to run the server.

#### MYSQL DB 
- Import the .sql schema dump present in the root directory to a new database in local MYSQL server.
- Add data to users table with access level to admin to access admin portal.

The webapp should be accessible on the http://localhost:8080/.


### Database Design

Following tables are creaded for this application. 

1. users

- This table stores general information about all users interacting with the Web App application, regardless of their role. It includes fields such as uuid, username, password and access level.

2. patients

- This table stores information about all the registered patients with their information. The table includes fields such as patient_id, first_name, middle_name, last_name, age, gender, address, phone_number, race, occupation, medical_history and username. The patient_id for each record will be auto created by trigger.

3. nurses

- This table stores information about all the registered nurses with their information. The table includes fields such as employee_id, first_name, middle_name, last_name, age, gender, address, phone_number and username.

4. time_slots

- This table stores all the timeslot when vaccination can be provided. The table includes fields such as slot_id, start_time, end_time & slot_name.

3. nurse_schedules

- This table stores information about all the schedules for nurses. It include fields such as nurse_id, slot_id & date of the schedule. nurse_id & slot_id are foreign keys which are referring to primary key of nurses and time_slots table respectively. The uuid for each record will be auto created by trigger.

4. vaccination_schedules

- This table stores information about all the schedules for nurses. It include fields such as nurse_id, slot_id, vaccine_id & date of the schedule. nurse_id, vaccine_id & slot_id are foreign keys which are referring to primary key of nurses, vaccines and time_slots table respectively. The uuid for each record will be auto created by trigger.

5. admins

- This table stores information about admins and their details.

6. vaccines

- This table stores information about the vaccines and their availability. 

7. vaccine_records

- This table stores information about all the vaccines which are administered to the patients. This also stores the dosage information for a specific patients.  The uuid for each record will be auto created by trigger.

The structure dump with triggers can be found in schema.sql file.


### Features and Pages.

![Home Page](./images/home1.png)

- All the staff, nurses and patients log into their accounts from the same log in page, and will be redirected into appropriate sub-portals.


#### Patient Portal

![Home Page](./images/patientProfile.png)

- This page gives access to patients to login in or register into their accounts and schedule an appointment for vaccination, edit their personal information, view scheduled appointments and cancel previously scheduled appointments.


![Home Page](./images/patProUpdate.png)

#### Nurse Portal

![Home Page](./images/nurseProfile.png)

- This page gives access to nurses to login to their accounts, pick up a time slot for work, view their upcoming work hours, check the vaccination informantion and update their personal information.


#### Admin Portal

![Home Page](./images/adminProfile.png)

- This page gives access to admin staff to login to their accounts, create and update nurses information, manage inventory for vaccines and view patient information.

![Home Page](./images/registerNurse.png)



