import { getBoards, createBoard, deleteBoard } from "@/actions/board";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function Dashboard() {
    const boards = await getBoards();

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Your Boards</h1>
                <UserButton />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Create New Board Form */}
                <Card className="boarder-dashed border-2">
                    <CardHeader>
                        <CardTitle>Create New Board</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={async (formData) => {
                            "use server";
                            const title = formData.get("title") as string;
                            if (title) await createBoard(title);
                        }}>
                            <Input name="title" placeholder="Board Name" required className="mb-4" />
                            <Button type="submit" className="w-full">Create</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Existing Boards List */}
                {boards.map((board) => (
                    <Link key={board.id} href={`/board/${board.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle>{board.title}</CardTitle>
                                <form action={async () => {
                                    "use server";
                                    await deleteBoard(board.id);
                                }}>
                                    <Button className="sm" variant="destructive">
                                        Delete
                                    </Button>
                                </form>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{new Date(board.createdAt).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}