import Image from 'next/image'

export const LoadingPage = () => {
  return (
    <div className="background-gradient h-screen flex justify-center items-center">
      <div className="w-48 text-center">
        <Image height="200" width="400" src="/segue/segue_logo.png" alt="Loading Icon" className="-mb-8" />
        <br />
        <h2 className="text-gray-600">Loading...</h2>
      </div>
    </div>
  )
}
