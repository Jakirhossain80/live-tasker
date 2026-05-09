import AuthCard from '../../components/auth/AuthCard'
import AuthFooterLinks from '../../components/auth/AuthFooterLinks'
import AuthShell from '../../components/auth/AuthShell'
import RegisterForm from '../../components/auth/RegisterForm'

function Register() {
  return (
    <AuthShell>
      <AuthCard title="Create your account" subtitle="Join thousands of teams managing tasks efficiently.">
        <RegisterForm />
      </AuthCard>

      <AuthFooterLinks />
    </AuthShell>
  )
}

export default Register
