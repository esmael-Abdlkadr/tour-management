# Desta Touring: Tour Management System

Welcome to Desta Touring! This project is a comprehensive tour management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides a seamless experience for users and administrators to manage tours, bookings, reviews, and user accounts.

## Table of Contents

- [Features](#features)
  - [User Authentication and Management](#user-authentication-and-management)
  - [Tour Management](#tour-management)
  - [Review System](#review-system)
  - [Booking System](#booking-system)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

### User Authentication and Management

#### User Registration and Login

- **User Registration**: Allows users to create accounts securely.
- **User Login**: Provides secure login functionality.

#### OTP Verification

- **OTP Verification**: Enhances security during user signup and login processes.

#### Password Management

- **Forgot Password**: Users can request a password reset link.
- **Reset Password**: Users can reset their password using a token.
- **Update Password**: Logged-in users can update their password.

#### Account Management

- **Reactivate Account**: Users can reactivate their deactivated accounts.
- **Update Profile Information**: Users can update their personal information.
- **Deactivate Account**: Users can deactivate their accounts.

#### Profile Information

- **Retrieve Profile Information**: Users can retrieve their profile details.

### Tour Management

#### Tour Creation and Management

- **Create, Update, Delete Tours**: Admins can manage tour details.

#### Tour Search and Retrieval

- **Search Tours**: Users can search for tours based on various criteria.
- **Retrieve Tour Information**: Users can get detailed information about specific tours.

#### Advanced Data Handling

- **Pagination**: Provides pagination for large data sets.
- **Sorting**: Allows sorting of tours based on different attributes.
- **Filtering**: Filters tours based on user-selected criteria.

### Review System

#### Review Creation and Management

- **Create, Update, Delete Reviews**: Users can manage their reviews for tours they have attended.

#### Review Retrieval

- **Retrieve Reviews**: Users can view all reviews or specific reviews for a tour.

#### Rating System

- **Average Rating Calculation**: Calculates the average rating and the number of ratings for each tour.
- **Booking Verification**: Only users who have booked a tour can rate it. Throws an error if not booked.
- **Rating Updates**: Recalculates average rating and quantity with every review operation.

### Booking System

#### Booking Creation and Management

- **Book Tours**: Users can book tours.
- **Retrieve Booking Details**: Users can get details of their bookings.
- **Manage Bookings**: Users can cancel or delete their bookings.

#### Admin Booking Management

- **Manage All Bookings**: Admins can view and manage all bookings in the system.

#### User-Specific Bookings

- **Retrieve User Bookings**: Users can view a list of tours they have booked.

## Installation

To get a local copy up and running, follow these steps.

### Prerequisites

- Node.js
- MongoDB
- npm (Node Package Manager)

### Installation Steps

1. **Clone the repository**

   ```sh
   git clone https://github.com/smithCoders/tour-management
   ```
