// Example: pages/login.tsx
import { SignIn } from "@clerk/nextjs";

export default function Login() {
  return (
    <div>
      <SignIn path="/logedin" routing="path" />
    </div>
  )
}
