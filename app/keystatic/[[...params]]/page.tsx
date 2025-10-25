import {redirect} from 'next/navigation';

type KeystaticParams = {
    params: {
        params?: string[];
    };
};

export default function KeystaticRedirect({params}: KeystaticParams) {
    const suffix = params.params?.length ? `/${params.params.join('/')}` : '';
    redirect(`/admin${suffix}`);
}
