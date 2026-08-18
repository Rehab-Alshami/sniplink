import type { Dictionary } from "./types"

export const en: Dictionary = {
  common: {
    appName: "Sniplink",
  },
  header: {
    dashboard: "Dashboard",
    signIn: "Sign in",
    signOut: "Sign out",
  },
  theme: {
    label: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  language: {
    label: "Language",
  },
  home: {
    badge: "Short links + QR codes, instantly",
    titlePrefix: "Make long links short and",
    titleHighlight: "scannable",
    subtitle:
      "Shorten any URL, generate a QR code, and share it anywhere — on a business card, a poster, or a post. No account required to start.",
    features: {
      instant: {
        title: "Instant short links",
        description:
          "Paste any long URL and get a clean, shareable link in a single click.",
      },
      qr: {
        title: "Auto QR codes",
        description:
          "Every link comes with a downloadable QR code — perfect for print and ads.",
      },
      analytics: {
        title: "Click analytics",
        description:
          "Sign in to track visits over time and manage all your links in one place.",
      },
    },
    footerTagline: "Built with Next.js, Prisma & NextAuth",
  },
  shortenForm: {
    urlPlaceholder: "Paste a long URL, e.g. https://example.com/very/long/path",
    shortenButton: "Shorten",
    customAliasToggle: "Custom alias (optional)",
    aliasPlaceholder: "my-custom-link",
    shortenAnother: "Shorten another link",
    toastSuccess: "Short link ready",
    toastError: "Something went wrong. Please try again.",
  },
  validation: {
    urlRequired: "Please enter a URL",
    urlInvalid: "Enter a valid URL, including http:// or https://",
    urlProtocol: "Only http and https URLs are allowed",
    aliasInvalid: "Alias must be 3-32 characters (letters, numbers, - or _)",
  },
  errors: {
    invalid_input: "Invalid input. Please check the form and try again.",
    reserved_alias: "That alias is reserved. Try another one.",
    alias_taken: "That custom alias is already taken.",
    unauthenticated: "You must be signed in.",
    not_found: "Link not found.",
    failed: "Could not delete the link.",
  },
  linkResult: {
    label: "Your short link",
    copy: "Copy link",
    copied: "Copied",
    copySuccess: "Short link copied to clipboard",
    copyError: "Couldn't copy — copy it manually",
    downloadQr: "Download QR",
    downloadSuccess: "QR code downloaded",
    previewNotice:
      "Preview mode: this link was generated but not saved yet. Connect your local PostgreSQL database via Prisma to persist links and enable redirects.",
  },
  dashboard: {
    heading: "Your links",
    welcomeBack: "Welcome back, {name}.",
    manageSubtitle: "Manage and track all your short links.",
    statsTotalLinks: "Total links",
    statsTotalClicks: "Total clicks",
    statsLastVisit: "Last visit",
    emptyTitle: "No links yet",
    emptyDescription:
      "Shorten your first URL from the homepage and it will show up here.",
    createLink: "Create a short link",
    tableShortLink: "Short link",
    tableDestination: "Destination",
    tableCreated: "Created",
    tableClicks: "Clicks",
    linkActions: "Link actions",
    copyLink: "Copy link",
    showQr: "Show QR code",
    delete: "Delete",
    qrDialogTitle: "QR code",
    downloadPng: "Download PNG",
    deleteDialogTitle: "Delete this link?",
    deleteDialogDescription:
      "{code} will stop working immediately and its click history will be removed. This can't be undone.",
    cancel: "Cancel",
    deleteLink: "Delete link",
    toastDeleted: "Link deleted",
    toastCopySuccess: "Short link copied",
    toastCopyError: "Couldn't copy link",
  },
  login: {
    heading: "Sign in to Sniplink",
    subtitle: "Save your links and track clicks from a personal dashboard.",
    continueWithGoogle: "Continue with Google",
    terms: "By continuing you agree to our Terms of Service and Privacy Policy.",
    backToHome: "Back to home",
  },
  notFound: {
    eyebrow: "404 — link not found",
    heading: "This short link doesn't exist",
    description:
      "The link may have been deleted, mistyped, or it was never created. Double-check the URL, or create a fresh short link of your own.",
    cta: "Shorten a new link",
  },
}
