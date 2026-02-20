export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-8">
        ページが見つかりませんでした
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        トップページへ戻る
      </a>
    </div>
  );
}
