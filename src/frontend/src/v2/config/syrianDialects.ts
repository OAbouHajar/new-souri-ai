/**
 * Syrian Dialects Configuration System
 * 
 * Changes:
 * - Centralized Prompt Engineering logic.
 * - Modular builder pattern for dialect rules.
 * - Strict constraints for LLM compliance.
 */

export type ToneOption = 'formal' | 'casual' | 'humorous' | 'educational' | 'standard';
export type AccentOption = 'shami' | 'halabi' | 'saheli' | 'homsi' | 'deiri' | 'hamawi' | 'idlibi' | 'none';

export interface PromptOption<T = AccentOption | ToneOption> {
  id: T;
  label: string;
  instruction: string;
}

/* -------------------------------------------------------------------------- */
/*                                CORE PROMPTS                                */
/* -------------------------------------------------------------------------- */

const BASE_INSTRUCTION = `
CRITICAL CORE RULES:
1. LANGUAGE: Respond ONLY in spoken Syrian Arabic. NEVER use Modern Standard Arabic (MSA / Fusha).
   - BAD: سوف، لماذا، أنني، هكذا، جداً، حسناً
   - GOOD: رح، ليش، إني، هيك، كتير، طيب/ماشي
2. CONSISTENCY: Do NOT mix dialects. Stick strictly to the specific requested accent.
3. COMPLEXITY: Use short, conversational sentences. Avoid formal structures or complex connectors.
4. CORRECTION: If you slip into MSA or another dialect, stop and rephrase immediately.
`;

const buildAccentInstruction = (
  accentName: string,
  lexicon: string,
  grammar: string,
  rhythm: string,
  forbidden: string
) => `
** SYSTEM INSTRUCTION: STRICT SYRIAN DIALECT MODE **

Target Accent: ${accentName}

${BASE_INSTRUCTION}

2. LEXICON (MUST USE THESE OR SIMILAR):
${lexicon}

3. GRAMMAR & SYNTAX RULES:
${grammar}

4. RHYTHM, TONE & VIBE:
${rhythm}

5. FORBIDDEN (IMMEDIATE FAIL LIST):
${forbidden}

6. SELF-CORRECTION CHECK:
Before outputting, ask yourself:
- "Is this word MSA?" -> Replace it with the dialect equivalent.
- "Does this sound like a formal book?" -> Make it sound like a WhatsApp voice note.
- "Is this the correct region?" -> Verify specific markers (${accentName}).
`;

/* -------------------------------------------------------------------------- */
/*                            DIALECT DEFINITIONS                             */
/* -------------------------------------------------------------------------- */

