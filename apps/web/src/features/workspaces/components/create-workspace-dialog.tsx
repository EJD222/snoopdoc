"use client";

import { CreateWorkspaceRequest, type TCreateWorkspaceRequest } from "@snoopdoc/types";
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Label } from "@snoopdoc/ui";
import { Resolver, useForm } from "react-hook-form";
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { createWorkspace } from "../api/create-workspace";

type CreateWorkspaceDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceDialog({ open, onOpenChange }: CreateWorkspaceDialogProps) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<TCreateWorkspaceRequest>({
        defaultValues: {
            name: ''
        },
        resolver: arktypeResolver(CreateWorkspaceRequest) as unknown as Resolver<TCreateWorkspaceRequest>
    })

    const onSubmit = async (data: TCreateWorkspaceRequest) => {
        try {
            await createWorkspace(data);
            onOpenChange(false);
        } catch (error) {
            setError("name", {
                type: "server",
                message: (error as Error).message,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create workspace </DialogTitle>
                    <DialogDescription>
                        Enter your workspace details to get started.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter your workspace name" {...register("name")} />
                        {errors.name && (<p>{errors.name.message}</p>)}
                    </div>
                    <Button type="submit" disabled={isSubmitting}> {isSubmitting ? "Creating..." : "Create workspace"} </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}   