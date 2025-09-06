export const dynamic = 'force-dynamic';
export const revalidate = false;
export const runtime = 'nodejs';

export default function KeystaticLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return children;
}
