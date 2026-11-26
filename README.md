# MindCare – AI Wellness Chatbot

**MindCare** is a modern, empathetic, conversational AI wellness chatbot web application designed for everyday mental wellness, emotional support, and mindfulness reflection. It empowers users (such as students dealing with academic pressure, daily stress, or emotional fatigue) to communicate naturally in both **English and Hinglish**.

MindCare is built with a decoupled modern architecture: a **React + Tailwind CSS** frontend styled with soft lavender and pastel pink aesthetics, backed by a **FastAPI** Python backend powered by the **Google Gemini API** with an independent safety intervention layer.

---

## 🌟 Key Features

### 1. Conversational AI Companion
- **Real Gemini Integration**: Powered by Google Gemini (`gemini-2.5-flash` or `gemini-1.5-flash`) via the official Google GenAI SDK.
- **Empathetic & Non-Judgmental**: Validates feelings, offers gentle encouragement, and guides users with grounding and relaxation methods.
- **Bilingual & Natural**: Native understanding and conversational response in both **English** and **Hinglish** (Romanized Hindi).
- **Multi-Turn Context**: Maintains conversational flow across messages within the active session.
- **Strict Ethical Guardrails**:
  - Never claims to be a doctor, therapist, or human.
  - Never diagnoses mental health conditions or clinical disorders.
  - Never prescribes or suggests alterations to medications.
  - Avoids unrealistic promises or toxic positivity.

### 2. Dedicated Crisis Safety Intervention Layer
- Independent deterministic pre-check on every user message before LLM processing.
- Detects high-risk or self-harm keywords and phrases across English and Hinglish (e.g. self-harm, suicidal intent, romanized distress phrases).
- **Immediate Intervention**: Instantly delivers verified 24/7 crisis helplines, including:
  - 🇮🇳 **Tele-MANAS (Govt. of India)**: `14416` / `1800-891-4416` (Toll-Free, 24/7)
  - 🇮🇳 **KIRAN Mental Health Helpline**: `1800-599-0019` (24/7)
  - 🇮🇳 **Vandrevala Foundation**: `+91 9999 666 555` (Call & WhatsApp)
  - 🇮🇳 **AASRA**: `+91 98204 66726`
  - 🌍 **International**: `988` (US/Canada), `111`/`999` (UK), `112` (Emergency).
- Ordinary stress, exam worry, or bad days are distinguished from crisis situations so users receive tailored supportive counseling.

### 3. Premium SaaS UI/UX Design
- **Color Palette**: Soft lavender (`#8B5CF6`, `#EDE9FE`), off-white, and pastel pink accents.
- **Responsive Layout**: Designed for desktop, tablet, and mobile with a collapsible navigation drawer.
- **Interactive Elements**:
  - Welcome screen with minimal floating badge and 4 starter suggestion prompt cards.
  - Distinct message bubbles with markdown formatting (bullet points, bold text, links).
  - Subtle micro-animations, gentle typing indicator, and timestamps.
  - Session history list with New Chat and Clear Chat confirmation modal.
  - One-click copy for AI responses and direct-dial hotline buttons.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19 + Vite 8
  - Tailwind CSS v4
  - Lucide React (feather-style icons)
  - React Markdown (rich AI text rendering)
- **Backend**:
  - Python 3.10+
  - FastAPI
  - Uvicorn (ASGI web server)
  - Pydantic v2 (data validation)
  - Google GenAI SDK (`google-genai` & `google-generativeai`)
- **Storage**:
  - In-memory session store (prototype-ready, no complex database required).

---

## 📁 Project Structure

