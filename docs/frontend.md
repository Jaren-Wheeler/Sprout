## Frontend API Layer

The frontend uses a centralized API wrapper to handle all HTTP communication with the backend.  

### API Client Wrapper

Located in: src/api/client.js


Responsibilities:

- Defines backend base URL
- Attaches JSON headers to requests
- Includes credentials for session-based authentication
- Parses JSON responses
- Handles standardized error responses

All frontend API requests are routed through this wrapper.

---

### Feature-Based API Modules

API endpoints are grouped by feature in separate modules.

Example: src/api/auth.js


Contains:

- `registerUser(email, password)`
- `loginUser(email, password)`

Future API modules will follow the same structure:

src/api/budgets.js
src/api/notes.js
src/api/fitness.js
src/api/chatbot.js


Each module calls the shared `apiFetch` wrapper for HTTP requests.

---

### Usage Example

```js
import { loginUser } from "../api/auth";

const user = await loginUser(email, password);
```






Sprout Diet Feature Audit
Purpose

This document outlines the current behavior, known issues, and architectural concerns in the Sprout Diet feature before refactoring.

The goal is to:

Understand what the system currently does

Identify bugs and inconsistencies

Detect duplicate or conflicting logic

Define a clean architecture for diet tracking

Avoid circular changes between frontend and backend

Current Known Problems
1. Food Amount / Nutrition Calculation Bug
Current Behavior

The "Log Food Item" modal:

Accepts amount in grams

Displays nutrition values

But the displayed nutrition does not correctly scale with the entered amount

Example flow:

Food returned from USDA contains nutrition per X grams

User enters custom grams

System should recalculate macros

Instead the UI displays values inconsistently

Problems

Nutrition values appear tied to original serving size

The UI suggests values are recalculated, but logic is unclear

Confusing user experience

Expected Behavior

If nutrition data is:

Protein: 10g per 100g

And user enters:

Amount: 150g

System should calculate:

Protein = 15g
2. Preset Save Does Not Update UI
Current Behavior

When clicking:

Save Preset

The preset saves to the backend correctly, but:

UI does not update immediately

Presets only appear after:

Refresh

Switching diets

Problems

Missing state update

setItems() or similar state setter likely not called

Breaks consistency with other UI updates

Expected Behavior

After saving a preset:

Preset list should update immediately

Without refresh.

3. Modal Flow is Confusing
Current Behavior

The "Add Food" modal has multiple responsibilities:

Search USDA foods

Display nutrition

Add food to diet

Save presets

But the flow is unclear.

Example issues:

Food search results behave inconsistently

The modal sometimes displays nutrition immediately

Other times it requires user input

The flow between search → select → add → preset is unclear

Problems

The modal is doing too many things at once.

Likely responsibilities currently mixed:

Food search
Food selection
Nutrition display
Amount calculation
Preset creation
Diet item creation
4. Manual Food Entry Exists But Is Not Working
Current State

There is code for:

ManualFoodForm.jsx

But:

It is not fully integrated

It does not work properly

Users cannot easily log foods not in USDA

Expected Behavior

User should be able to choose:

Search Food
OR
Add Manually

Manual mode should allow entering:

Name
Calories
Protein
Carbs
Fat
Sugar
Amount
5. Macro Targets Are Not Implemented
Current UI

The dashboard displays:

Macro Targets
Protein
Carbs
Fat

But:

All values show 0 / 0 g

No backend support exists yet

No UI to set targets

Progress bars are non functional

Missing Pieces

Backend:

proteinTarget
carbTarget
fatTarget

Frontend:

Goal setup UI
Goal editing UI
Macro progress calculation
6. Diet Setup Flow is Poor
Current Experience

When a user has no diets:

The page shows:

No Diets Yet
Create your first diet plan

But:

The page layout becomes awkward

Other UI elements still render

The flow feels unfinished

Problems

No proper first time user experience.

Missing onboarding flow:

Create Diet
Create Fitness Profile
Set Calorie Goal
Set Macro Targets
Start Logging Food
7. State Synchronization Issues

Some parts update in real time:

Adding food
Deleting food

But others do not:

Saving presets
Switching diet data
Macro targets

This suggests:

Possible issues in:

useDiet.js

Or inconsistent usage of:

setState
refetch
local updates
8. Possible Duplication of Logic

Based on folder structure there may be overlapping responsibilities between:

FoodSearch.jsx
AddDietItemModal.jsx
ManualFoodForm.jsx
FoodItem.jsx

Possible problems:

nutrition calculations duplicated

food formatting duplicated

amount calculations duplicated

Needs investigation.

Next Step

Next phase of this audit:

1. Map the architecture

Understand:

DietDashboard
    ↓
useDiet hook
    ↓
Cards / components
    ↓
Food logging modal
2. Inspect state ownership

Where does the source of truth live?

DietDashboard
useDiet
DailyFoodLogCard
AddDietItemModal
3. Review backend schema

Verify:

Diet
DietItem
PresetItem
FitnessInfo

Match frontend expectations.