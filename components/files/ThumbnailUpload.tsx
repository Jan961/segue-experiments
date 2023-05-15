import { FormInputUpload } from 'components/global/forms/FormInputUpload'
import { ListItemThumbnail } from 'components/global/list/ListItemThumbnail'
import React from 'react'

interface ThumbnailUploadProps {
  path: string
  setPath: (path: string) => void
}

export const ThumbnailUpload = ({ path, setPath }: ThumbnailUploadProps) => {
  const [loading, setLoading] = React.useState(false)

  // Uploads to the public folder. Will not persist on deployment
  const uploadToClient = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      try {
        setLoading(true)
        const image = event.target.files[0]

        const fd = new FormData()
        fd.append('file', image)

        const response = await fetch('/api/fileUpload/upload', {
          method: 'POST',
          headers: {},
          body: fd
        })

        const json = await response.json()
        setPath(json.data)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <FormInputUpload label="Tour Logo" name="Logo" onChange={uploadToClient}>
      { loading && (<p>Uploading...</p>)}
      { path && (<ListItemThumbnail src={path} alt="Preview" />)}
    </FormInputUpload>
  )
}
