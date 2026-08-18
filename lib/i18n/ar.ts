import type { Dictionary } from "./types"

export const ar: Dictionary = {
  common: {
    appName: "سنيب لينك",
  },
  header: {
    dashboard: "لوحة التحكم",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
  },
  theme: {
    label: "المظهر",
    light: "فاتح",
    dark: "داكن",
    system: "حسب النظام",
  },
  language: {
    label: "اللغة",
  },
  home: {
    badge: "روابط مختصرة ورموز QR، فورًا",
    titlePrefix: "حوّل الروابط الطويلة إلى روابط قصيرة",
    titleHighlight: "وقابلة للمسح الضوئي",
    subtitle:
      "اختصر أي رابط، أنشئ رمز QR له، وشاركه في أي مكان — على بطاقة عمل، أو ملصق، أو منشور. لا حاجة لإنشاء حساب للبدء.",
    features: {
      instant: {
        title: "روابط مختصرة فورية",
        description: "الصق أي رابط طويل واحصل على رابط أنيق وقابل للمشاركة بنقرة واحدة.",
      },
      qr: {
        title: "رموز QR تلقائية",
        description: "يأتي كل رابط برمز QR قابل للتنزيل — مثالي للطباعة والإعلانات.",
      },
      analytics: {
        title: "إحصاءات النقرات",
        description: "سجّل الدخول لتتبع الزيارات بمرور الوقت وإدارة جميع روابطك من مكان واحد.",
      },
    },
    footerTagline: "بُني باستخدام Next.js و Prisma و NextAuth",
  },
  shortenForm: {
    urlPlaceholder: "الصق رابطًا طويلاً، مثل https://example.com/very/long/path",
    shortenButton: "اختصار",
    customAliasToggle: "اسم مستعار مخصص (اختياري)",
    aliasPlaceholder: "my-custom-link",
    shortenAnother: "اختصار رابط آخر",
    toastSuccess: "الرابط المختصر جاهز",
    toastError: "حدث خطأ ما. حاول مرة أخرى.",
  },
  validation: {
    urlRequired: "يرجى إدخال رابط",
    urlInvalid: "أدخل رابطًا صالحًا، بما في ذلك http:// أو https://",
    urlProtocol: "يُسمح فقط بروابط http و https",
    aliasInvalid: "يجب أن يتكون الاسم المستعار من 3-32 حرفًا (أحرف إنجليزية، أرقام، - أو _)",
  },
  errors: {
    invalid_input: "إدخال غير صالح. يرجى التحقق من النموذج والمحاولة مرة أخرى.",
    reserved_alias: "هذا الاسم المستعار محجوز. جرّب اسمًا آخر.",
    alias_taken: "هذا الاسم المستعار مُستخدم بالفعل.",
    unauthenticated: "يجب تسجيل الدخول أولاً.",
    not_found: "الرابط غير موجود.",
    failed: "تعذّر حذف الرابط.",
  },
  linkResult: {
    label: "رابطك المختصر",
    copy: "نسخ الرابط",
    copied: "تم النسخ",
    copySuccess: "تم نسخ الرابط المختصر إلى الحافظة",
    copyError: "تعذّر النسخ — انسخه يدويًا",
    downloadQr: "تنزيل رمز QR",
    downloadSuccess: "تم تنزيل رمز QR",
    previewNotice:
      "وضع المعاينة: تم إنشاء هذا الرابط لكن لم يُحفظ بعد. اربط قاعدة بيانات PostgreSQL المحلية عبر Prisma لحفظ الروابط وتفعيل إعادة التوجيه.",
  },
  dashboard: {
    heading: "روابطك",
    welcomeBack: "مرحبًا بعودتك، {name}.",
    manageSubtitle: "إدارة وتتبع جميع روابطك المختصرة.",
    statsTotalLinks: "إجمالي الروابط",
    statsTotalClicks: "إجمالي النقرات",
    statsLastVisit: "آخر زيارة",
    emptyTitle: "لا توجد روابط بعد",
    emptyDescription: "اختصر أول رابط لك من الصفحة الرئيسية وسيظهر هنا.",
    createLink: "إنشاء رابط مختصر",
    tableShortLink: "الرابط المختصر",
    tableDestination: "الوجهة",
    tableCreated: "تاريخ الإنشاء",
    tableClicks: "النقرات",
    linkActions: "إجراءات الرابط",
    copyLink: "نسخ الرابط",
    showQr: "عرض رمز QR",
    delete: "حذف",
    qrDialogTitle: "رمز QR",
    downloadPng: "تنزيل PNG",
    deleteDialogTitle: "هل تريد حذف هذا الرابط؟",
    deleteDialogDescription:
      "سيتوقف {code} عن العمل فورًا وستُحذف سجلات نقراته. لا يمكن التراجع عن هذا الإجراء.",
    cancel: "إلغاء",
    deleteLink: "حذف الرابط",
    toastDeleted: "تم حذف الرابط",
    toastCopySuccess: "تم نسخ الرابط المختصر",
    toastCopyError: "تعذّر نسخ الرابط",
  },
  login: {
    heading: "تسجيل الدخول إلى سنيب لينك",
    subtitle: "احفظ روابطك وتتبع النقرات من لوحة تحكم شخصية.",
    continueWithGoogle: "المتابعة باستخدام Google",
    terms: "بالمتابعة، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.",
    backToHome: "العودة إلى الرئيسية",
  },
  notFound: {
    eyebrow: "404 — الرابط غير موجود",
    heading: "هذا الرابط المختصر غير موجود",
    description:
      "ربما تم حذف الرابط، أو كُتب بشكل خاطئ، أو لم يُنشأ أصلاً. تحقق من الرابط، أو أنشئ رابطًا مختصرًا جديدًا خاصًا بك.",
    cta: "اختصار رابط جديد",
  },
}
