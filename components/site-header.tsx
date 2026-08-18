"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Link2, LayoutDashboard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLocale } from "@/components/providers/locale-provider"

export function SiteHeader() {
  const { data: session, status } = useSession()
  const { t } = useLocale()

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Link2 className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            {t("common.appName")}
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />

          {status === "authenticated" && session?.user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={
                  <Link href="/dashboard">
                    <LayoutDashboard className="size-4" />
                    <span className="hidden sm:inline">{t("header.dashboard")}</span>
                  </Link>
                }
              />
              <DropdownMenu>
                <DropdownMenuTrigger className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                  {session.user.name?.[0]?.toUpperCase() ??
                    session.user.email?.[0]?.toUpperCase() ??
                    "U"}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="truncate">
                      {session.user.email ?? session.user.name}
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="size-4" />
                    {t("header.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button size="sm" render={<Link href="/login">{t("header.signIn")}</Link>} />
          )}
        </nav>
      </div>
    </header>
  )
}
