import {redirect} from 'next/navigation';

export default function AdminRedirect({params}: { params: { params?: string[] } }) {
    const suffix = params.params?.length ? `/${params.params.join('/')}` : '';
    redirect(`/keystatic${suffix}`);
}
