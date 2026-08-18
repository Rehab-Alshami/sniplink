// navigator.clipboard.writeText() requires a "secure context" — HTTPS, or
// the host being `localhost`. It's unavailable/rejected on plain HTTP,
// which includes testing over a LAN IP from a phone (e.g.
// http://192.168.0.220:3100) even though the button's click handler fires
// fine. Fall back to the legacy document.execCommand("copy") technique
// (via a hidden, off-screen textarea), which isn't gated behind a secure
// context, before giving up.
export async function copyText(text: string): Promise<boolean> {
  const canUseModernApi =
    typeof navigator !== "undefined" && !!navigator.clipboard && window.isSecureContext

  if (canUseModernApi) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to the legacy method below.
    }
  }

  return legacyCopy(text)
}

function legacyCopy(text: string): boolean {
  try {
    const textarea = document.createElement("textarea")
    textarea.value = text
    // Keep it out of view/tab order without display:none — some browsers
    // refuse to select() a hidden element.
    Object.assign(textarea.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "1px",
      height: "1px",
      padding: "0",
      border: "none",
      opacity: "0",
    })
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}
