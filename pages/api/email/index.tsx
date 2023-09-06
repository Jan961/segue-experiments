import AccountInvite from 'components/emails/accountInvite'
import { NextApiRequest, NextApiResponse } from 'next'
import ReactDOMServer from 'react-dom/server'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const text = 'hello'// req.data.text
  const subject = 'testi no call'// req.data.subject
  const hash = '1223' // req.data.hash
  const email = 'peter@spctr.co.uk'// req.data.email
  const data = {
    text,
    subject,
    hash
  }
  const nodemailer = require('nodemailer')

  const transporter = nodemailer.createTransport({
    port: 2525,
    host: 'localhost',
    secure: false
  })
  // @ts-ignore
  const mailData = {
    from: 'any@mail.cc',
    to: email,
    subject,
    text,
    html: ReactDOMServer.renderToStaticMarkup(<AccountInvite data={data} ></AccountInvite>)
  }
  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      console.log(err)
      res.status(400)
    } else {
      console.log(info)
      res.status(200)
    }
  })

  res.json({})
}
