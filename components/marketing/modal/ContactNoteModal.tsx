// import { useEffect, useState } from 'react';
// import PopupModal from 'components/core-ui-lib/PopupModal';
// import TextInput from 'components/core-ui-lib/TextInput';
// import Select, { SelectOption } from 'components/core-ui-lib/Select/Select';
// import classNames from 'classnames';
// import DateInput from 'components/core-ui-lib/DateInput';
// import Checkbox from 'components/core-ui-lib/Checkbox';
// import TextArea from 'components/core-ui-lib/TextArea/TextArea';
// import Button from 'components/core-ui-lib/Button';
// import { BookingContactNoteDTO } from 'interfaces';

// export type ContactNoteModalVariant = 'add' | 'edit';

// const titleOptions = {
//   add: 'Add New Contact Note',
//   edit: 'Edit Contact Note',
// };

// interface ContactModalProps {
//   show: boolean;
//   onCancel: () => void;
//   onSave: (variant: ContactNoteModalVariant, data: BookingContactNoteDTO) => void;
//   variant: ContactNoteModalVariant;
//   activityTypes: Array<SelectOption>;
//   venueCurrency?: string;
//   bookingId;
//   data?: BookingContactNoteDTO;
// }

// export default function ContactNoteModal({
//   show = false,
//   onCancel,
//   variant,
//   onSave,
//   activityTypes,
//   venueCurrency = '£',
//   bookingId,
//   data,
// }: Partial<ContactModalProps>) {
//   const [visible, setVisible] = useState<boolean>(show);
//   const [personContacted, setPersonContacted] = useState<string>(null);
//   const [date, setDate] = useState<Date>();
//   const [actionedBy, setActionedBy] = useState<Date>();
//   const [actFollowUp, setActFollowUp] = useState<boolean>(false);
//   const [followUpDt, setFollowUpDt] = useState<Date>();
//   const [companyCost, setCompanyCost] = useState<string>();
//   const [venueCost, setVenueCost] = useState<string>();
//   const [actNotes, setActNotes] = useState<string>();

//   useEffect(() => {
//     setVisible(show);
//     //initForm();
//   }, [show]);

//     // const initForm = () => {
//     //   if (variant === 'add') {
//     //     setActName('');
//     //     setActType(null);
//     //     setActDate(null);
//     //     setActFollowUp(false);
//     //     setFollowUpDt(null);
//     //     setCompanyCost('');
//     //     setVenueCost('');
//     //     setActNotes('');
//     //   } else if (variant === 'edit') {
//     //     setActName(data.Name);
//     //     setActType(data.ActivityTypeId);
//     //     setActDate(new Date(data.Date));
//     //     setActFollowUp(data.FollowUpRequired);
//     //     setFollowUpDt(new Date(data.DueByDate));
//     //     setCompanyCost(data.CompanyCost.toString());
//     //     setVenueCost(data.VenueCost.toString());
//     //     setActNotes(data.Notes);
//     //   }
//     // };

//   //   const handleSave = () => {
//   //     let data: ActivityDTO = {
//   //       ActivityTypeId: actType,
//   //       BookingId: bookingId,
//   //       CompanyCost: parseFloat(companyCost),
//   //       VenueCost: parseFloat(venueCost),
//   //       Date: actDate,
//   //       FollowUpRequired: actFollowUp,
//   //       Name: actName,
//   //       Notes: actNotes,
//   //     };

//   //     // only add the follow up date if the followUp required checkbox has been checked
//   //     if (actFollowUp) {
//   //       data = { ...data, DueByDate: followUpDt };
//   //     }

//   //     onSave(variant, data);
//   //   };

//   return (
//     <PopupModal show={visible} onClose={onCancel} showCloseIcon={true} hasOverlay={false}>
//       <div className="h-[526px] w-[404px]">
//         <div className="text-xl text-primary-navy font-bold mb-4">{titleOptions[variant]}</div>
//         <div className="text-base font-bold text-primary-input-text">Name of Person Contacted</div>
//         <TextInput
//           className="w-full mb-4"
//           placeholder="Enter Person Contacted"
//           id="input"
//           value={}
//           onChange={(event) => setActName(event.target.value)}
//         />

//         <div className="flex flex-row gap-20">
//           <div className="flex flex-col">
//             <div className="text-base font-bold text-primary-input-text">Date</div>
//             <DateInput
//               onChange={(value) => setActDate(value)}
//               value={actDate}
//               label="Date"
//               labelClassName="text-primary-input-text"
//             />
//           </div>

//           <div className="flex flex-col">
//             <div className="text-base font-bold text-primary-input-text">Time</div>
//             <TextInput
//               className="w-full mb-4"
//               placeholder="Enter Person Contacted"
//               id="input"
//               value={actName}
//               onChange={(event) => setActName(event.target.value)}
//             />
//           </div>
//         </div>

//         <div className="text-base font-bold text-primary-input-text">Actioned By</div>
//         <TextInput
//           className="w-full mb-4"
//           placeholder="Enter Person Contacted"
//           id="input"
//           value={actName}
//           onChange={(event) => setActName(event.target.value)}
//         />

//         <div className="text-base font-bold text-primary-input-text">Notes</div>
//         <TextArea
//           className={'mt-2 h-[162px] w-full'}
//           value={actNotes}
//           placeholder="Notes Field"
//           onChange={(e) => setActNotes(e.target.value)}
//         />

//         <div className="float-right flex flex-row mt-5 py-2">
//           <Button className="ml-4 w-[132px]" onClick={onCancel} variant="secondary" text="Cancel" />
//           <Button className="ml-4 w-[132px] mr-1" variant="primary" text="Save and Close" />
//         </div>
//       </div>
//     </PopupModal>
//   );
// }
