import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NammaFix - Citizen Portal',
  description: 'Report and track civic issues in your community',
}

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
