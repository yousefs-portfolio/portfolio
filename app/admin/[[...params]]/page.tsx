import { redirect } from 'next/navigation';

type AdminCatchAllProps = { params: { params?: string[] } };

export default function AdminCatchAll({ params }: AdminCatchAllProps) {
  const suffix = params.params?.length ? `/${params.params.join('/')}` : '';
  redirect(`/keystatic${suffix}`);
}
