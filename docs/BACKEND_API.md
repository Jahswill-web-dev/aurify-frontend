# Aurify API And Features

Last reviewed: 2026-07-06

## Product Model

The backend is organized around `Study`.

A Study is a user-owned learning container for one focused topic. Generated learning material, glossary terms, practice question sets, exam question sets, attempts, scores, progress, weak areas, analytics, and future audio all belong to a Study.

Current generation flow:

1. User creates a Study.
2. Backend queues search-grounded research-context generation.
3. Worker generates and saves `research_context`.
4. Worker generates and saves a module roadmap in `outline.sections`.
5. Worker creates pending module records from the roadmap.
6. Worker generates module content in batches of 2 modules per AI call.
7. Each generated module contains short lessons targeting about 7 minutes each and adaptive module-end practice questions.
8. Backend assembles ready modules into backward-compatible `material.content` markdown.
9. Study status becomes `material_ready` when all modules are ready, or `module_partial_ready` when at least one module is ready but another module failed.
10. Worker generates glossary terms from saved material, outline, and research context.
11. Study status becomes `glossary_ready`.
12. Worker generates the first whole-study practice question set from saved Study assets.
13. Study status becomes `practice_ready`.
14. Worker generates the first whole-study exam question set from saved Study assets and optional practice weak-area signal.
15. Study status becomes `exam_ready`.

## Frontend Integration Checklist

Recommended frontend flow:

1. Authenticate the user with `POST /signup` or `POST /login`.
2. Store `access_token` and send it as `Authorization: Bearer <access_token>`.
3. Optionally call `GET /me` to hydrate the logged-in user.
4. Call `POST /api/parse-input` with the user's raw learning request.
5. If the parser emits `clarification`, ask the user to choose an option and call `POST /api/parse-input` again with the clarification.
6. If the parser emits `ready`, send that payload directly to `POST /studies`.
7. Poll `GET /studies/{study_id}` until `status` becomes `exam_ready`, `module_partial_ready`, `modules_failed`, or `failed`.
8. When `module_partial_ready`, `material_ready`, or later, call `GET /studies/{study_id}/material` and render any `material.modules[]` entries with `status: "ready"`.
9. Use `GET /studies/{study_id}/progress` for lightweight lesson and module completion refreshes.
10. When `glossary_ready` or later, call `GET /studies/{study_id}/glossary`.
11. When `practice_ready` or later, call `GET /studies/{study_id}/practice-questions` for the latest ready practice set, or use the practice question-set endpoints.
12. When `exam_ready`, call `GET /studies/{study_id}/exam-questions` for the latest ready exam set, or use the exam question-set endpoints.
13. If generation fails or gets stuck, call `POST /studies/{study_id}/generation/resume`.
14. To remove a Study from the user's library, call `DELETE /studies/{study_id}` and remove it from local UI state after a successful response.

Protected endpoints require the bearer token. The parser endpoints under `/api/*` are currently not protected.

Frontend fetch header example:

```js
{
  "Content-Type": "application/json",
  "Authorization": `Bearer ${accessToken}`
}
```

Default local API base URL:

```text
http://localhost:8000
```

CORS currently allows:

- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://www.aurifyai.xyz`
- `https://www.aurifyai.xyz`
- `https://aurifyai.vercel.app`

## Authentication

Protected routes use JWT bearer auth:

```http
Authorization: Bearer <access_token>
```

Frontend token flow:

1. Call `POST /signup`, `POST /login`, or `POST /token`.
2. Store the returned `access_token`.
3. Send `Authorization: Bearer <access_token>` on protected requests.
4. Use `GET /me` to load the current user profile.

The backend also returns a `refresh_token`, but there is no refresh-token exchange endpoint yet. Treat the `access_token` as the token used for authenticated API calls.

Auth response shape:

```json
{
  "access_token": "jwt-access-token",
  "refresh_token": "jwt-refresh-token",
  "token_type": "bearer"
}
```

Token endpoints and payloads:

### `POST /signup`

Creates a user and returns tokens.

Request:

```json
{
  "username": "Ada",
  "email": "ada@example.com",
  "password": "password123"
}
```

Validation:

- `username` is required.
- `email` is required.
- `password` must be 5-24 characters.

Errors:

- `450`: user with this email already exists.

### `POST /login`

Logs in with either email/password or username/password and returns tokens. This endpoint accepts JSON or form data.

JSON request with email:

```json
{
  "email": "ada@example.com",
  "password": "password123"
}
```

JSON request with username:

```json
{
  "username": "Ada",
  "password": "password123"
}
```

Errors:

