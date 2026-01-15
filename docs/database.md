# Sprout – Initial Database Table Drafts

This document contains early logical table drafts for the Sprout application.
These are NOT final SQL implementations.

Purpose:
- Align the team on core entities and relationships
- Serve as a reference before repository and migrations are finalized
- Based on the ERD from the final report

## Implementation Notes (Preliminary)

- Database: PostgreSQL
- Schema defined at a logical level only
- Table creation will be implemented using a migration tool once the backend stack is finalized
- Migration tool (e.g. Prisma, Knex, Flyway, etc.) will be selected after repository setup
- Primary Key Strategy: UUIDs

# Database Schema Draft

---

## Users

**Primary Key**
- `id` 

**Fields**
- `email` (string, unique, not null)
- `password_hash` (string, not null)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Notes**
- Central entity for the system
- Owns all user-specific data across modules

---

## Budget

**Primary Key**
- `id` 

**Foreign Keys**
- `user_id` → `Users.id`

**Fields**
- `name` (string, not null)
- `limit_amount` (decimal, not null)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Notes**
- A user can have multiple budgets
- Budgets group expenses

---

## Expenses

**Primary Key**
- `id` 

**Foreign Keys**
- `user_id` → `Users.id`
- `budget_id` → `Budget.id`

**Fields**
- `amount` (decimal, not null)
- `category` (string, not null)
- `description` (string, optional)
- `expense_date` (date, not null)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Notes**
- Each expense belongs to one budget
- Used for summaries and visualizations

---

## Notes

**Primary Key**
- `id` 

**Foreign Keys**
- `user_id` → `Users.id`

**Fields**
- `title` (string, not null)
- `content` (text, not null)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Notes**
- Simple personal notes
- Search and organization handled at application level

---

## CalendarEvent

**Primary Key**
- `id` 

**Foreign Keys**
- `user_id` → `Users.id`

**Fields**
- `title` (string, not null)
- `description` (string, optional)
- `start_time` (timestamp, not null)
- `end_time` (timestamp, not null)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Notes**
- Represents scheduled events
- Supports reminders and calendar views

---

## FitnessInfo

**Primary Key**
- `id` 

**Foreign Keys**
- `user_id` → `Users.id`

**Fields**
- `current_weight` (decimal, optional)
- `goal_weight` (decimal, optional)
- `calorie_goal` (integer, optional)
- `updated_at` (timestamp)

**Notes**
- Stores high-level fitness metrics
- One-to-one relationship with Users

---

## Workout

Primary Key:
- id

Foreign Keys:
- user_id → Users.id

Fields:
- name (string, not null)
- notes (text, optional)
- created_at (timestamp)
- updated_at (timestamp)

Notes:
- Represents a reusable workout template
- Used by the workout builder feature
- Exercises, sets, and performance tracking handled via related tables in future iterations

---

## Diet

Primary Key:
- id

Foreign Keys:
- user_id → Users.id

Fields:
- name (string, not null)
- description (text, optional)
- created_at (timestamp)
- updated_at (timestamp)

Notes:
- Represents a diet plan or nutritional template
- Acts as a container for future nutrition data
- Calorie targets, macros, images, and meal breakdowns will be added via related tables

---

## ChatbotMessages

**Primary Key**
- `id`

**Foreign Keys**
- `user_id` → `Users.id`

**Fields**
- `sender` (enum: `user` | `bot`)
- `message` (text, not null)
- `created_at` (timestamp)

**Notes**
- Stores AI interaction history
- Used for context and future AI improvements

---

## Future Expansion 

The following concepts are anticipated but intentionally excluded from v1:
- Exercise library
- Workout performance tracking
- Diet logging and nutrition breakdown
- Media storage for expenses and possibly meals/diet

These will be added iteratively as feature behavior is finalized.