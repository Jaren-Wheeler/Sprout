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



Page 1: Today

Contains:

top bar with date and previous or next day navigation

calorie summary card

macro summary card

breakfast section

lunch section

dinner section

snacks section

add food button

quick access to saved foods

Page 2: Trends

Contains:

weight over time

calories over time

maybe protein over time later

Add Food modal or panel

Contains:

search bar

search results

select food

nutrition autofill

quantity

meal

custom food toggle

save

Phase 1

Define the diet module pages and navigation

Phase 2

Rebuild the Today page layout properly

Phase 3

Design the Add Food experience

Phase 4

Wire USDA search and autofill into that new Add Food experience

Phase 5

Build Trends page

That is much cleaner than patching the current prototype.

┌──────────────────────────────────────────────┐
│ Header / Diet name / Diet selector           │
├──────────────────────────────────────────────┤
│ Calories │ Macros │ Weight                   │
├──────────────────────────────────────────────┤
│                                              │
│  Food Logging / Daily Log   │ Saved Meals    │
│  (largest area)             │ Presets        │
│                             │                │
│                             │                │
├──────────────────────────────────────────────┤
│ Charts / Trends                               │
│ (weight, macros, calories)                    │
└──────────────────────────────────────────────┘


