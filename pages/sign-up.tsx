import { SignUp } from '@clerk/nextjs'
import { FormInfo } from 'components/global/forms/FormInfo'
import { useRouter } from 'next/router'

export default function Page () {
  const router = useRouter()
  const { error } = router.query

  return (
    <div className="background-gradient">
      <div className="w-full flex flex-col items-center justify-center p-4">
        { error === 'notfound' && (
          <FormInfo header="Account not found" intent='DANGER' className="w-80">
            <p>Please sign up to continue</p>
          </FormInfo>
        )}
        <SignUp />
      </div>
    </div>
  )
}
