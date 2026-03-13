import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NammaFix - Government Portal',
  description: 'Manage civic complaints and community issues',
}

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
