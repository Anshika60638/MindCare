import logging
from typing import List, Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)

MINDCARE_SYSTEM_PROMPT = """You are MindCare, an empathetic, supportive, and thoughtful AI wellness companion.

Your purpose is to provide everyday emotional support, a comforting listening space, and gentle mindfulness guidance for students and everyday individuals dealing with daily stress, academic pressure, emotional fatigue, relationship worries, or general life challenges.

Key Principles & Tone:
1. Warmth & Empathy: Speak with gentle warmth, kindness, and non-judgmental active listening. Acknowledge and validate feelings genuinely before offering thoughts.
2. Language Adaptability: You are fully fluent in both English and Hinglish (Hindi written in Roman script). Always respond in the exact language style and tone the user uses.
   - If the user writes in English, reply in natural, friendly English.
   - If the user writes in Hinglish (e.g., "Aaj bohot stress hai college ka", "Mujhe tension ho rahi hai"), respond warmly in natural Hinglish with care and comfort (e.g., "Main samajh sakta hoon ki college ka load kitna exhausting ho sakta hai...").
3. Concise & Thoughtful: Keep responses focused, readable, and meaningful (typically 2-4 short paragraphs or bullet points). Avoid long academic essays or overwhelming walls of text.
4. Active & Helpful:
   - Ask thoughtful, gentle follow-up questions to help the user reflect or open up at their own pace.
   - When helpful, offer simple, practical relaxation techniques (like the 4-7-8 breathing method, 5-4-3-2-1 grounding, progressive muscle relaxation, or journaling prompts).
5. Strict Boundaries & Ethics:
   - You are an AI wellness companion, NOT a medical doctor, psychiatrist, licensed psychologist, or therapist.
   - NEVER claim to be human, a doctor, or a clinical therapist.
   - NEVER diagnose mental health disorders (e.g., never say "You have clinical depression" or "This is anxiety disorder").
   - NEVER recommend, prescribe, or discuss medication, dosages, or alterations to medical treatments.
   - Avoid making unrealistic guarantees or toxic positivity (e.g., do NOT say "Everything will be perfectly solved tomorrow", but DO offer realistic encouragement like "Take it one moment at a time, you have the strength to navigate this").
6. Formatting: Use neat markdown with subtle bullet points or bold text where appropriate to make the guidance comfortable and easy to read.
"""

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY.strip()
        self.model_name = settings.GEMINI_MODEL.strip() or "gemini-2.5-flash"
        self._client = None
        self._init_client()

    def _init_client(self):
        """Initializes the Gemini client if an API key is available."""
        self.api_key = settings.GEMINI_API_KEY.strip()
        if not self.api_key:
            self._client = None
            return

        try:
            # First try the official modern google-genai SDK with v1beta for developer instructions
            from google import genai
            self._client = genai.Client(
                api_key=self.api_key,
                http_options={"api_version": "v1beta"}
            )
            self._client_type = "genai"
            logger.info("Initialized google-genai client (v1beta) successfully.")
        except Exception as e:
            logger.warning(f"Failed to initialize google-genai client: {e}. Falling back to google-generativeai.")
            try:
                import google.generativeai as legacy_genai
                legacy_genai.configure(api_key=self.api_key)
                self._client = legacy_genai
                self._client_type = "legacy"
                logger.info("Initialized google-generativeai client successfully.")
            except Exception as e2:
                logger.error(f"Failed to initialize legacy google-generativeai client: {e2}")
                self._client = None

    def reload_key(self, api_key: str):
        """Allows dynamically updating the API key."""
        settings.GEMINI_API_KEY = api_key.strip()
        self._init_client()

    async def generate_response(self, conversation_history: List[Dict[str, str]], user_message: str) -> str:
        """
        Generates an AI response from Gemini given conversation history and current user message.
        conversation_history is a list of {"role": "user"|"assistant", "content": str}
        """
        # Re-check in case environment changed
        if not self.api_key or not self._client:
            self._init_client()

        if not self.api_key:
            return (
                "⚠️ **Gemini API Key Required**\n\n"
                "MindCare is ready, but a Google Gemini API key has not been configured in the backend.\n\n"
                "**Quick Setup Instructions:**\n"
                "1. Get a free API key at [Google AI Studio](https://aistudio.google.com/).\n"
                "2. Open `backend/.env`.\n"
                "3. Set `GEMINI_API_KEY=your_actual_gemini_api_key`.\n"
                "4. Restart the backend server.\n\n"
                "Once configured, MindCare will provide personalized, empathetic AI responses."
            )

        try:
            if hasattr(self, "_client_type") and self._client_type == "genai":
                return await self._generate_with_genai(conversation_history, user_message)
            else:
                return await self._generate_with_legacy(conversation_history, user_message)
        except Exception as e:
            error_str = str(e)
            logger.error(f"Gemini generation error: {error_str}", exc_info=True)
            
            # Identify DNS or network connection failure
            if "11001" in error_str or "getaddrinfo" in error_str.lower():
                return (
                    "🌐 **Network Connection Issue**\n\n"
                    "I encountered a temporary connection issue while reaching the AI service. "
                    "Please check your internet connection or Wi-Fi, and try sending your message again."
                )

            # Identify known Gemini errors
            if "API_KEY_INVALID" in error_str or ("400" in error_str and "key" in error_str.lower()):
                return (
                    "⚠️ **Invalid Gemini API Key**\n\n"
                    "The configured Gemini API key appears to be invalid or expired. "
                    "Please verify your key at [Google AI Studio](https://aistudio.google.com/) and update `backend/.env`."
                )
            elif "RESOURCE_EXHAUSTED" in error_str or "429" in error_str:
                return (
                    "⏳ **Rate Limit Reached**\n\n"
                    "The Gemini API rate limit or quota has been momentarily reached. "
                    "Please wait a few moments and try your message again."
                )
            
            # If the selected model (e.g. gemini-2.5-flash) failed, try fallback model
            if self.model_name != "gemini-2.5-flash-lite":
                try:
                    logger.info("Attempting fallback to gemini-2.5-flash-lite...")
                    old_model = self.model_name
                    self.model_name = "gemini-2.5-flash-lite"
                    fallback_res = await self.generate_response(conversation_history, user_message)
                    self.model_name = old_model
                    return fallback_res
                except Exception:
                    pass

            return (
                f"I'm sorry, I encountered a temporary connection issue while thinking about your message: `{error_str[:120]}`. "
                "Please check your network and API key, and try again."
            )

    async def _generate_with_genai(self, conversation_history: List[Dict[str, str]], user_message: str) -> str:
        """Uses the modern google-genai SDK."""
        from google.genai import types

        # Build contents from history
        contents = []
        for msg in conversation_history:
            role = "user" if msg["role"] == "user" else "model"
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=msg["content"])]
                )
            )

        # Add current user message
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=user_message)]
            )
        )

        config = types.GenerateContentConfig(
            system_instruction=MINDCARE_SYSTEM_PROMPT,
            temperature=0.7,
            top_p=0.9,
            max_output_tokens=1024,
        )

        # google-genai Client call (models.generate_content)
        import asyncio
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: self._client.models.generate_content(
                model=self.model_name,
                contents=contents,
                config=config,
            )
        )

        if response and response.text:
            return response.text.strip()
        return "I am here with you, listening. Could you tell me a little more about what's on your mind?"

    async def _generate_with_legacy(self, conversation_history: List[Dict[str, str]], user_message: str) -> str:
        """Uses google-generativeai SDK."""
        import asyncio
        loop = asyncio.get_event_loop()

        def _call_legacy():
            model = self._client.GenerativeModel(
                model_name=self.model_name,
                system_instruction=MINDCARE_SYSTEM_PROMPT,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "max_output_tokens": 1024,
                }
            )
            formatted_history = []
            for msg in conversation_history:
                role = "user" if msg["role"] == "user" else "model"
                formatted_history.append({
                    "role": role,
                    "parts": [msg["content"]]
                })

            chat = model.start_chat(history=formatted_history)
            res = chat.send_message(user_message)
            return res.text.strip() if res and res.text else ""

        response_text = await loop.run_in_executor(None, _call_legacy)
        return response_text or "I am listening. Please share whatever feels right for you."

gemini_service = GeminiService()
