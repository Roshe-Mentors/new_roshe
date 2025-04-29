# Database Schema Overview

The following is a complete, up‑to‑date overview of every table and column in the Supabase schema.

## 1. Users

- user_id (uuid, PK, NOT NULL)
- created_at (timestamp with time zone, NOT NULL)
- name (text, nullable)
- linkedin (text, nullable)
- dob (date, nullable)

## 2. availability

- id (uuid, PK, NOT NULL)
- mentor_id (uuid, NOT NULL)
- start_time (timestamp with time zone, NOT NULL)
- status (text, NOT NULL)
- created_at (timestamp with time zone, nullable)
- end_time (timestamp with time zone, NOT NULL)
- updated_at (timestamp with time zone, nullable)

## 3. bookings

- id (uuid, PK, NOT NULL)
- mentor_id (text, NOT NULL)
- mentor_name (text, nullable)
- mentor_email (text, nullable)
- user_id (text, NOT NULL)
- user_email (text, nullable)
- date (text, nullable)
- time (text, nullable)
- booking_date (text, nullable)
- booking_time (text, nullable)
- session_type (text, NOT NULL)
- meeting_id (text, NOT NULL)
- meeting_url (text, NOT NULL)
- password (text, nullable)
- meeting_password (text, nullable)
- status (text, nullable)
- created_at (timestamp with time zone, nullable)
- updated_at (timestamp with time zone, nullable)
- slot_id (uuid, nullable)

## 4. expertise_tags

- id (uuid, PK, NOT NULL)
- name (text, NOT NULL)
- created_at (timestamp with time zone, NOT NULL)

## 5. mentees

- id (uuid, PK, NOT NULL)
- user_id (uuid, nullable)
- name (text, nullable)
- email (text, NOT NULL)
- dob (date, nullable)
- created_at (timestamp with time zone, nullable)
- linkedin (text, nullable)
- biography (text, nullable)
- linkedin_url (text, NOT NULL)
- date_of_birth (date, nullable)
- role (text, NOT NULL)
- profile_image_url (text, nullable)
- bio (text, nullable)
- location (text, nullable)
- company (text, nullable)
- specialization (text, nullable)
- years_experience (integer, nullable)

## 6. mentor_calendar_oauth

- id (uuid, PK, NOT NULL)
- mentor_id (uuid, NOT NULL)
- provider (text, NOT NULL)
- access_token (text, NOT NULL)
- refresh_token (text, NOT NULL)
- expires_at (timestamp with time zone, NOT NULL)
- created_at (timestamp with time zone, NOT NULL)

## 7. mentor_expertise

- mentor_id (uuid, NOT NULL)
- tag_id (uuid, NOT NULL)
- created_at (timestamp with time zone, NOT NULL)

## 8. mentor_reviews

- id (uuid, PK, NOT NULL)
- mentor_id (uuid, nullable)
- mentee_id (uuid, nullable)
- session_id (uuid, nullable)
- rating (integer, NOT NULL)
- feedback (text, nullable)
- created_at (timestamp with time zone, nullable)

## 9. mentor_social_links

- id (uuid, PK, NOT NULL)
- mentor_id (uuid, NOT NULL)
- platform (text, NOT NULL)
- url (text, NOT NULL)
- created_at (timestamp with time zone, NOT NULL)

## 10. mentoring_sessions

- id (uuid, PK, NOT NULL)
- mentor_id (uuid, nullable)
- mentee_id (uuid, nullable)
- status (text, NOT NULL)
- start_time (timestamp with time zone, nullable)
- end_time (timestamp with time zone, nullable)
- cancelled_at (timestamp with time zone, nullable)
- created_at (timestamp with time zone, nullable)
- title (text, nullable)
- meeting_link (text, nullable)
- cancellation_reason (text, nullable)
- description (text, nullable)

## 11. mentors

- id (uuid, PK, NOT NULL)
- user_id (uuid, nullable)
- name (text, nullable)
- dob (date, nullable)
- created_at (timestamp with time zone, nullable)
- linkedin (text, nullable)
- biography (text, nullable)
- linkedin_url (text, NOT NULL)
- date_of_birth (date, nullable)
- email (text, NOT NULL)
- role (text, NOT NULL)
- location (text, nullable)
- company (text, nullable)
- sessions_completed (integer, nullable)
- reviews_count (integer, nullable)

---
