import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NammaFix - Media Portal',
  description: 'Investigative journalism platform for civic transparency',
}

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
