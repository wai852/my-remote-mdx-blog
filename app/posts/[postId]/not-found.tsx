import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>404!</h1>
      <h2>The requested post does not exist!</h2>
      <Link href="/">← Back to home</Link>
    </div>
  );
}
