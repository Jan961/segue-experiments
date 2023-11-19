import React from 'react'
import { Page, Text, View, Document, Image } from '@react-pdf/renderer'


const TableViewHorizantal = ({ data, headerStyle = {}, rowStyle = {} }:{data:any, headerStyle?:any, rowStyle?:any}) => {
  const count = Object.keys(data).length
  return <>{Object.entries(data).map(([key, value], i) => (
    <View
      key={key}
      style={{
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <View
        style={{
          textAlign: 'right',
          backgroundColor: '#ff00ff',
          borderTop: i === 0 ? 'none' : '1px solid #EEE',
          fontSize: 12,
          padding: '4px 8px',
          ...headerStyle
        }}
      >
        <Text>{key}</Text>
      </View>
      <View
        style={{
          flex: 1,
          textAlign: 'left',
          border: '1px solid #EEE',
          // borderTop: i === 0 ? '1px solid #EEE' : 'none',
          borderBottom: i !== count - 1 ? 'none' : '1px solid #EEE',
          borderLeft: 'none',
          fontSize: 12,
          padding: '4px 8px',
          ...rowStyle
        }}
      >
        <Text>{value as string}</Text>
      </View>
    </View>
  ))}</>
}

const TableView = ({ data, headerStyle, rowStyle }:{data:any, headerStyle?:any, rowStyle?:any}) => {
  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        {Object.keys(data).map((key, i) => (
          <View
            key={key}
            style={{
              flex: 1,
              textAlign: 'center',
              backgroundColor: '#ff00ff',
              borderLeft: i === 0 ? 'none' : '1px solid #EEE',
              fontSize: 12,
              padding: '4px 8px',
              ...headerStyle
            }}
          >
            <Text>{key}</Text>
          </View>
        ))}
      </View>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        {Object.values(data).map((value, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              textAlign: 'left',
              border: '1px solid #EEE',
              borderRight: i === 0 ? 'none' : '1px solid #EEE',
              fontSize: 12,
              padding: '4px 8px',
              minHeight: 30,
              ...rowStyle
            }}
          >
            <Text>{value as string || 'N/A'}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

interface ReportDocumentProps {
  reportData: any;
}
const ReportPdf: React.FC<ReportDocumentProps> = ({ reportData = {} }) => {
  const {
    venue,
    town,
    performanceDate = '',
    performanceTime = '',
    cms,
    lighting,
    asm,
    performanceDuration = '',
    actOneUpTime = '',
    actOneDownTime = '',
    actTwoDownTime = '',
    intervalDownTime = '',
    getOutTime = '',
    actOneDuration,
    actTwoDuration,
    intervalDuration,
    getOutDuration,
    castCrewAbsence,
    castCrewInjury,
    dutyTechnician,
    technicalNote,
    performanceNote,
    setPropCustumeNote,
    audienceNote,
    merchandiseNote,
    generalRemarks,
    distributionList,
    showPicture,
    reportNumber
  } = reportData
  return (
    <Document>
      <Page
        size='A4'
        style={{
          padding: 20
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 20
            // border: '1px solid red'
          }}
        >
          <View
            style={{
              flex: 1
            }}
          >
            <Image src={showPicture || 'http://localhost:3005/show-img.jpg'} style={{ width: 200 }} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 10 }}>
              <Text>Show Report N°. {reportNumber}</Text>
            </View>
            <TableViewHorizantal
              data={{
                Venue: venue,
                Town: town,
                'Performance Date': performanceDate
              }}
              headerStyle={{
                width: '120px'
              }}
            />
          </View>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            marginTop: 20
            // border: '1px solid red'
          }}
        >
          <View style={{ flex: 1 }}>
            <TableViewHorizantal
              data={{
                'Performance Time': performanceTime
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TableViewHorizantal
              data={{
                'Performance Duration': performanceDuration
              }}
            />
          </View>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            marginTop: 20
            // border: '1px solid red'
          }}
        >
          <View style={{ flex: 1 }}>
            <TableViewHorizantal
              data={{
                'Act One': `UP: ${actOneUpTime} DOWN: ${actOneDownTime} [ ${actOneDuration} ]`,
                Interval: `UP: ${actOneDownTime} DOWN: ${intervalDownTime} [ ${intervalDuration} ]`,
                'Act Two': `UP: ${intervalDownTime} DOWN: ${actTwoDownTime} [ ${actTwoDuration} ]`,
                'Get-out': getOutTime,
                'Get Out Duration': `UP: ${actTwoDownTime} DOWN: ${getOutTime} [ ${getOutDuration} ]`
              }}
              headerStyle={{
                width: '65px'
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TableViewHorizantal
              data={{
                'LX/SND Op': lighting,
                SM: cms,
                ASM: asm,
                'Duty Technician': dutyTechnician
              }}
              headerStyle={{
                width: '105px'
              }}
            />
          </View>
        </View>

        <TableView
          data={{
            'Cast/Crew Lateness/Absence': castCrewAbsence,
            'Cast/Crew Illness/Injury': castCrewInjury
          }}
        />
        <TableView
          data={{
            '1 – Technical notes': technicalNote
          }}
        />
        <TableView
          data={{
            '2 – Performance Notes': performanceNote
          }}
        />
        <TableView
          data={{
            '3 – Set / Prop / Costume Notes': setPropCustumeNote
          }}
        />
        <TableView
          data={{
            '4 – Audience Notes': audienceNote
          }}
        />
        <TableView
          data={{
            '5 – Merchandise Note': merchandiseNote
          }}
        />
        <TableView
          data={{
            '6 – General Remarks': generalRemarks
          }}
        />
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 12 }}>
            Distribution : {distributionList}
          </Text>
        </View>
      </Page>
    </Document>
  )
}



export default  ReportPdf