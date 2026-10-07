"use client";

import { CreateWorkspaceDialog } from "@/features/workspaces/components/create-workspace-dialog";
import { Button } from "@snoopdoc/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function WorkspacePage() {
    const [open, setOpen] = useState(false);

    return (
        <main className="p-4">
            <div className="flex w-full justify-end">
                <Button onClick={() => setOpen(true)}>
                    <Plus />
                    Create workspace
                </Button>
            </div>

            <CreateWorkspaceDialog open={open} onOpenChange={setOpen} />

        </main>
    );
}