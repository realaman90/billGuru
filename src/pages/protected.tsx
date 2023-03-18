import { useSession } from "next-auth/react";


export default function Home() {
    const { data: session, status } = useSession();
    console.log(session)
    
    return (
        <>
        <h1>Next.js + NextAuth.js Example</h1>
        <p>
            This is an example of how to use{" "}
            <a href="https://next-auth.js.org">NextAuth.js</a> with{" "}
            <a href="https://nextjs.org">Next.js</a>.
        </p>
        <p>
            <a href="/api/auth/signin">Sign in</a> to get started.
        </p>
        {session && (
            <>
            <h2>Session</h2>
            <pre>{JSON.stringify(session, null, 2)}</pre>
            </>
        )}
        </>
    );
    }
