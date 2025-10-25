'use client';

import type {ComponentType} from 'react';
import {makePage} from '@keystatic/next/ui/app';

import config from '@/keystatic/keystatic.config';

const KeystaticPage = makePage(config) as unknown as ComponentType<{
    params: { params?: string[] };
    searchParams: Record<string, string | string[] | undefined>;
}>;

export function KeystaticClient({
                                    params,
                                    searchParams,
                                }: {
    params: { params?: string[] };
    searchParams: Record<string, string | string[] | undefined>;
}) {
    const resolvedParams = {params: params.params ?? []};
    return <KeystaticPage params={resolvedParams} searchParams={searchParams ?? {}}/>;
}