- `400`: account not found or incorrect password.

### `POST /token`

Logs in with email/password JSON and returns tokens.

Request:

```json
{
  "email": "ada@example.com",
  "password": "password123"
}
```

Errors:

- `451`: account not found or incorrect password.

### Google Auth

- `GET /auth/google`: returns a Supabase Google OAuth URL.
- `GET /google/signup?access_token=<supabase_access_token>`: creates a backend user from Supabase Google auth and returns backend tokens.
- `GET /google/signin?access_token=<supabase_access_token>`: signs in an existing backend user and returns backend tokens.

Google signup/signin expect the frontend to complete the Supabase Google OAuth flow first and pass the Supabase access token to the backend.

Current user endpoints:

- `GET /me`
- `GET /userplan`

### `GET /me`

Protected. Returns the current backend user:

```json
{
  "id": "user-id",
  "email": "ada@example.com",
  "username": "Ada",
  "is_active": true,
  "is_pro": false,
  "limit": 20,
  "image": null
}
```

### `GET /userplan`

Protected. Returns the current user's plan summary:

```json
{
  "id": "user-id",
  "is_pro": false,
  "plan": "Free Plan"
}
```

Authentication errors:

- `401`: token expired.
- `403`: token is missing, invalid, or cannot be validated. For Google auth, exchange the Supabase access token through `/google/signup` or `/google/signin`, then use the backend `access_token` on protected routes.
- `404`: token is valid but user no longer exists.

## Study Creation

### `POST /studies`

Protected. Creates a Study for the current user and queues async generation.

Frontend flow:

1. Call `POST /api/parse-input` with the user's raw learning request.
2. If the parser returns a `clarification` event, show the question/options to the user.
3. Send the selected clarification back to `POST /api/parse-input`.
4. When the parser returns a `ready` event, send the parsed metadata to `POST /studies`.

Parser-to-Study field mapping:

| Parser field | Study field |
| --- | --- |
| `topic` | `topic` |
| `subject` | `subject` |
| `topicType` | `topic_type` |
| `level` | `level` |
| `goal` | `goal` |

`POST /studies` accepts either `topicType` or `topic_type`, so the frontend can send the parser `ready` payload directly. Extra parser-only fields such as `needsClarification` are ignored by the Study create schema.

Request:

```json
{
  "topic": "Photosynthesis",
  "subject": "Biology",
  "topic_type": "level-dependent",
  "level": "High school",
  "goal": "Understand the process clearly",
  "practiceQuestionCount": 10,
  "examQuestionCount": 12
}
```

Only `topic` is required. `practiceQuestionCount` is optional, defaults to `8`, and must be between `5` and `20`. `examQuestionCount` is optional, defaults to `12`, and must be between `5` and `30`.

Response:

```json
{
  "id": "study-id",
  "topic": "Photosynthesis",
  "subject": "Biology",
  "topic_type": "level-dependent",
  "level": "High school",
  "goal": "Understand the process clearly",
  "practice_question_count": 10,
  "exam_question_count": 12,
  "status": "queued",
  "generation_error": null,
  "owner_id": "user-id",
  "created_at": "2026-06-02T00:00:00",
  "updated_at": "2026-06-02T00:00:00",
  "progress": {
    "material_completed": false,
    "practice_completed": false,
    "exam_completed": false,
    "latest_practice_score": null,
    "latest_exam_score": null,
    "aggregate_weak_areas": []
  }
}
```

Generation statuses:

- `queued`
- `generating_research`
- `research_ready`
- `generating_outline`
- `outline_ready`
- `modules_pending`
- `generating_material`
- `module_partial_ready`
- `modules_failed`
- `material_ready`
- `generating_glossary`
- `glossary_ready`
- `generating_practice_questions`
- `practice_ready`
- `generating_exam_questions`
- `exam_ready`
- `failed`

If generation fails before module generation, `generation_error` stores the failure message. If one or more module batches fail after earlier modules succeed, the Study can become `module_partial_ready`; failed module rows expose their own `generation_error` inside `material.modules[]`.

Example frontend request after parsing:

Parser `ready` event:

```json
{
  "needsClarification": false,
  "topic": "Dynamics",
  "subject": "Physics",
  "topicType": "level-dependent",
  "level": "Introductory College Physics",
  "goal": null
}
```

Send to `POST /studies` directly:

```json
{
  "needsClarification": false,
  "topic": "Dynamics",
  "subject": "Physics",
  "topicType": "level-dependent",
  "level": "Introductory College Physics",
  "goal": null
}
```

The response will use the backend Study field name:

```json
{
  "topic_type": "level-dependent"
}
```

