export const InstructionText = () => {
  return (
    <div className="w-[1400px] text-primary-input-text">
      <p className="mb-5">
        Load Sales History function allows you to upload historical sales data into Segue for any archived Productions.
        <br />
        When you successfully upload the completed template containing your sales data, Segue will automatically update
        the archived Production’s Booking Dates, Sales Activity and this information will be carried through to the
        Venue History and Archived Sales reports to allow future sales comparison.
      </p>
      <p>
        <b>PLEASE NOTE:</b> The historical sales data upload will OVERWRITE existing booking and sales information for a
        production. If required, this upload should take place prior to a production being populated with booking,
        marketing, tasks or contract information. If a production has already been extensively populated – manual sales
        entry may be the preference using the <b>{`Marketing > Sales Entry page`}</b>.
      </p>
      <p>Key Points</p>
      <ul className="list-disc pl-7">
        <li>
          You can only upload sales data to a production which has been created and
          <b>archived</b>. To create and archive a production go to <b>{`Bookings > Manage Shows/Productions`}</b> on
          the main menu.
        </li>
        <li>
          If you are new to Segue and wish to upload sales for a current production which is still on sale you can do
          this by creating the production, archiving it, uploading the data then editing the production to unarchive
          after the data has been uploaded. The production will become active again and you can continue to add your
          weekly sales figures.
        </li>
        <li>You can only upload data on the template supplied via the “Download Template” button</li>
      </ul>
      <p>
        For full instructions, please download the Sales History Instructions pdf by clicking on the ‘Instructions’
        button.
      </p>
      <p>
        If you have any issues uploading historical sales data please do not hesitate to contact{' '}
        <u>support@segue360.co.uk</u> for further support.
      </p>
    </div>
  );
};

export default InstructionText;
