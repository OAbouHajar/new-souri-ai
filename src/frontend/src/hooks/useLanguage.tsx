import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export type LanguageCode = 'en' | 'ar';

interface LanguageContextValue {
  lang: LanguageCode;
  toggleLanguage: () => void;
  setLanguage: (l: LanguageCode) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'ui_lang';

const messages: Record<LanguageCode, Record<string, string>> = {
  en: {
    // General / existing
    brand: 'Fahim AI',
    history: 'History',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    newChat: 'New Chat',
    loadingHistory: 'Loading chat history...',
    signInToAccessHistory: 'Sign in to access your chat history',
    loadingChats: 'Loading chats...',
    noChats: 'No chats yet',
    startConversation: 'Start a new conversation to begin',
    welcomeTitle: "Fahim AI — I've got you covered",
    welcomeLine1: 'I’m Souri AI, here to help with Syrian-related topics and daily needs.',
    welcomeLine2: 'I’m still evolving and getting better every day.',
    betaWarning: 'This smart agent is in beta testing — do not share any personal or sensitive information.',
    thinking: 'Fahim is thinking...',
    copy: 'Copy',
    copied: 'Copied',
    
    // Menu items
    termsOfUse: 'Terms of Use',
    privacy: 'Privacy',
    howToContribute: 'How to Contribute',
    submitContribution: 'Submit Contribution',

    // Auth modal - shared labels
    auth_welcomeTitle: 'Welcome',
    auth_welcomeSubtitle: 'Choose your preferred sign in method',
    auth_createAccount: 'Create New Account',
    auth_haveAccount: 'Already have an account?',
    auth_haveAccountLogin: 'Log In',
    auth_fullName: 'Full Name',
    auth_email: 'Email',
    auth_addressOptional: 'Address (optional)',
    auth_password: 'Password',
    auth_passwordConfirm: 'Confirm Password',
    auth_passwordStrengthLabel: 'Password strength',
    auth_passwordStrengthWeak: 'Weak',
    auth_passwordStrengthMedium: 'Medium',
    auth_passwordStrengthStrong: 'Strong',
    auth_passwordRequirements: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special symbol.',
    auth_passwordMismatch: 'Passwords do not match',
    auth_signupSubmitting: 'Creating account...',
    auth_signupSubmit: 'Create Account',
    auth_alreadyHaveAccount: 'Have an account? ',
    auth_loginTitle: 'Sign In',
    auth_loginSubtitle: 'Welcome back! Enter your credentials to continue',
    auth_loginSubmitting: 'Signing in...',
    auth_loginSubmit: 'Sign In',
    auth_noAccount: "Don’t have an account? ",
    auth_createNewAccount: 'Create a new account',
    auth_networkError: 'Network error occurred',
    auth_signupFailed: 'Signup failed',
    auth_loginFailed: 'Login failed',

    // Placeholders
    auth_placeholder_fullName: 'Enter your full name',
    auth_placeholder_email: 'example@domain.com',
    auth_placeholder_address: 'Enter your address',
    auth_placeholder_password: 'Enter a strong password',
    auth_placeholder_passwordConfirm: 'Re-enter password',

    // V2 UI
    v2_brand: 'Souri AI',
    v2_brandSubtitle: 'Your new intelligent assistant',
    v2_announcement: 'Souri AI is the new version of Fahim AI',
    v2_menu: 'Menu',
    v2_home: 'Home',
    v2_privacyPolicy: 'Privacy Policy',
    v2_howToContribute: 'How to Contribute?',
    v2_developer_menu: 'Souri AI Developer',
    v2_comingSoon: 'Attachments and Voice interactions are coming soon!',
    v2_clearChat: 'Clear Conversation',
    v2_newChat: 'New Chat',
    v2_inputPlaceholder: 'Ask Souri anything...',
    v2_source: 'Source',
    v2_copy: 'Copy Text',
    v2_copied: 'Copied',
    // Home
    v2_homeSubtitle: 'I’m Souri AI, here to help with Syrian-related topics and daily needs. I’m still evolving and getting better every day.',
    v2_suggestion1: 'Syrian Embassy Berlin',
    v2_suggestion2: 'Passport issuance requirements',
    v2_suggestion3: 'List Baccalaureate books?',
    // Info Pages
    v2_back: 'Back',
    v2_privacy_h1: 'Privacy Policy',
    v2_privacy_p1: 'We rely on Azure OpenAI Service technology, but with a strict structure for data protection.',
    v2_contribute_h1: 'Why your contribution matters?',
    v2_contribute_p1: 'Souri AI improves when we expand and refine its knowledge base on Syrian government procedures. You can help by providing additional public, official, and documented information.',
    
    // Privacy Cards
    v2_priv_c1_t: '1. Our Commitment',
    v2_priv_c1_d: 'We respect your privacy. This policy explains how we collect and use information when you interact with "Souri AI".',
    v2_priv_c2_t: '2. No Personal Data Required',
    v2_priv_c2_d: 'You can use the core experience without providing personal information. The assistant relies on publicly available Syrian government sources.',
    v2_priv_c3_t: '3. Conversation Storage & Learning',
    v2_priv_c3_d: 'Conversations are stored to improve the quality and accuracy of the assistant. This helps us understand common questions and improve responses.',
    v2_priv_c3_li1: "Anonymous Users: Use the 'Clear Chat' button to delete the conversation thread at any time.",
    v2_priv_c3_li2: 'Identity (Name, Email) is encrypted and separated from chat content.',
    v2_priv_c4_t: '4. Data Security',
    v2_priv_c4_d: 'Security controls include encrypted transmission (TLS), isolation, infrastructure logging, and secret control. We do not sell user data.',
    v2_priv_c5_t: '5. Important Note (Beta)',
    v2_priv_c5_d: '"Souri AI" is in active beta. Please **do not send sensitive identifiers** (national numbers, passport numbers, exact addresses) in the conversation.',
    
    // Contrb Cards
    v2_cont_c1_t: 'What You Can Contribute',
    v2_cont_c1_li1: 'Links to official Syrian government pages.',
    v2_cont_c1_li2: 'Scans or PDF files of procedural guides available to the public.',
    v2_cont_c1_li3: 'Updates when fees, forms, or requirements change.',
    v2_cont_c1_li4: 'Corrections to existing content.',
    v2_cont_c2_t: 'What Not To Contribute',
    v2_cont_c2_li1: 'Personal identifiers (National ID, Passport).',
    v2_cont_c2_li2: 'Health or financial information.',
    v2_cont_c2_li3: 'Internal/Confidential government documents.',
    v2_cont_c2_li4: 'Unverified or misleading information.',
    v2_cont_c3_t: 'Souri AI Developer',
    v2_dev_section_title: 'About Souri AI Developer',
    v2_dev_section_subtitle: 'A personal project being built and improved gradually',
    v2_dev_role: 'Software & AI Developer',
    v2_cont_bio_p1: 'Syrian software developer currently based in Ireland, interested in building useful tools using software and Artificial Intelligence.',
    v2_cont_bio_p2: 'Holds an MSc in Artificial Intelligence, and continues to learn and work on personal projects aimed at simplifying technology and making it more accessible.',
    v2_cont_bio_p3: 'Souri AI is a personal project started as an attempt to understand Syrian affairs and daily transactions more clearly, and is being developed and improved gradually based on usage and experience.',
    v2_cont_email: 'Email',
    v2_cont_linkedin: 'LinkedIn',
    v2_cont_facebook: 'Facebook',
    
    // Tones
    v2_tone_formal: 'Formal',
    v2_tone_casual: 'Casual',
    v2_tone_humorous: 'Funny',
    v2_tone_educational: 'Educational',
    // Tone Prompts
    v2_tone_formal_prompt: "Answer in a Formal, clear, professional style.",
    v2_tone_casual_prompt: "Answer in a Syrian Casual style, friendly, simple, and understandable to ordinary people without complexity.",
    v2_tone_humorous_prompt: "Answer in a Funny way and kind style, with a simple and respectful touch of humor, without sarcasm or underestimating the importance of the topic.",
    v2_tone_educational_prompt: "Answer in an Educational style, step by step, with simple explanation and examples when needed, as if explaining to a student.",
    // Accents
    v2_accent_halabi: 'Halabi',
    v2_accent_shami: 'Shami',
    v2_accent_saheli: 'Saheli',
    v2_accent_homsi: 'Homsi',
    v2_accent_deiri: 'Deiri',
    v2_accent_hamawi: 'Hamawi',
    v2_accent_idlibi: 'Idlibi',
    v2_accent_placeholder: 'Accent',
    
    // About / RAG
    v2_howItWorks_menu: 'About Souri AI',
    v2_howItWorks_title: 'How Souri AI Works?',
    v2_rag_step1: 'Document Ingestion',
    v2_rag_desc1: 'Souri reads official PDF guides and governmental procedures.',
    v2_rag_step2: 'Indexing',
    v2_rag_desc2: 'Content is broken down and stored for fast retrieval.',
    v2_rag_step3: 'AI Understanding',
    v2_rag_desc3: 'When you ask, AI finds the most relevant info.',
    v2_rag_step4: 'Answer',
    v2_rag_desc4: 'A precise answer is generated based on official sources.',

    // Knowledge Base Stats
    v2_kb_title: 'Knowledge Base Coverage',
    v2_kb_subtitle: 'Uses retrieval over a curated knowledge base (RAG)',
    v2_kb_stat_docs: 'Indexed Documents',
    v2_kb_stat_files: 'Source Files',
    v2_kb_desc_docs: 'Retrieves answers from over 15,000 indexed documents',
    
    // Sources Section
    v2_src_title: 'Sources & Data Coverage',
    v2_src_desc: 'This assistant retrieves information from a curated set of publicly available official sources. These sources are used for retrieval at query time and are not used to train the underlying AI model.',
    v2_src_web_title: 'Official Websites',
    v2_src_tele_title: 'Official Telegram Channels',
  },
  ar: {
    // Existing Arabic
    brand: 'فهيم AI',
    history: 'السجل',
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    newChat: 'محادثة جديدة',
    loadingHistory: 'جارٍ تحميل سجل المحادثة...',
    signInToAccessHistory: 'سجّل الدخول للوصول إلى سجل المحادثات',
    loadingChats: 'جارٍ تحميل المحادثات...',
    noChats: 'لا توجد محادثات بعد',
    startConversation: 'ابدأ محادثة جديدة للبدء',
    welcomeTitle: 'فهيم AI — كيف فيني ساعدك؟',
    welcomeLine1: 'أنا سوري AI، مساعد ذكي بالشأن السوري والمعاملات اليومية.',
    welcomeLine2: 'الخدمة قيد التطوير وعم تتحسن بشكل مستمر.',
    betaWarning: 'هذا الوكيل الذكي في مرحلة الاختبار التجريبي - لا تشارك أي معلومات شخصية أو حساسة',
    thinking: 'فهيم عم يفكر - دقيقة وراجعلك...',
    copy: 'نسخ',
    copied: 'تم النسخ',
    
    // Menu items
    termsOfUse: 'شروط الاستخدام',
    privacy: 'الخصوصية',
    howToContribute: 'كيفية المساهمة',
    submitContribution: 'تقديم مساهمة',

    // Auth modal Arabic
    auth_welcomeTitle: 'مرحباً بك',
    auth_welcomeSubtitle: 'اختر طريقة تسجيل الدخول المفضلة لديك',
    auth_createAccount: 'إنشاء حساب جديد',
    auth_haveAccount: 'لديك حساب؟',
    auth_haveAccountLogin: 'تسجيل الدخول',
    auth_fullName: 'الاسم الكامل',
    auth_email: 'البريد الإلكتروني',
    auth_addressOptional: 'العنوان (اختياري)',
    auth_password: 'كلمة المرور',
    auth_passwordConfirm: 'تأكيد كلمة المرور',
    auth_passwordStrengthLabel: 'قوة كلمة المرور',
    auth_passwordStrengthWeak: 'ضعيفة',
    auth_passwordStrengthMedium: 'متوسطة',
    auth_passwordStrengthStrong: 'قوية',
    auth_passwordRequirements: 'متطلبات كلمة المرور: ٨ أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص.',
    auth_passwordMismatch: 'كلمات المرور غير متطابقة',
    auth_signupSubmitting: 'جاري إنشاء الحساب...',
    auth_signupSubmit: 'إنشاء حساب',
    auth_alreadyHaveAccount: 'لديك حساب؟ ',
    auth_loginTitle: 'تسجيل الدخول',
    auth_loginSubtitle: 'مرحباً بك مرة أخرى! أدخل بياناتك للمتابعة',
    auth_loginSubmitting: 'جاري تسجيل الدخول...',
    auth_loginSubmit: 'تسجيل الدخول',
    auth_noAccount: 'ليس لديك حساب؟ ',
    auth_createNewAccount: 'إنشاء حساب جديد',
    auth_networkError: 'حدث خطأ في الشبكة',
    auth_signupFailed: 'فشل في التسجيل',
    auth_loginFailed: 'فشل في تسجيل الدخول',

    // Placeholders
    auth_placeholder_fullName: 'أدخل اسمك الكامل',
    auth_placeholder_email: 'example@domain.com',
    auth_placeholder_address: 'أدخل عنوانك',
    auth_placeholder_password: 'أدخل كلمة مرور قوية',
    auth_placeholder_passwordConfirm: 'أعد إدخال كلمة المرور',

    // V2 UI
    v2_brand: 'سوري AI',
    v2_brandSubtitle: 'وكيل ذكاء اصطناعي سوري',
    v2_announcement: 'سوري AI الإصدار الجديد من فهيم AI',
    v2_menu: 'القائمة',
    v2_home: 'الرئيسية',
    v2_privacyPolicy: 'سياسة الخصوصية',
    v2_howToContribute: 'كيف أساهم؟',
    v2_developer_menu: 'مطور سوري AI',
    v2_comingSoon: 'المرفقات والتفاعل الصوتي ميزات قادمة قريباً!',
    v2_clearChat: 'مسح المحادثة',
    v2_newChat: 'محادثة جديدة',
    v2_inputPlaceholder: 'اسأل سوري ما تشاء...',
    v2_source: 'المصدر',
    v2_copy: 'نسخ النص',
    v2_copied: 'تم النسخ',
    // Home
    v2_homeSubtitle: 'أنا **وكيل ذكاء اصطناعي سوري**، صُممت لأكون مساعدك الذكي في الشؤون السورية والمعاملات اليومية. الخدمة قيد التطوير وتتحسن باستمرار لتقديم دعم أدق وتجربة أفضل مع الوقت.',
    v2_suggestion1: 'عنوان سفارة برلين',
    v2_suggestion2: 'استخراج جواز سفر',
    v2_suggestion3: 'ماهي كتب البكالوريا',
    // Info Pages
    v2_back: 'الرجوع',
    v2_privacy_h1: 'سياسة الخصوصية',
    v2_privacy_p1: 'نعتمد على تقنية Azure OpenAI Service، ولكن مع هيكلية صارمة لحماية البيانات.',
    v2_contribute_h1: 'لماذا مساهمتك مهمة؟',
    v2_contribute_p1: 'يتحسن "سوري AI" عندما نوسع وننقي قاعدة معرفته بالإجراءات الحكومية السورية. يمكنك المساعدة بتقديم معلومات إضافية عامة ورسمية وموثقة.',

    // Privacy Cards
    v2_priv_c1_t: '1. التزامنا',
    v2_priv_c1_d: 'نحترم خصوصيتك. توضح هذه السياسة كيفية جمع واستخدام المعلومات عند تفاعلك مع "سوري AI".',
    v2_priv_c2_t: '2. لا بيانات شخصية مطلوبة',
    v2_priv_c2_d: 'يمكنك استخدام التجربة الأساسية دون تقديم معلومات شخصية. يعتمد المساعد على مصادر حكومية سورية متاحة للعامة.',
    v2_priv_c3_t: '3. تخزين المحادثات والتعلم',
    v2_priv_c3_d: 'يتم تخزين المحادثات لتحسين جودة ودقة المساعد. هذا يساعدنا على فهم الأسئلة الشائعة وتحسين الردود.',
    v2_priv_c3_li1: 'المستخدمون المجهولون: استخدم زر "مسح المحادثة" لحذف خيط المحادثة في أي وقت.',
    v2_priv_c3_li2: 'الهوية (الاسم، البريد الإلكتروني) مشفرة ومفصولة عن محتوى الدردشة.',
    v2_priv_c4_t: '4. أمان البيانات',
    v2_priv_c4_d: 'تشمل ضوابط الأمان النقل المشفر (TLS)، والعزل، وتسجيل البنية التحتية، والتحكم في الأسرار. لا نبيع بيانات المستخدمين.',
    v2_priv_c5_t: '5. ملاحظة هامة (Beta)',
    v2_priv_c5_d: '"سوري AI" في مرحلة تجريبية نشطة. يرجى **عدم إرسال معرّفات حساسة** (أرقام وطنية، أرقام جوازات سفر، عناوين دقيقة) في المحادثة.',

    // Contrb Cards
    v2_cont_c1_t: 'ماذا يمكنك تقديمه',
    v2_cont_c1_li1: 'روابط لصفحات حكومية سورية رسمية.',
    v2_cont_c1_li2: 'مسح ضوئي أو ملفات PDF لأدلة إجرائية متاحة للعامة.',
    v2_cont_c1_li3: 'تحديثات عند تغيير الرسوم أو النماذج أو المتطلبات.',
    v2_cont_c1_li4: 'تصحيحات للمحتوى الحالي.',
    v2_cont_c2_t: 'ما لا يجب تقديمه',
    v2_cont_c2_li1: 'معرّفات شخصية (رقم وطني، جواز سفر).',
    v2_cont_c2_li2: 'معلومات صحية أو مالية.',
    v2_cont_c2_li3: 'وثائق حكومية داخلية / سرية.',
    v2_cont_c2_li4: 'معلومات غير مؤكدة أو مضللة.',
    v2_cont_c3_t: 'مطور سوري AI',
    v2_dev_section_title: 'عن مطور سوري AI',
    v2_dev_section_subtitle: 'مشروع شخصي يُبنى ويتحسن تدريجياً',
    v2_dev_role: 'مطور برمجيات وذكاء اصطناعي',
    v2_cont_bio_p1: 'مطور برمجيات سوري مهتم ببناء أدوات مفيدة باستخدام البرمجيات والذكاء الاصطناعي.',
    v2_cont_bio_p2: 'يحمل درجة ماجستير في الذكاء الاصطناعي (MSc in Artificial Intelligence)، ويواصل التعلم والعمل على مشاريع شخصية تهدف إلى تبسيط التقنية وجعلها أقرب للناس.',
    v2_cont_bio_p3: 'سوري AI هو مشروع شخصي بدأ كمحاولة لفهم الشأن السوري والمعاملات اليومية بشكل أوضح، ويتم تطويره وتحسينه تدريجياً بناءً على الاستخدام والتجربة.',
    v2_cont_email: 'البريد الإلكتروني',
    v2_cont_linkedin: 'LinkedIn',
    v2_cont_facebook: 'فيسبوك',

    // Tones
    v2_tone_formal: 'رسمي',
    v2_tone_casual: 'شعبي',
    v2_tone_humorous: 'خفيف دم',
    v2_tone_educational: 'تعليمي',
    // Tone Prompts
    v2_tone_formal_prompt: "أجب بأسلوب رسمي، واضح، مهني، وباللغة العربية الفصحى.",
    v2_tone_casual_prompt: "أجب بأسلوب شعبي سوري، ودّي، بسيط، ومفهوم للناس العاديين بدون تعقيد.",
    v2_tone_humorous_prompt: "أجب بأسلوب خفيف دم ولطيف، مع لمسة فكاهة بسيطة ومحترمة، بدون سخرية أو تقليل من أهمية الموضوع.",
    v2_tone_educational_prompt: "أجب بأسلوب تعليمي، خطوة بخطوة، مع شرح مبسّط وأمثلة عند الحاجة، وكأنك تشرح لطالب.",
    // Accents
    v2_accent_halabi: 'حلبي',
    v2_accent_shami: 'شامي',
    v2_accent_saheli: 'ساحلي',
    v2_accent_hamawi: 'حموي',
    v2_accent_idlibi: 'إدلبي',
    v2_accent_homsi: 'حمصي',
    v2_accent_deiri: 'ديري',
    v2_accent_placeholder: 'اللهجة',

    // About / RAG
    v2_howItWorks_menu: 'عن سوري AI',
    v2_howItWorks_title: 'كيف يعمل سوري AI؟',
    v2_rag_step1: 'معالجة المستندات',
    v2_rag_desc1: 'يقرأ سوري الأدلة الرسمية والإجراءات الحكومية من ملفات PDF.',
    v2_rag_step2: 'الفهرسة',
    v2_rag_desc2: 'يتم تقسيم المحتوى وتخزينه للبحث السريع.',
    v2_rag_step3: 'الفهم الذكي',
    v2_rag_desc3: 'عندما تسأل، يبحث الذكاء الاصطناعي عن المعلومات الأكثر صلة.',
    v2_rag_step4: 'الإجابة',
    v2_rag_desc4: 'يتم صياغة إجابة دقيقة بناءً على المصادر الرسمية.',

    // Knowledge Base Stats
    v2_kb_title: 'تغطية قاعدة المعرفة',
    v2_kb_subtitle: 'يستخدم الاسترجاع عبر قاعدة معرفية منسقة (RAG)',
    v2_kb_stat_docs: 'وثيقة مفهرسة',
    v2_kb_stat_files: 'ملف',
    v2_kb_desc_docs: 'يسترجع الإجابات من أكثر من 15,000 وثيقة مفهرسة',    
    // Sources Section
    v2_src_title: 'المصادر وتغطية البيانات',
    v2_src_desc: 'يستمد المساعد معلوماته من مجموعة منقحة من المصادر الرسمية المتاحة للعموم. تُستخدم هذه المصادر كمرجع للبحث والاسترجاع فقط، ولا تُستخدم لتدريب نموذج الذكاء الاصطناعي.',
    v2_src_web_title: 'المواقع الرسمية',
    v2_src_tele_title: 'قنوات تلغرام الرسمية',  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'ar' || stored === 'en') return stored;
    }
    return 'ar'; // Default to Arabic
  });

  // Keep document direction in sync
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang(l => (l === 'en' ? 'ar' : 'en'));
  }, []);

  const setLanguage = useCallback((l: LanguageCode) => setLang(l), []);

  const t = useCallback(
    (key: string) => {
      return messages[lang][key] || key;
    },
    [lang]
  );

  const value: LanguageContextValue = {
    lang,
    toggleLanguage,
    setLanguage,
    t,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