## Study Retrieval

### `GET /studies`

Lists Studies owned by the current user.

Protected. Response is an array of Study summary objects:

```json
[
  {
    "id": "study-id",
    "topic": "Dynamics",
    "subject": "Physics",
    "topic_type": "level-dependent",
    "level": "Introductory College Physics",
    "goal": null,
    "status": "material_ready",
    "generation_error": null,
    "owner_id": "user-id",
    "created_at": "2026-06-06T00:00:00",
    "updated_at": "2026-06-06T00:00:00",
    "progress": {
      "material_completed": false,
      "practice_completed": false,
      "exam_completed": false,
      "latest_practice_score": null,
      "latest_exam_score": null,
      "aggregate_weak_areas": []
    }
  }
]
```

### `GET /studies/{study_id}`

Returns Study metadata, generation status, research context, outline, material summary, question counts, progress, and analytics.

When `status` is `module_partial_ready`, `research_context`, `outline`, and `material` should be present, and `material.modules[]` will contain at least one ready module plus one or more failed modules. When `status` is `material_ready`, all modules are ready. When `status` is `glossary_ready`, glossary terms should also be present. When `status` is `practice_ready`, at least one ready whole-study practice question set should be present. When `status` is `exam_ready`, at least one ready whole-study exam question set should also be present.

Protected. Poll this endpoint after `POST /studies` to follow async generation.

Important polling statuses:

- `queued`: Study was created and worker has not started yet.
- `generating_research`: search-grounded research context is being generated.
- `research_ready`: research context is saved.
- `generating_outline`: module roadmap is being generated from research context.
- `outline_ready`: outline is saved.
- `modules_pending`: module roadmap has been saved and pending module records were created.
- `generating_material`: module lessons and module-end practice are being generated in 2-module batches.
- `module_partial_ready`: at least one module is ready, but one or more module batches failed. Render ready modules and offer resume.
- `modules_failed`: no module content could be generated. Offer resume.
- `material_ready`: all module content is saved and ready to display.
- `generating_glossary`: glossary terms are being generated from saved Study assets.
- `glossary_ready`: glossary is saved and ready to display.
- `generating_practice_questions`: practice questions are being generated from saved Study assets.
- `practice_ready`: practice questions are saved and ready for practice mode.
- `generating_exam_questions`: exam questions are being generated from saved Study assets.
- `exam_ready`: exam questions are saved and ready for exam mode.
- `failed`: generation stopped; show `generation_error` and offer resume.

Example failed state:

```json
{
  "id": "study-id",
  "status": "failed",
  "generation_error": "Study outline is required before material generation"
}
```

### `DELETE /studies/{study_id}`

Protected. Permanently deletes a Study owned by the current user.

This removes the Study container and its generated learning data, including research context, outline, material, modules, lessons, module practice, whole-study practice and exam question sets, attempts, progress, weak areas, and analytics data tied to that Study.

Frontend fetch example:

```js
const response = await fetch(`${API_BASE_URL}/studies/${studyId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});

