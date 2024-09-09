import { NextApiRequest, NextApiResponse } from 'next';
import { SpreadsheetDataCleaned } from 'types/SpreadsheetValidationTypes';
import { uploadFile } from 'requests/upload';

// Create the file.
// Update productionfile table
// create bookings/sales

// nb - do the last two in one transaction so that if one fails it rollsback them all

interface RequestBody {
  spreadsheetData: SpreadsheetDataCleaned;
  onProgress: (file: File, uploadProgress: number) => void;
  onError: (file: File, errorMessage: string) => void;
  onUploadingImage: (file: File, imageUrl: string) => void;
  formData: FormData;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { formData, onProgress, onError, onUploadingImage }: RequestBody = req.body;
    const fileCreationResponse = await uploadFile(formData, onProgress, onError, onUploadingImage, {
      onSuccess: 'Spreadsheet File Object uploaded successfully',
      onFailure: 'Spreadsheet failed to upload',
    });
    console.log(fileCreationResponse);
    console.log(res);
  } catch (error) {
    console.log(error, 'Error creating file.');
  }
}
