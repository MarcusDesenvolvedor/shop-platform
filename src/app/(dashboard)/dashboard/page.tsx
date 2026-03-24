export default function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-3 p-8">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground">
        Authentication is active and this area is protected for signed-in users.
      </p>
    </main>
  );
}
