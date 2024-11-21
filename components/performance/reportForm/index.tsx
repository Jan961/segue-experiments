import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { isValid } from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { formSchema } from './formYupValidation';
import { Report as ReportType, ReportFormInputs } from 'types/report';
import { ErrorMsg } from './ErrorMsg';
import { AreaField } from './AreaField';
import { TextField } from './TextField';
import { TimeRange } from './TimeRange';
import { StyledTimeField } from './StyledTimeField';
import { GetOutField } from './GetOutField';
import { dateTimeToTime, formatDuration, formattedDateWithWeekDay, getDuration } from 'services/dateService';

interface ReportFormProps {
  bookingId?: string;
  performanceId?: string;
  reportData?: Omit<ReportType, 'bookingId' | 'performanceId'>;
  reportImageUrl?: string;
  editable: boolean;
}

const ReportForm = ({
  bookingId,
  performanceId,
  reportData,
  reportImageUrl,
  editable,
}: ReportFormProps): React.JSX.Element => {
  const { venue, town, performanceDate, performanceTime, csm, lighting, asm } = reportData ?? {};

  const formatPerformanceTime =
    performanceTime !== undefined && isValid(performanceTime) ? dateTimeToTime(performanceTime) : '';
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: yupResolver(formSchema),
    values: {
      actOneDownTime: reportData?.actOneDownTime ?? '',
      intervalDownTime: reportData?.intervalDownTime ?? '',
      actTwoDownTime: reportData?.actTwoDownTime ?? '',
      getOutTime: reportData?.getOutTime ?? '',
      castCrewAbsence: reportData?.castCrewAbsence ?? '',
      dutyTechnician: reportData?.dutyTechnician ?? '',
      castCrewInjury: reportData?.castCrewInjury ?? '',
      technicalNote: reportData?.technicalNote ?? '',
      performanceNote: reportData?.performanceNote ?? '',
      setPropCustumeNote: reportData?.setPropCustumeNote ?? '',
      audienceNote: reportData?.audienceNote ?? '',
      merchandiseNote: reportData?.merchandiseNote ?? '',
      generalRemarks: reportData?.generalRemarks ?? '',
      distributionList: reportData?.distributionList ?? '',
      performanceTime: formatPerformanceTime,
      actOneUpTime: formatPerformanceTime,
    },
  });
  const actOneDuration = getDuration(watch('actOneUpTime'), watch('actOneDownTime'));
  const actTwoDuration = getDuration(watch('intervalDownTime'), watch('actTwoDownTime'));
  const intervalDuration = getDuration(watch('actOneDownTime'), watch('intervalDownTime'));
  const getOutDuration = getDuration(watch('actTwoDownTime'), watch('getOutTime'));
  const isReportData = bookingId !== undefined && performanceId !== undefined && reportData !== undefined;
  const onSubmit: SubmitHandler<ReportType> = async (data: Partial<ReportFormInputs>) => {
    if (!isReportData) return;
    const payload = {
      ...data,
      venue,
      town,
      performanceDate,
      performanceTime,
      csm,
      lighting,
      asm,
      actOneDuration,
      actTwoDuration,
      intervalDuration,
      getOutDuration,
      bookingId,
      performanceId,
      reportImageUrl,
    };
    try {
      const res = await axios.post('/api/performance/reports/create', payload);
      console.log(res);
      window.alert('Report created succesfully');
    } catch (err) {
      console.log(err);
      window.alert('Failed to create report');
    }
  };
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit(onSubmit)(event);
      }}
    >
      <div className="lg:flex lg:gap-8">
        <div className="lg:flex-1 flex flex-col gap-4">
          <TextField label="Venue" value={venue ?? ''} disabled />
          <TextField label="Town" value={town ?? ''} disabled />

          {/*  ACT ONE */}
          <TimeRange
            label="Act One"
            up={
              <StyledTimeField
                value={getValues('actOneUpTime')}
                onChange={(e, v) => setValue('actOneUpTime', v)}
                disabled={!editable}
              />
            }
            down={
              <StyledTimeField
                value={getValues('actOneDownTime')}
                onChange={(e, v) => setValue('actOneDownTime', v)}
                disabled={!editable}
              />
            }
            duration={actOneDuration}
            error={
              <>
                {errors.actOneUpTime !== undefined && <ErrorMsg>{errors.actOneUpTime?.message}</ErrorMsg>}
                {errors.actOneDownTime !== undefined && <ErrorMsg>{errors.actOneDownTime?.message}</ErrorMsg>}
              </>
            }
          />

          {/* INTERVAL */}
          <TimeRange
            label="Interval"
            up={
              <output className="w-14 px-1">
                {watch('actOneDownTime') !== '' ? watch('actOneDownTime') : '00:00'}
              </output>
            }
            down={
              <StyledTimeField
                value={getValues('intervalDownTime')}
                onChange={(e, v) => setValue('intervalDownTime', v)}
                disabled={!editable}
              />
            }
            duration={intervalDuration}
            error={
              <> {errors.intervalDownTime !== undefined && <ErrorMsg>{errors.intervalDownTime.message}</ErrorMsg>}</>
            }
          />

          {/* ACT TWO */}
          <TimeRange
            label="Act Two"
            up={
              <output className="w-14 px-1">
                {watch('intervalDownTime') !== '' ? watch('intervalDownTime') : '00:00'}
              </output>
            }
            down={
              <StyledTimeField
                value={getValues('actTwoDownTime')}
                onChange={(e, v) => setValue('actTwoDownTime', v)}
                disabled={!editable}
              />
            }
            duration={actTwoDuration}
            error={<>{errors.actTwoDownTime !== undefined && <ErrorMsg>{errors.actTwoDownTime.message}</ErrorMsg>}</>}
          />

          {/* GET OUT */}
          <GetOutField
            inputTime={
              <StyledTimeField
                value={getValues('getOutTime')}
                onChange={(e, v) => setValue('getOutTime', v)}
                disabled={!editable}
              />
            }
            error={<> {errors.getOutTime !== undefined && <ErrorMsg>{errors.getOutTime.message}</ErrorMsg>}</>}
          />

          {/* GET OUT DURATION */}
          <TimeRange
            label="Get Out Duration"
            up={
              <output className="w-14 px-1">
                {watch('actTwoDownTime') !== '' ? watch('actTwoDownTime') : '00:00'}
              </output>
            }
            down={<output className="w-14 px-1">{watch('getOutTime') !== '' ? watch('getOutTime') : '00:00'}</output>}
            duration={getOutDuration}
          />

          <AreaField {...register('castCrewAbsence')} label="Cast/Crew Lateness/ Absence" disabled={!editable} />
        </div>

        <div className="lg:flex-1 flex flex-col gap-4 mt-4 lg:mt-0 ">
          <TextField
            label="Performance Date"
            value={
              performanceDate !== undefined && isValid(performanceDate)
                ? formattedDateWithWeekDay(performanceDate, 'Long')
                : ''
            }
            disabled
          />
          <TextField
            label="Performance Time"
            value={performanceTime !== undefined && isValid(performanceTime) ? dateTimeToTime(performanceTime) : ''}
            disabled
          />
          <TextField
            label="Performance Duration"
            value={
              actOneDuration > 0 && actTwoDuration > 0
                ? formatDuration(actOneDuration + actTwoDuration, {
                    h: ' Hours',
                    m: ' Minutes',
                  })
                : ''
            }
            disabled
          />
          <TextField label="CSM" value={csm ?? ''} />
          <TextField label="Lighting" value={lighting ?? ''} />
          <TextField label="ASM" value={asm ?? ''} />
          {/* DUTY TECHNICIAN */}
          <div>
            <TextField {...register('dutyTechnician')} label="Duty Technician" disabled={!editable} />
            {errors.dutyTechnician !== undefined && <ErrorMsg>{errors.dutyTechnician.message}</ErrorMsg>}
          </div>

          <AreaField {...register('castCrewInjury')} label="Cast/Crew illness/ Injury" disabled={!editable} />
        </div>
      </div>
      <div className="mt-4 flex-1 flex flex-col gap-4">
        <AreaField {...register('technicalNote')} label="Technical Note" disabled={!editable} />
        <AreaField {...register('performanceNote')} label="Performance Notes" disabled={!editable} />
        <AreaField {...register('setPropCustumeNote')} label="Set/Prop/Costume Notes" disabled={!editable} />
        <AreaField {...register('audienceNote')} label="Audience Notes" disabled={!editable} />
        <AreaField {...register('merchandiseNote')} label="Merchandise Notes" disabled={!editable} />
        <AreaField {...register('generalRemarks')} label="General Remarks" disabled={!editable} />
        <AreaField {...register('distributionList')} label="Distribution List" disabled={!editable} />
      </div>

      {!isReportData && isSubmitted && <ErrorMsg>Please select booking and performance to generate report</ErrorMsg>}

      {editable && (
        <div className="mt-8 flex justify-end pb-10">
          <button className="px-5 py-2 bg-green-600  text-white font-bold rounded-md hover:bg-green-500" type="submit">
            SAVE
          </button>
        </div>
      )}
    </form>
  );
};

export default ReportForm;