const result = await response.json();
```

Success:

- `200 OK`: delete succeeded.

Response:

```json
{
  "deleted": true,
  "study_id": "study-id"
}
```

Frontend behavior after success:

- Treat `response.ok` plus `result.deleted === true` as success.
- Remove the Study from the local Study list immediately.
- If the user is currently inside the deleted Study workspace, navigate back to the Study library/dashboard.
- Stop polling `GET /studies/{study_id}` for that Study.

Errors:

- `401`: access token expired.
- `403`: bearer token is missing, invalid, or cannot be validated.
- `404`: Study does not exist or is not owned by the current user.

Deletion is permanent. The backend does not currently provide restore/archive behavior and does not cancel already-running background generation jobs. If a background worker later tries to save data for the deleted Study, the missing Study is ignored instead of recreating it.

Implementation note for frontend API helpers: this endpoint returns JSON on success so generic helpers that call `response.json()` do not misclassify a successful delete as a failed request.

### `POST /studies/{study_id}/generation/resume`

Protected. Resumes generation for an existing Study and continues down to `exam_ready`.

Use this after failed or interrupted generation when the frontend does not want to decide which stage-specific recovery endpoint to call. Normal Study creation still uses `POST /studies`, which already runs the full pipeline automatically.

Resume behavior:

- No `research_context`: queue full generation from research through exam-ready assets.
- Has `research_context` but no `outline`: queue resume generation from module roadmap onward.
- Has `research_context` and `outline` but no modules: create pending module records and queue module generation.
- Has pending or failed modules: queue generation for only unfinished modules, then rebuild `material.content`.
- Has `material` but no glossary: queue glossary generation.
- Has glossary but no practice questions: queue practice question generation, then exam generation.
- Has practice questions but no exam questions: queue exam question generation.
- Has practice questions and exam questions: queue nothing and normalize status to `exam_ready`.

Returns the updated Study metadata immediately.

Response examples:

- If research is missing: `status` becomes `generating_research`.
- If outline is missing: `status` becomes `generating_outline`.
- If module material is missing or partially failed: `status` becomes `generating_material`.
- If material exists but glossary is missing: `status` becomes `generating_glossary`.
- If glossary exists but practice questions are missing: `status` becomes `generating_practice_questions`.
- If practice questions exist but exam questions are missing: `status` becomes `generating_exam_questions`.
- If exam questions already exist: `status` becomes `exam_ready`.

### `GET /studies/{study_id}/research-context`

Protected. Returns generated search-grounded research context:

```json
{
  "id": "research-id",
  "study_id": "study-id",
  "title": "Dynamics in Introductory College Physics",
  "summary": "Dynamics explains motion by analyzing forces and Newton's laws.",
  "key_concepts": ["Newton's laws", "free-body diagrams", "net force", "friction"],
  "prerequisites": ["vectors", "basic kinematics", "algebra"],
  "learning_objectives": ["Draw free-body diagrams", "Apply Newton's second law"],
  "common_misconceptions": ["Confusing mass and weight"],
  "examples_to_include": ["inclined plane", "elevator force problem"],
  "source_notes": "Search-grounded overview of standard introductory physics coverage.",
  "sources": [
    {
      "title": "source title",
      "url": "https://example.com",
      "summary": "Short source relevance note"
    }
  ],
  "created_at": "2026-06-03T00:00:00",
  "updated_at": "2026-06-03T00:00:00"
}
```

Returns `404` if research context has not been generated yet.

### `GET /studies/{study_id}/outline`

Protected. Returns the generated Study module roadmap. The response still uses the existing `sections` field for compatibility, but each item now represents a module rather than a long material section:

```json
{
  "id": "outline-id",
  "study_id": "study-id",
  "title": "Dynamics Learning Outline",
  "overview": "A learning path from force concepts to applied Newton's law problems.",
  "sections": [
    {
      "module_number": 1,
      "title": "Forces And Free-Body Diagrams",
      "objective": "Identify forces acting on an object and represent them clearly.",
      "key_concepts": ["contact forces", "weight", "normal force", "net force"],
      "estimated_lesson_count": 3,
      "estimated_minutes": 21,
      "dependencies": [],
      "coverage_notes": "Introduce force types and free-body diagrams before Newton's laws."
    }
  ],
  "source_notes": "Built from the saved search-grounded research context.",
  "created_at": "2026-06-05T00:00:00",
  "updated_at": "2026-06-05T00:00:00"
}
```

Returns `404` if the outline has not been generated yet.

### `POST /studies/{study_id}/outline/generate`

Protected. Queues outline generation for an existing Study using its saved `research_context`.

Use this when a Study already exists and has research context, but the outline is missing or needs to be regenerated. This does not recreate the Study and does not require generating material first.

Response:

```json
{
  "id": "study-id",
  "topic": "Dynamics",
  "subject": "Physics",
  "topic_type": "level-dependent",
  "level": "Introductory College Physics",
  "goal": null,
  "status": "generating_outline",
  "generation_error": null,
  "owner_id": "user-id",
  "created_at": "2026-06-05T00:00:00",
  "updated_at": "2026-06-05T00:00:00",
  "progress": {
    "material_completed": false,
    "practice_completed": false,
    "exam_completed": false,
    "latest_practice_score": null,
    "latest_exam_score": null,
    "aggregate_weak_areas": []
  }
}
```

Returns `404` if the Study is not owned by the current user or if no `research_context` exists yet.

### `GET /studies/{study_id}/material`

Protected. Returns generated Study material.

- title
- outline module titles
- source notes
- formatted learning content assembled from ready modules
- structured `modules[]` with lessons and module-end practice questions

This may return `404` while the Study is only at `outline_ready` or `modules_pending`.

Example:

```json
{
  "id": "material-id",
  "study_id": "study-id",
  "title": "Dynamics Learning Material",
  "outline": ["Forces And Free-Body Diagrams", "Newton's Laws"],
  "source_notes": "Built from the saved search-grounded research context.",
  "content": "## Module 1: Forces And Free-Body Diagrams\n\n### Contact Forces\n\nLet's make contact forces easy to picture...\n\n### What you'll learn\n- What contact forces are\n- How to spot them\n\n🟢 Definition\nA contact force happens when two objects touch.\n\n🔵 Example\nA table pushes up on a book resting on it.\n\n### Simple illustration\nBook -> touches table -> table pushes back\n\n🟡 Remember\nIf the objects must touch, it is a contact force.\n\n🔴 Common mistake\nGravity is not a contact force because objects do not need to touch.\n\n### Quick recap\n- Contact forces require touch.\n- Normal force is a common contact force.",
  "modules": [
    {
      "id": "module-id",
      "study_id": "study-id",
      "module_number": 1,
      "title": "Forces And Free-Body Diagrams",
      "objective": "Identify forces acting on an object and represent them clearly.",
      "status": "ready",
      "estimated_minutes": 21,
      "generation_error": null,
      "key_concepts": ["contact forces", "weight", "normal force", "net force"],
      "dependencies": [],
      "coverage_notes": "Introduce force types and free-body diagrams before Newton's laws.",
      "practice_coverage_reason": "Covers all three lesson objectives and one common misconception.",
      "lessons": [
        {
          "id": "lesson-id",
          "lesson_number": 1,
          "title": "Contact Forces",
          "content": "Let's make contact forces easy to picture...\n\n### What you'll learn\n- What contact forces are\n- How to spot them\n\n🟢 Definition\nA contact force happens when two objects touch.\n\n🔵 Example\nA table pushes up on a book resting on it.\n\n### Simple illustration\nBook -> touches table -> table pushes back\n\n🟡 Remember\nIf the objects must touch, it is a contact force.\n\n🔴 Common mistake\nGravity is not a contact force because objects do not need to touch.\n\n### Quick recap\n- Contact forces require touch.\n- Normal force is a common contact force.",
          "estimated_minutes": 7,
          "key_takeaways": ["Contact forces happen when objects touch."]
        }
      ],
      "practice_questions": [
        {
          "id": "module-question-id",
          "question": "Which force requires physical contact?",
          "options": ["Normal force", "Gravity", "Magnetic force", "Electric force"],
          "correct_answer": "Normal force",
          "explanation": "A normal force is a contact force between touching surfaces.",
          "difficulty": "easy",
          "weak_area": "contact forces",
          "source_lesson": "Contact Forces"
        }
      ]
    }
  ],
  "created_at": "2026-06-06T00:00:00",
  "updated_at": "2026-06-06T00:00:00"
}
```

Frontend rendering notes:

- Use `modules[]` for the new study experience.
- Render modules in ascending `module_number`.
- Render only modules with `status: "ready"` as studyable content.
- If a module has `status: "failed"`, show a retry/resume affordance and call `POST /studies/{study_id}/generation/resume`.
- Each lesson is designed for about 7 minutes of study.
- Each lesson includes a `progress` object in material/detail responses.
- Each module includes derived `progress` with completed lesson count, total lesson count, percent complete, and completion status.
- `lesson.content` is markdown intended for direct lesson rendering. It uses short paragraphs, headings, bullets, and color-coded callout labels: `🟢 Definition`, `🔵 Example`, `🟡 Remember`, and `🔴 Common mistake`.
- The color-coded callout labels are stable display hooks. The frontend can render them as plain markdown text immediately or map them to styled callout components.
- Simple illustrations are text-based inside `lesson.content`, such as analogies, small flows, compact tables, or ASCII-style diagrams.
- Module `practice_questions[]` are for immediate module-end reinforcement and include answers/explanations.
- Whole-study practice and exam endpoints still exist separately and should be used for full-study assessment flows.

## Lesson And Module Progress

Lesson and module progress is backend-only in this API phase. The frontend can consume the fields and endpoints below when ready.

Progress rules:

- A lesson is fully completed after the learner clicks complete and submits the lesson practice answer.
- The submitted answer does not need to be correct for the lesson to count as completed.
- Wrong answers still return the correct answer and explanation so the frontend can show immediate feedback.
- A module is complete when all lessons in that module are complete.
- Whole-study practice and exam attempts are unchanged and remain separate from lesson practice.

### `GET /studies/{study_id}/progress`

Protected. Returns lightweight derived progress for the Study:

```json
{
  "study_id": "study-id",
  "completed_lessons": 1,
  "total_lessons": 3,
  "completed_modules": 0,
  "total_modules": 1,
  "percent_complete": 33.33,
  "modules": [
    {
      "module_id": "module-id",
      "completed_lessons": 1,
      "total_lessons": 3,
      "percent_complete": 33.33,
      "completed": false,
      "lessons": [
        {
          "lesson_id": "lesson-id",
          "content_completed": true,
          "practice_completed": true,
          "completed": true,
          "status": "completed",
          "last_question_id": "module-question-id",
          "last_answer": "selected answer",
          "last_is_correct": false,
          "last_weak_area": "concept area"
        }
      ]
    }
  ]
}
```

Lesson progress statuses:

- `not_started`: user has not clicked complete for the lesson.
- `practice_pending`: user clicked complete, but has not submitted the lesson practice answer.
- `completed`: user submitted the lesson practice answer.

### `POST /studies/{study_id}/lessons/{lesson_id}/complete`

Protected. Marks lesson content as completed and returns the practice question for that lesson.

Response:

```json
{
  "lesson": {
    "lesson_id": "lesson-id",
    "content_completed": true,
    "practice_completed": false,
    "completed": false,
    "status": "practice_pending"
  },
  "module": {
    "module_id": "module-id",
    "completed_lessons": 0,
    "total_lessons": 3,
    "percent_complete": 0,
    "completed": false
  },
  "practice_question": {
    "id": "module-question-id",
    "lesson_id": "lesson-id",
    "question": "Which option is correct?",
    "options": ["A", "B", "C", "D"],
    "correct_answer": "A",
    "explanation": "A is correct because...",
    "difficulty": "easy",
    "weak_area": "concept area",
    "source_lesson": "Lesson title"
  }
}
```

The endpoint returns `404` if the lesson is not owned by the current user through the Study, or if no lesson practice question can be matched. Existing generated studies can still match questions by `source_lesson` when `lesson_id` is missing.

### `POST /studies/{study_id}/lessons/{lesson_id}/practice-attempt`

Protected. Submits one answer for the lesson practice question, grades it, stores the latest result, and marks the lesson fully completed.

Request:

```json
{
  "question_id": "module-question-id",
  "answer": "selected option text"
}
```

Wrong-answer response:

```json
{
  "feedback": {
    "question_id": "module-question-id",
    "question": "Which option is correct?",
    "selected_answer": "B",
    "correct_answer": "A",
    "is_correct": false,
    "explanation": "A is correct because...",
    "difficulty": "easy",
    "weak_area": "concept area"
  },
  "lesson": {
    "lesson_id": "lesson-id",
    "content_completed": true,
    "practice_completed": true,
    "completed": true,
    "status": "completed",
    "last_is_correct": false
  },
  "module": {
    "module_id": "module-id",
    "completed_lessons": 1,
    "total_lessons": 3,
    "percent_complete": 33.33,
    "completed": false
  },
  "study_progress": {
    "study_id": "study-id",
    "completed_lessons": 1,
    "total_lessons": 3,
    "percent_complete": 33.33
  }
}
```

Errors:

- `400`: submitted question does not belong to the lesson.
- `404`: Study, lesson, or lesson practice question was not found for the current user.

### `POST /studies/{study_id}/material/generate`

Protected. Queues material generation for an existing Study using its saved `research_context` and `outline`.

Material generation does not use live search. The worker creates pending module records from the saved roadmap, generates module lesson/practice content in batches of 2 modules per AI call, saves each generated module separately, then rebuilds `StudyMaterial.content` from the ready modules.

Response status is immediately set to `generating_material`; after material is saved, the worker continues into glossary, practice question set, and exam question set generation and finishes at `exam_ready`.

Returns `404` if the Study is not owned by the current user, if no `research_context` exists, or if no `outline` exists.

### `GET /studies/{study_id}/glossary`

Protected. Returns generated glossary terms for the Study. Use this for a glossary drawer, side panel, "terms to know" tab, or inline term helper.

This endpoint is separate from `GET /studies/{study_id}` so the Study detail response stays lightweight.

Example:

```json
{
  "id": "glossary-id",
  "study_id": "study-id",
  "terms": [
    {
      "term": "Chlorophyll",
      "definition": "A green pigment that absorbs light energy for photosynthesis.",
      "simple_explanation": "Chlorophyll helps plants catch light from the sun.",
      "analogy": "It works like a solar panel collecting sunlight.",
      "why_it_matters": "It explains how plants begin turning light into usable energy.",
      "section": "Light Reactions",
      "difficulty": "basic"
    }
  ],
  "source_notes": "Terms selected from the saved study material.",
  "created_at": "2026-06-08T00:00:00",
  "updated_at": "2026-06-08T00:00:00"
}
```

Returns `404` if the glossary has not been generated yet.

### `GET /studies/{study_id}/practice-questions`

Protected. Returns practice questions for the latest ready practice question set.

Practice mode returns `correct_answer` and `explanation` so the frontend can give immediate local feedback without calling the backend for every answered question.

### `GET /studies/{study_id}/exam-questions`

Protected. Returns exam questions for the latest ready exam question set.

Exam mode does not return `correct_answer` or `explanation` before submission.

Question response:

```json
{
  "id": "question-id",
  "study_id": "study-id",
  "question_set_id": "question-set-id",
  "question": "What is photosynthesis?",
  "options": ["A", "B", "C", "D"],
  "correct_answer": "A",
  "explanation": "Explanation text",
  "difficulty": "easy",
  "weak_area": "core concept",
  "source_section": "Light Reactions"
}
```

The correct answer is intentionally returned for practice questions. Exam questions hide answers and explanations until exam submission.

`source_section` is the roadmap module or material area the whole-study question tests. Use it to group questions in the UI, show coverage labels, or explain why a new set feels different from previous sets.

## Question Sets

Practice and exam questions are grouped into question sets. The first practice and exam sets are generated automatically during Study generation. The frontend can generate more sets later without deleting old ones.

New question sets use saved prior questions and roadmap/module coverage as prompt context so the AI is encouraged to avoid repeating existing questions and to prioritize under-covered areas. This is prompt-level duplicate reduction, not a hard duplicate blocker.

Module practice questions are separate from these whole-study question sets. They are returned inside `material.modules[].practice_questions` and are meant to test what the learner just studied in that module.

### Practice question sets

List practice sets:

```http
GET /studies/{study_id}/practice-question-sets
```

Generate a new practice set:

```http
POST /studies/{study_id}/practice-question-sets/generate
```

Request:

```json
{
  "title": "Practice Set 2",
  "questionCount": 10
}
```

`title` is optional. `questionCount` is optional and must be between `5` and `30`; if omitted, the Study's default `practice_question_count` is used.

Response:

```json
{
  "id": "question-set-id",
  "study_id": "study-id",
  "mode": "practice",
  "title": "Practice Set 2",
  "question_count": 10,
  "generated_question_count": 0,
  "status": "queued",
  "generation_error": null,
  "created_at": "2026-06-08T00:00:00",
  "updated_at": "2026-06-08T00:00:00"
}
```

After creating a set, poll `GET /studies/{study_id}/practice-question-sets` until that set has `status: "ready"` or `status: "failed"`.

Fetch questions for a specific practice set:

```http
GET /studies/{study_id}/practice-question-sets/{question_set_id}/questions
```

Practice set questions include `correct_answer` and `explanation`.

### Exam question sets

List exam sets:

```http
GET /studies/{study_id}/exam-question-sets
```

Generate a new exam set:

```http
POST /studies/{study_id}/exam-question-sets/generate
```

Request:

```json
{
  "title": "Exam Set 2",
  "questionCount": 15
}
```

`title` is optional. `questionCount` is optional and must be between `5` and `30`; if omitted, the Study's default `exam_question_count` is used.

Response shape is the same as practice sets, with `"mode": "exam"`.

Fetch questions for a specific exam set:

```http
GET /studies/{study_id}/exam-question-sets/{question_set_id}/questions
```

Exam set questions hide `correct_answer` and `explanation` until submission.

Question set statuses:

- `queued`: set was created and generation is waiting.
- `generating`: set generation is running.
- `ready`: questions are saved and ready to display.
- `failed`: set generation failed; show `generation_error` and allow retry by creating another set.

Frontend notes:

- Existing question sets are preserved.
- The latest ready set is returned by the legacy `/practice-questions` and `/exam-questions` endpoints.
- On-demand set generation updates the question set status but should not reset the whole Study lifecycle status.
- Keep practice and exam set UIs separate; prior practice questions only guide new practice generation, and prior exam questions only guide new exam generation.

## Attempts And Analytics

### `POST /studies/{study_id}/practice-attempts`

Protected. Submits practice answers and updates Study progress.

### `POST /studies/{study_id}/exam-attempts`

Protected. Submits exam answers and updates scores, completion state, weak areas, and analytics.

Exam attempt responses include review feedback after submission, including correct answers and explanations.

Request:

```json
{
  "answers": [
    {
      "question_id": "question-id",
      "answer": "selected option text"
    }
  ]
}
```

Response:

```json
{
  "id": "attempt-id",
  "study_id": "study-id",
  "answers": [
    {
      "question_id": "question-id",
      "answer": "selected option text"
    }
  ],
  "score": 75.0,
  "total_questions": 4,
  "correct_count": 3,
  "weak_areas": ["concept area"],
  "feedback": [
    {
      "question_id": "question-id",
      "question": "What is photosynthesis?",
      "selected_answer": "B",
      "correct_answer": "A",
      "is_correct": false,
      "explanation": "Explanation text",
      "difficulty": "easy",
      "weak_area": "core concept"
    }
  ],
  "created_at": "2026-06-02T00:00:00"
}
```

Errors:

- `400`: submitted `question_id` does not belong to the Study.
- `404`: Study not found or not owned by the current user.

## Payments

### `GET /upgrade-plan/`

Protected. Creates a Lemon Squeezy order for the current user's email and returns the payment provider response.

The exact response shape comes from Lemon Squeezy through `aurify_api/services/payments.py`.

## Learning Parser

The learning parser is the first frontend step before creating a Study. It turns a raw user request into structured Study metadata and asks for one clarification when the request is too broad.

Parser endpoints:

- `POST /api/parse-input`
- `POST /api/generate`

Use `POST /api/parse-input` for topic clarification before creating a Study. `POST /api/generate` is a preview-style streaming material endpoint; persisted learning workflows should use `/studies`.

These parser/preview endpoints are currently public and do not require `Authorization`.

### `POST /api/parse-input`

Returns `text/event-stream`, not normal JSON. The frontend should listen for SSE events:

- `clarification`: show a question/options UI and wait for the user to choose.
- `ready`: create a Study using the returned metadata.
- `error`: show the message and allow retry.
- `done`: the stream is finished.

Because this is SSE, the frontend should parse events by `event:` name and JSON-decode each `data:` payload.

Initial request:

```json
{
  "input": "I need help with dynamics"
}
```

Possible clarification response:

```text
event: clarification
data: {"needsClarification": true, "topic": "Dynamics", "subject": "Physics", "topicType": "level-dependent", "clarificationQuestion": "Which academic level of Dynamics in Physics are you studying?", "clarificationType": "level", "options": ["High School Physics", "Introductory College Physics", "Advanced Undergraduate Physics"], "fallback": "Introductory College Physics"}

