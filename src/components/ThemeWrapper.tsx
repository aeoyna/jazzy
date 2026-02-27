'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const theme = useAppStore((state) => state.theme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return <>{children}</>;
}
