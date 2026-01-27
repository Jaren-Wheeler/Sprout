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



### I added login suff