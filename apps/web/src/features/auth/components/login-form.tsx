"use client";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@snoopdoc/ui";
import { login } from "../api/login";
import { useState } from "react";

export function LoginForm() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        if (typeof email !== 'string' || typeof password !== 'string') {
            setStatus('error');
            setErrorMessage('Enter your email and password.');
            return;
        }

        try {
            await login({
                email,
                password,
            });

            setStatus('success');
        } catch (error) {
            setStatus('error');

            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('Something went wrong. Please try again.');
            }
        }   
    }

    const isSubmitting = status === 'submitting';

    return (
        <Card className="w-full max-w-md gap-6">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                    Login
                </CardTitle>

                <CardDescription>
                    Enter your credentials to access your account.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form 
                    className="flex flex-col gap-5"
                    onSubmit={handleSubmit}
                >

                {status === 'error' && (
                    <p role="alert" className="text-sm text-destructive">
                        {errorMessage}
                    </p>
                )}

                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}