event: done
data: {}
```

Frontend behavior:

1. Display `clarificationQuestion`.
2. Render `options` as selectable choices.
3. Optionally show or auto-use `fallback` if the user is unsure.
4. Send the user's selected value back as `clarification.value`.

Clarified request:

```json
{
  "input": "I need help with dynamics",
  "clarification": {
    "type": "level",
    "value": "Introductory College Physics"
  }
}
```

Possible ready response:

```text
event: ready
data: {"needsClarification": false, "topic": "Dynamics", "subject": "Physics", "topicType": "level-dependent", "level": "Introductory College Physics", "goal": null}

event: done
data: {}
```

The frontend should then create a Study using this `ready` metadata. `POST /studies` accepts the parser's `topicType` field directly.

### `POST /api/generate`

Preview-only streaming generation endpoint. It does not save a Study or persist material.

Request:

```json
{
  "topic": "Dynamics",
  "subject": "Physics",
  "topicType": "level-dependent",
  "level": "Introductory College Physics",
  "goal": null
}
```

Returns `text/event-stream` events:

- `status`: generation step started or finished.
- `content`: streamed text chunk for a step.
- `error`: error message.
- `done`: stream finished.

Persisted learning workflows should use `/studies`, not this endpoint.

### Clarification Types

The current backend supports one clarification per parser request:

```json
{
  "clarification": {
    "type": "level",
    "value": "High School Physics"
  }
}
```

Supported `clarification.type` values:

- `level`: used for level-dependent topics such as physics, calculus, biology, grammar, or algebra.
- `goal`: used for concept-native topics such as Bubble Sort, Docker, React Hooks, public speaking, or certification preparation.

For now, ask one best clarification question before creating a Study. Multi-question clarification can be added later as an iterative flow.

### Parser Scenarios

Vague level-dependent topic:

```json
{
  "input": "I need help with physics"
}
```

Expected behavior: returns `clarification` asking for academic level.

Concept-native topic without goal:

```json
{
  "input": "I want to learn bubble sort"
}
```

Expected behavior: returns `clarification` asking for learning goal.

Enough context:

```json
{
  "input": "Explain calculus limits for a college engineering student"
}
```

Expected behavior: returns `ready`.

Professional certification:

```json
{
  "input": "Prepare me for AWS Solutions Architect exam"
}
```

Expected behavior: returns `ready` with a concept-native topic and exam-prep goal.

## Removed Features

Legacy audiobook, PDF-to-audio, audio download, and audio worker endpoints are removed from the active backend. Future audio should be modeled as a Study child feature.
