'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@snoopdoc/ui';
import { logout } from '@/features/auth/api/logout';

export function Dashboard() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleLogout() {
        setIsLoggingOut(true);
        setErrorMessage('');
        
        try {
            await logout();
            router.replace('/');
            
        } catch (error) {
            setIsLoggingOut(false);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'Unable to log out. Please try again.',
            )
        }
    }

    return (
        <div>
            <h1>
                Welcome to Snoopdoc
            </h1>
            <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
            >
                {isLoggingOut ? 'Logging Out' : 'Log Out'}
            </Button>

            {errorMessage && (
                <p role="alert" className="text-sm text-destructive">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