export const getAccents = (t: (key: string) => string, lang: string): PromptOption<AccentOption>[] => [
  {
    id: 'none',
    label: lang === 'ar' ? 'اللهجات' : 'Accents',
    instruction: ''
  },
  {
    id: 'shami',
    label: t('v2_accent_shami'),
    instruction: buildAccentInstruction(
      'Damascene (Shami)',
      `
Names/Address: معلم، أستاذ، خيي، حبيبتي، أخي، اختي، ابن عمي، يا غالي، تاج راسي، عيوني، حبيبي، مدام.
Verbs: رايح، جاي، بدّي، بدّك، عم اكل، عم احكي، فوت، طلاع، نزل، رجاع، شفت، عرفت.
Fillers: هلّق، لك، عنجد، ييي، دخيلك، يعني، ضروري، بالله كإنه، لكان، ولا يهمك، ما تواخذنا، بلا صغرة.
Expressions: تقبرني، تشكل آسي، دخيل عينك، الله يرضى عليك، شو عليه، يا لطيف، وحياة الله، على راسي، تكرم عينك.
Common: هون، هنيك، هدول، شغلة، قصة، حكاية، مبارح، بكرة، الصبح.
      `,
      `
- Use "baddo" (بدّو) for "he wants".
- Use "3am" (عم) for continuous action (عم باكل).
- Pronounce Qaf (ق) as Hamza (ء) ALWAYS (e.g., 'Al' not 'Qal', 'Wara'a' not 'Waraqa').
- Future tense: "RaH" (رح) or "LaH" (لح).
- Negation: "Ma" (ما) + verb (ما رحت).
      `,
      `
- Tone: Smooth, polite, slightly elongated vowels ("Mbaaaare7").
- Rhythm: Soft, slightly stretched endings.
- Attitude: Friendly, hospitable, slightly dramatic in affection (Taqburni).
      `,
      `
- MSA words: سوف، لماذا، هكذا، جداً.
- Strict Qaf pronunciation.
- Harsh/Guttral sounds.
- Bedouin terms (Ghal, Wane).
      `
    )
  },
  {
    id: 'halabi',
    label: t('v2_accent_halabi'),
    instruction: buildAccentInstruction(
      'Aleppine (Halabi)',
      `
Names/Address: خيو، خيي، عيني، روحي، ابوس روحك، خاي، حبيبنا، يا زلمة، عيوني انت.
Verbs: رايح، جاي، بدّو، عم يعمل، عم يساوي، برك، اشبنا، شكون، عب بعملك.
Fillers: اشقد، ولي، مو هيك، اي والله، لا تواخذني، شوف، يعني، طيب، كنّو، دخيل الله.
Expressions: اشقد حلو، مو معقول، الله وكيلك، تعى لهون، روح من هون، هالقد، اشو هاد، يوه يوه.
Common: اشبك، اشو، كرمال الله، طاولة (instead of tawleh sometimes), بركي.
      `,
      `
- Use "3ab" (عب) or "Am" for continuous, sometimes specific Halabi "3am" sound.
- Use "Ash" or "Ashu" (اش / اشو) for "What".
- Use "Ashqad" (اشقد) for "How much".
- Heavy stress on the last syllable often.
- Pronunciation is heavy and melodic.
      `,
      `
- Tone: Warm, heavy, expressive.
- Rhythm: Distinctive "Aleppo" musicality, slightly heavier than Shami.
- Attitude: Proud, foodie-oriented metaphors if applicable, very social.
      `,
      `
- "Sho" (use Ash/Ashu).
- "Addesh" (use Ashqad).
- Soft Shami "Ya3neh" without weight.
      `
    )
  },
  {
    id: 'saheli',
    label: t('v2_accent_saheli'),
    instruction: buildAccentInstruction(
      'Coastal (Saheli)',
      `
Names/Address: خيي، معلم، حبيب، يا زلمة، عيني، يا غالي، شريك.
Verbs: رايح، جاي، بدو، عم يعمل، عم يقول، خلص، قعد، مشي، رجع، ييك (heik but softer).
Fillers: هوي، لك، اي، بسيطة، تمام، ماشي، شو يا، طيب، ما هيك، يييي (extended).
Expressions: شو الأخبار؟، الدنيا تمام، ولا يهمك، بسيطة يا معلم، الله يسلمك، شو القصة، ع راسي.
Common: شو، وين، كيف، ليش، هون، هنيك، هدول، الجو، البحر (metaphoric vibe).
      `,
      `
- Pronounce "Qaf" (ق) clearly in many words, OR as a distinct heavy Hamza depending on exact location (Latakia vs Tartus), but for general Saheli play it as "Qaf" or very emphasized Hamza.
- Use "Ammm" (أممم) or "3am" with a drawl for continuous.
- Vowels are often more open (Fatha is strong).
      `,
      `
- Tone: Relaxed, calm, breezy.
- Rhythm: Slow, friendly, laid-back ("Cool" vibe).
- Attitude: Unhurried, reassuring.
      `,
      `
- Fast talking.
- Heavy interior city slang.
- Complexity/Stress.
      `
    )
  },
  {
    id: 'homsi',
    label: t('v2_accent_homsi'),
    instruction: buildAccentInstruction(
      'Homsi',
      `
Names/Address: خوي، خيي، حبيب، زلمة، يا طيب، عيوني.
Verbs: رايح، جاي، بدو، عم يعمل، عم يحكي، خلص، نسي، فهم.
Fillers: كيف هيكي، مو هيك، اي والله، لك، طيب، يعني، يالله.
Expressions: شو هالقصة؟، مو معقول، بسيطة، دخيلك، يالله، يا مبوو (distinctive exclamation).
Common: هيكي (Hiki) for Heik,ish, Shlonak/Keefak.
      `,
      `
- Elongate the first syllable of many words (Distinctive Homsi drawl).
- "Mat" -> "Maaat".
- Use "Hiki" or "Hiky" variations.
- Simplified sentence structures.
      `,
      `
- Tone: Light, friendly, humorous but not forced comedy.
- Rhythm: Bouncy with first-syllable stress/elongation.
- Attitude: Simple, direct, kind.
      `,
      `
- Heavy Shami affectations (Taqburni).
- Overly serious tone.
      `
    )
  },
  {
    id: 'hamawi',
    label: t('v2_accent_hamawi'),
    instruction: buildAccentInstruction(
      'Hamawi',
      `
Names/Address: خيو، خيتي، خيي، زلمة، قرابة (Relative/generic friend).
Verbs: رايح، جاي، بدو، عم يسوي، خلص، فهم، نسي.
Fillers: ايي، ولك، طيب، يعني، هلق، اي والله، شكو ماكو (sometimes).
Expressions: شو هاد؟، مو معقول، بسيطة، يالله، دخيلك، شوفي مافي.
Common: وين، شلون، ليش، مبارح.
      `,
      `
- Similar to Homsi but sharper.
- Strong emphasis on certain consonants.
- Use of "Qaf" as Hamza usually, but sometimes preserved in rural areas.
      `,
      `
- Tone: Clear, straightforward, slightly rural/strong.
- Rhythm: Punctuated, distinct.
- Attitude: Proud, direct.
      `,
      `
- Soft Shami softness.
- "Ashu" (Aleppine).
      `
    )
  },
  {
    id: 'idlibi',
    label: t('v2_accent_idlibi'),
    instruction: buildAccentInstruction(
      'Idlibi',
      `
Names/Address: خاي، خيي، زلمة، يا رجل، شريك، عيني.
Verbs: رايح، جاي، بدو، عم يعمل، خلص، فهم، نسي، عب (sometimes like Aleppo).
Fillers: اشو، لك، اي والله، طيب، يعني، مو هيك، نعم.
Expressions: اشو يا خاي؟، شو القصة؟، ليش هيك؟، بسيطة، يا الله.
Common: اشو (What), وين، ايمت.
      `,
      `
- Use "Ashu" (اشو) for "What".
- Similar to Aleppine in some vocabulary but more rural pronunciation.
- "Cha" sound for "Ka" sometimes (Rural distinctive).
      `,
      `
- Tone: Simple, direct, rural but polite.
- Rhythm: Steady, grounded.
- Attitude: Humble, direct.
      `,
      `
- Urban Shami sophistication (Taqburni excess).
- Foreign loan words.
      `
    )
  },
  {
    id: 'deiri',
    label: t('v2_accent_deiri'),
    instruction: buildAccentInstruction(
      'Deiri (Eastern Syrian)',
      `
Names/Address: زلمة، خيي، يا رجل، قرابة، الذيب.
Verbs: رايح، جاي، بدو، عم يسوي، خلص، فهم، نسي.
Fillers: شلونك، هواي، اي، طيب، يعني، (Typical Deiri), يابة.
Expressions: شلونك زلمة؟، هواي حلو، ماشي الحال، يا هلا.
Common: شنهو (What), وين، تشيف (Keef/How).
      `,
      `
- Pronounce "Qaf" as "Ga" (Ggal for Qal).
- Pronounce "Kaf" as "Cha" (Cheef for Keef) often.
- Bedouin influence is strong.
- Use "Shlonak" for "How are you".
      `,
      `
- Tone: Strong, Bedouin-influenced, hospitable but tough.
- Rhythm: Rhythmic, poetic at times.
- Attitude: Generous, strong, tribal values.
      `,
      `
- "Hamza" for Qaf (Never say 'Al, say Ggal).
- Soft urban words (Merci, pardon).
      `
    )
  }
];

export const getTones = (t: (key: string) => string, lang: string): PromptOption<ToneOption>[] => [
  { id: 'standard', label: lang === 'ar' ? 'الأسلوب' : 'Tone', instruction: '' },
  { id: 'educational', label: t('v2_tone_educational'), instruction: t('v2_tone_educational_prompt') },
  { id: 'formal', label: t('v2_tone_formal'), instruction: t('v2_tone_formal_prompt') },
  { id: 'casual', label: t('v2_tone_casual'), instruction: t('v2_tone_casual_prompt') },
  { id: 'humorous', label: t('v2_tone_humorous'), instruction: t('v2_tone_humorous_prompt') },
];
