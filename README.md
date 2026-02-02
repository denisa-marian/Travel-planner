# Travel-planner

## 1. Introduction

**TravelPlanner** is a web application that helps tourists plan their visits in a smart and intuitive way.  
The user selects a location on an interactive map, applies filters (budget and guided / non-guided preference), and the system displays and recommends suitable excursions.

### 1.1 Purpose

The purpose of this project is to provide a simple interface for discovering excursions in a geographical area, quickly comparing them, and making a reservation.  
The application also includes a dedicated area for excursion management.

### 1.2 Target Audience

- **Tourists** who want to find excursions/activities in a city and filter them quickly.
- **Administrator (operator)** who manages the excursion catalog.

---

## 2. Objectives and Features

Main objectives include:

- Selecting a tourist location using an interactive map.
- Choosing the excursion type (guided / non-guided) and setting a maximum budget.
- Displaying available excursions in the selected area with relevant details (price, duration, guide).
- Automatic recommendations through sorting (rating and popularity).
- Managing favorite excursions and making reservations.
- Excursion administration (add, delete) for the Administrator role.

### 2.1 Roles

- **User**: tourist who explores, saves favorites, and books excursions.
- **Administrator**: adds and removes excursions from the system.
- **System**: applies filtering and sorting logic for recommendations.

---

## 3. Requirements

### 3.1 Functional Requirements

1. The user can select a city on the map to view excursions in that area.
2. The user can filter excursions by maximum budget, guided / non-guided option, and search text.
3. The system can sort excursions by:
   - *Recommended* (rating and number of reviews),
   - price,
   - rating.
4. The user can view complete excursion details (description, gallery, location).
5. An authenticated user can add or remove excursions from the favorites list.
6. An authenticated user can create a reservation by selecting the date and number of people.
7. The administrator can add new excursions and delete existing ones.
8. The system handles authentication (login/logout) and registration.

### 3.2 Non-Functional Requirements

- **Performance**: excursion list loading and filtering should be fast (client-side filtering for the prototype).
- **Usability**: clear interface with simple navigation between pages.
- **Security**: actions like favorites and reservations are available only to authenticated users; administration only for admin role.
- **Portability**: web application runnable on modern browsers.

---

## 4. Architecture and Technologies

### 4.1 Overall Architecture

The application is structured as a web frontend that communicates via REST APIs with a backend  
(authentication services, excursions, favorites, reservations).  
This project focuses mainly on the UI layer and filtering/sorting logic.

### 4.2 Technologies Used

- **React + TypeScript** (SPA application)
- **React Router** (page routing)
- **Axios** (HTTP requests to backend via service modules)
- **Leaflet + react-leaflet** (interactive map)
- **Swiper** (photo gallery slider)
- **Lucide React** (icons)
- **Modular CSS** (separate `.css` files per component/page)

### 4.3 Application Structure (Frontend)

Main components/pages:

- **Navbar** – navigation and login/register/logout actions
- **Home** – filters + map + recommended/filtered excursions list
- **ExcursionDetails** – excursion details, gallery, map, reservation, favorites
- **Favorites** – user’s saved excursions
- **AdminPanel** – add/delete excursions (admin role)
- **Login / Register** – authentication and account creation

---

## 5. Filtering and Recommendation Logic

### 5.1 Geographic Filtering

After selecting a city on the map, the application filters excursions located near the selected coordinates.  
In the prototype, a simple absolute latitude/longitude difference check is used (approximate “bounding box”).

### 5.2 Preference and Budget Filtering

- Name search (substring, case-insensitive)
- Maximum budget: only excursions with `price <= budget`
- Type: guided / non-guided (or all)

### 5.3 Sorting (Recommendations)

The default **Recommended** mode sorts excursions:
1. Descending by rating
2. If ratings are equal, descending by number of reviews

Alternatively, users can sort by:
- price (ascending / descending)
- rating (descending)

---

## 6. Use Case Flows

### 6.1 Exploration and Filtering

1. The user opens the **Home** page.
2. Selects a city on the map (marker).
3. Applies filters (search, budget, guided/non-guided) and selects a sorting method.
4. The application displays the list of matching excursions.

### 6.2 Viewing Details and Booking

5. The user selects an excursion from the list.
6. Views the description, gallery, and map location.
7. Clicks **“Book now”**, selects date and number of people, and confirms.

### 6.3 Favorites

8. An authenticated user clicks **“Add to favorites”**.
9. On the **Favorites** page, the user can view and remove saved excursions.

### 6.4 Excursion Administration

10. The administrator accesses the **Admin** page.
11. Fills in the form (name, price, duration, coordinates, guide, description, image) and adds a new excursion.
12. Can delete existing excursions.

---

## 7. UI Validations and Interactions

- **Registration**:
  - First name / last name: minimum 2 characters
  - Email: required
  - Password: minimum 8 characters
  - Password confirmation
  - Terms acceptance required
- **Reservation**:
  - Date required
  - Number of people between 1 and 50
  - Contact fields (name, phone) and payment method in UI
- **Access control**:
  - Favorites and reservations require authentication
  - Logout removes the token from storage
 
    <img width="484" height="496" alt="image" src="https://github.com/user-attachments/assets/09daf6a6-761e-47a2-a9a9-703dc04d6d16" />

    <img width="482" height="348" alt="image" src="https://github.com/user-attachments/assets/58503f03-355c-4543-9bd9-db2562a856e7" />

    <img width="724" height="386" alt="image" src="https://github.com/user-attachments/assets/1a417234-8d6b-42b8-979b-02781edf48bb" />

    <img width="673" height="348" alt="image" src="https://github.com/user-attachments/assets/95911618-e0d7-43f1-839e-6b253749a297" />

    <img width="638" height="399" alt="image" src="https://github.com/user-attachments/assets/ad1609f3-7cef-4e7a-9a47-077f9d5ad373" />
    <img width="637" height="166" alt="image" src="https://github.com/user-attachments/assets/08b2ae5f-bc80-469f-aaf1-f8da22838be6" />

    <img width="485" height="610" alt="image" src="https://github.com/user-attachments/assets/ae0d8f8a-8956-4b14-ac83-006328e202bd" />

    <img width="441" height="292" alt="image" src="https://github.com/user-attachments/assets/73c84649-dc03-4ce6-8e82-307f1ef04bb1" />








