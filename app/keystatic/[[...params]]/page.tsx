import {redirect} from 'next/navigation';
import {getServerSession} from 'next-auth/next';

import AdminChangePasswordForm from '@/components/AdminChangePasswordForm';
import {authOptions} from '@adapters/auth/nextauth';

import {KeystaticClient} from '../KeystaticClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function KeystaticPage({
                                                params,
                                                searchParams,
                                            }: {
    params: { params?: string[] };
    searchParams: Record<string, string | string[] | undefined>;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
        redirect('/admin/login');
    }

    if (session.user.mustChangePassword) {
        return (
            <AdminChangePasswordForm
                username={session.user.username ?? session.user.email ?? 'admin'}
            />
        );
    }

    return <KeystaticClient params={params} searchParams={searchParams}/>;
}
