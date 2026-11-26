import re
from typing import Tuple

class SafetyService:
    """
    Dedicated safety layer to detect high-risk and self-harm messages
    prior to invoking the LLM. Ensures rapid, deterministic intervention
    with verified crisis support lines.
    """

    # Crisis patterns for self-harm and suicide in English and Hinglish
    CRISIS_PATTERNS = [
        # Explicit suicide and self-harm terms
        r"\b(?:suicide|suicidal)\b",
        r"\b(?:kill\s+(?:my\s*self|me))\b",
        r"\b(?:end\s+(?:my\s*life|it\s*all))\b",
        r"\b(?:want\s+to\s+die|wish\s+i\s+(?:was|were)\s+dead)\b",
        r"\b(?:take\s+my\s+(?:own\s+)?life)\b",
        r"\b(?:hang\s+myself|slit\s+my\s+wrist[s]?|cut\s+myself)\b",
        r"\b(?:overdose\s+(?:on|myself))\b",
        r"\b(?:jump\s+(?:off|from)\s+(?:a\s+)?(?:bridge|building|roof|terrace))\b",
        r"\b(?:better\s+off\s+dead|no\s+reason\s+to\s+live)\b",
        r"\b(?:drown\s+myself|shoot\s+myself)\b",
        r"\b(?:self[-\s]?harm)\b",
        
        # Hinglish / Roman Hindi suicide and self-harm terms
        r"\b(?:marne\s+ka\s+(?:mann|man|irada))\b",
        r"\b(?:jaan\s+de\s+(?:du|dunga|dungi))\b",
        r"\b(?:khudkhushi|aatmhatya|aatmahatya)\b",
        r"\b(?:khatam\s+kar\s+(?:lu|lena\s+chahta|lena\s+chahti|du))\b",
        r"\b(?:apne\s+aap\s+ko\s+khatam)\b",
        r"\b(?:mar\s+ja(?:u|na\s+chahta|na\s+chahti))\b",
        r"\b(?:ab\s+jeene\s+ka\s+man[n]?\s+nahi)\b",
        r"\b(?:jeena\s+nahi\s+chahta|jeena\s+nahi\s+chahti)\b",
        r"\b(?:zindagi\s+khatam\s+karna)\b",
        r"\b(?:haath\s+kaat\s+lu|nas\s+kaat)\b",
        r"\b(?:zeher\s+kha(?:na|lu))\b",
    ]

    COMPILED_PATTERNS = [re.compile(p, re.IGNORECASE) for p in CRISIS_PATTERNS]

    CRISIS_RESPONSE = (
        "### 💜 Please know that you are not alone, and help is available right now.\n\n"
        "I can hear how much pain you are experiencing, and I care deeply about your safety. "
        "As an AI, I cannot provide emergency support, but there are compassionate, trained people "
        "who want to listen and help you through this moment—completely free and confidential.\n\n"
        "#### 📞 Immediate Support Lines (India):\n"
        "- **Tele-MANAS (Govt. of India)**: Call **[14416](tel:14416)** or **[1800-891-4416](tel:18008914416)** (24/7 Toll-Free)\n"
        "- **KIRAN Mental Health Helpline**: **[1800-599-0019](tel:18005990019)** (24/7)\n"
        "- **Vandrevala Foundation**: **[+91 9999 666 555](tel:+919999666555)** (24/7 Call & WhatsApp)\n"
        "- **AASRA**: **[+91 98204 66726](tel:+919820466726)** (24/7)\n\n"
        "#### 🌍 International Support:\n"
        "- **US & Canada**: Call or text **[988](tel:988)** (Suicide & Crisis Lifeline)\n"
        "- **UK**: Call **[111](tel:111)** or **[999](tel:999)**\n"
        "- **Emergency Everywhere**: Please dial **112** or contact your nearest hospital emergency room.\n\n"
        "Please take a deep breath, stay right where you are, and reach out to one of these services, "
        "or call a trusted friend, family member, or mentor right now. You matter, and there is support for you."
    )

    @classmethod
    def check_message(cls, text: str) -> Tuple[bool, str]:
        """
        Evaluates a user message.
        Returns:
            (is_crisis: bool, message: str)
            If is_crisis is True, message is the predefined crisis intervention response.
            If is_crisis is False, message is empty.
        """
        if not text or not text.strip():
            return False, ""

        clean_text = text.strip()
        for pattern in cls.COMPILED_PATTERNS:
            if pattern.search(clean_text):
                return True, cls.CRISIS_RESPONSE

        return False, ""

safety_service = SafetyService()
