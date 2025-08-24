import { LoginForm } from "@/components/auth/login-form"
import { SeederInitializer } from "@/components/seeder-initializer"

export default function HomePage() {
  return (
    <>
      <SeederInitializer />
      <LoginForm />
    </>
  )
}