```
MindCare-Chatbot/
├── backend/
│   ├── app/
│   │   ├── config.py              # Environment configuration & settings
│   │   ├── models/
│   │   │   └── chat.py            # Pydantic schemas for messages & sessions
│   │   ├── services/
│   │   │   ├── safety_service.py  # Deterministic crisis detection layer
│   │   │   ├── gemini_service.py  # Google Gemini API integration & prompt
│   │   │   └── session_service.py # In-memory session history manager
│   │   └── routers/
│   │       ├── health.py          # GET /health endpoint
│   │       └── chat.py            # POST /chat/message & session endpoints
│   ├── .env.example               # Backend environment template
│   ├── requirements.txt           # Python dependencies
│   └── main.py                    # FastAPI server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx        # Navigation, session list, disclaimer
│   │   │   ├── ChatWindow.jsx     # Main chat header, messages container
│   │   │   ├── ChatMessage.jsx    # Distinct user & AI message bubbles
│   │   │   ├── MessageInput.jsx   # Input bar, auto-resizing, send triggers
│   │   │   ├── WelcomeScreen.jsx  # Greeting & suggestion cards
│   │   │   ├── SuggestionCards.jsx# 4 starter wellness prompts
│   │   │   ├── TypingIndicator.jsx# Animated pulsating reflection dots
│   │   │   └── Disclaimer.jsx     # Medical & wellness disclaimer
│   │   ├── services/
│   │   │   └── api.js             # Frontend API client
│   │   ├── App.jsx                # Main application state & coordinator
│   │   ├── main.jsx               # React DOM entry point
│   │   └── index.css              # Custom styling & Tailwind imports
│   ├── vite.config.js             # Vite configuration with proxy & Tailwind
│   ├── package.json               # Node.js dependencies & scripts
│   └── index.html                 # HTML shell with Google Fonts
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide

### Step 1: Clone or Navigate to the Project

```bash
cd c:\Users\jaina\MindCare-Chatbot
```

---

### Step 2: Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure your Gemini API Key:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and set your key from [Google AI Studio](https://aistudio.google.com/):
     ```env
     GEMINI_API_KEY=your_actual_gemini_api_key_here
     GEMINI_MODEL=gemini-2.5-flash
     BACKEND_HOST=127.0.0.1
     BACKEND_PORT=8000
     ```

5. Start the FastAPI backend:
   ```bash
   python main.py
   ```
   *(Or using uvicorn: `uvicorn main:app --reload --port 8000`)*

The backend will start at:
- **API Server:** `http://127.0.0.1:8000`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`
- **Health Check:** `http://127.0.0.1:8000/health`

---

### Step 3: Frontend Setup (React + Vite)

1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd c:\Users\jaina\MindCare-Chatbot\frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 📡 API Reference (FastAPI Swagger)

FastAPI automatically generates interactive Swagger documentation at `http://127.0.0.1:8000/docs`.

### Key Endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service health status and checks if `GEMINI_API_KEY` is configured |
| `POST` | `/chat/message` | Send message, run safety pre-check, and receive Gemini response |
| `GET` | `/chat/sessions` | List all conversation sessions with metadata |
| `POST` | `/chat/sessions` | Create a new session |
| `GET` | `/chat/sessions/{session_id}` | Retrieve complete message history for a session |
| `POST` | `/chat/sessions/{session_id}/clear` | Clear messages in a session |
| `DELETE` | `/chat/sessions/{session_id}` | Delete a session |

---

## 🧪 Testing Scenarios

1. **Everyday Stress & Relaxation**:
   - Send *"I am feeling overwhelmed with college exams."*
   - Verify empathetic acknowledgement and gentle breathing/pacing advice.
2. **Hinglish Language Handling**:
   - Send *"Aaj bohot tired lag raha hai, kuch samajh nahi aa raha."*
   - Verify that MindCare responds comfortably in Hinglish with conversational warmth.
3. **Multi-Turn Context**:
   - Message 1: *"My name is Alex and I have a project deadline tomorrow."*
   - Message 2: *"What was my project deadline again?"*
   - Verify that context from the previous turn is retained.
4. **Safety & Crisis Pre-Check**:
   - Send a test phrase with crisis intent (e.g., *"I want to end my life"* or *"marne ka man kar raha hai"*).
   - Verify deterministic trigger, Tele-MANAS (`14416`) details, and emergency helpline dial buttons.
5. **Missing API Key Handling**:
   - If `GEMINI_API_KEY` is blank in `backend/.env`, sending a non-crisis message displays a clear setup banner and instructional card instead of failing silently.

---

## ⚖️ Disclaimer

**MindCare** is an educational prototype developed for Self Learning Hours. It is designed to offer everyday emotional reflection and stress-relief guidance. MindCare is **not** a licensed medical doctor, healthcare provider, or emergency crisis center. If you or someone you know is in immediate danger or facing severe distress, please reach out to licensed mental health professionals or contact the national helpline at **14416 (Tele-MANAS)**.
