export const locales = ["en", "ar"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

// The dictionary shape both locale files must satisfy. Keys are grouped by
// feature/component so translators can find the right section quickly.
export interface Dictionary {
  common: {
    appName: string
  }
  header: {
    dashboard: string
    signIn: string
    signOut: string
  }
  theme: {
    label: string
    light: string
    dark: string
    system: string
  }
  language: {
    label: string
  }
  home: {
    badge: string
    titlePrefix: string
    titleHighlight: string
    subtitle: string
    features: {
      instant: { title: string; description: string }
      qr: { title: string; description: string }
      analytics: { title: string; description: string }
    }
    footerTagline: string
  }
  shortenForm: {
    urlPlaceholder: string
    shortenButton: string
    customAliasToggle: string
    aliasPlaceholder: string
    shortenAnother: string
    toastSuccess: string
    toastError: string
  }
  validation: {
    urlRequired: string
    urlInvalid: string
    urlProtocol: string
    aliasInvalid: string
  }
  errors: {
    invalid_input: string
    reserved_alias: string
    alias_taken: string
    unauthenticated: string
    not_found: string
    failed: string
  }
  linkResult: {
    label: string
    copy: string
    copied: string
    copySuccess: string
    copyError: string
    downloadQr: string
    downloadSuccess: string
    previewNotice: string
  }
  dashboard: {
    heading: string
    welcomeBack: string
    manageSubtitle: string
    statsTotalLinks: string
    statsTotalClicks: string
    statsLastVisit: string
    emptyTitle: string
    emptyDescription: string
    createLink: string
    tableShortLink: string
    tableDestination: string
    tableCreated: string
    tableClicks: string
    linkActions: string
    copyLink: string
    showQr: string
    delete: string
    qrDialogTitle: string
    downloadPng: string
    deleteDialogTitle: string
    deleteDialogDescription: string
    cancel: string
    deleteLink: string
    toastDeleted: string
    toastCopySuccess: string
    toastCopyError: string
  }
  login: {
    heading: string
    subtitle: string
    continueWithGoogle: string
    terms: string
    backToHome: string
  }
  notFound: {
    eyebrow: string
    heading: string
    description: string
    cta: string
  }
}
