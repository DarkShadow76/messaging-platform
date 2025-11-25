# Project Roadmap: Next Steps

This document outlines the remaining tasks to complete the messaging platform project as specified in the PDF.

##  Backend (`message-api`)

The backend is about 70% complete. The remaining tasks are focused on the last API feature, security hardening, and deployment.

- [x] **Implement "Search Contacts" Endpoint**
    - [x] Add a `search(query)` method to `ContactsController` to handle `GET /contacts/search?q=...`.
    - [x] Implement the search logic in `ContactsService` to find contacts by name (e.g., using an `ILIKE` query).
    - [x] Ensure the new endpoint is protected by the `AuthGuard`.

- [x] **Implement Row Level Security (RLS)**
    - [x] In the Supabase dashboard, write and apply a policy for the `contacts` table to ensure users can only read and write their *own* contacts (`user_id = auth.uid()`).
    - [x] Write and apply a policy for the `messages` table so users can only access messages where they are the `sender_id` or the `receiver_id`.
    - [x] Test all backend endpoints to confirm the RLS policies are working as expected.

- [ ] **Deployment**
    - [ ] Create a new "Web Service" project on Render.
    - [ ] Connect it to your GitHub repository.
    - [ ] Configure the environment variables on Render (e.g., `SUPABASE_URL`, `SUPABASE_KEY`, database connection string).
    - [ ] Deploy the application.
    - [ ] Configure a cron job on Render to run every 5 minutes to prevent the free tier service from sleeping.

## Frontend (`message-app`)

The frontend is about 15% complete (foundational setup is done). The next steps involve building the UI and integrating with the backend and Supabase services.

- [x] **Build Authentication UI & Logic**
    - [x] Design and build the UI for the `LoginPage` component using Material-UI (`TextField`, `Button`, `Card`).
    - [x] Implement the form logic to handle user input and call the `supabase.auth.signInWithPassword` function on submit.
    - [x] Display loading states and handle any login errors (e.g., "Invalid credentials").
    - [x] On successful login, the `ProtectedRoute` will automatically redirect the user to the main chat page.
    - [x] Repeat the process for the `SignUpPage` component.

- [x] **Build Core Chat Interface**
    - [x] Design the main `ChatPage` layout (e.g., a sidebar for the contact list and a main area for messages).
    - [x] Create a `ContactList` component that fetches and displays the logged-in user's contacts by calling our backend API (`GET /contacts`).
    - [x] Create a `MessageView` component.
    - [x] When a user clicks on a contact in the `ContactList`, the `MessageView` should fetch and display the message history for that contact (`GET /messages/:contactId`).

- [x] **Implement Real-Time Functionality**
    - [x] In the `MessageView` component, use the Supabase client to subscribe to real-time inserts on the `messages` table.
    - [x] When a new message event is received, update the `MessageView` to display it instantly without needing a page refresh.

- [x] **Implement "Send Message" UI**
    - [x] Add a text input and a "Send" button to the `MessageView`.
    - [x] When the user sends a message, call the `POST /messages` endpoint on our backend API.
    - [x] On success, clear the input field. The real-time subscription should handle displaying the sent message.
