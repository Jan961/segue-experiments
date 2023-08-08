import { SignIn } from '@clerk/nextjs'
import { FormInfo } from 'components/global/forms/FormInfo'
import { useRouter } from 'next/router'

export default function Page () {
  const router = useRouter()
  const { error } = router.query

  return (
    <div className="background-gradient">
      <div className="w-full flex flex-col items-center justify-center p-4">
        { error === 'exists' && (
          <FormInfo header="Email already in use" intent='DANGER' className="w-80">
            <p>Please login to continue</p>
          </FormInfo>
        )}
        <SignIn routing='hash'/>
      </div>
    </div>
  )
}
