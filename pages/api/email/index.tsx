import AccountInvite from "../../../components/emails/accountInvite";
import ReactDOMServer from 'react-dom/server'

export default function (req, res) {
    let text = "hello"// req.data.text
    let subject = "testi no call"// req.data.subject
    let hash = "1223" //req.data.hash
    let email = "peter@spctr.co.uk"// req.data.email
    let data = {
        text: text,
        subject: subject,
        hash: hash
    }
    let nodemailer = require('nodemailer')

    const transporter = nodemailer.createTransport({
        port: 2525,
        host: "localhost",
        secure: false,
    })
    // @ts-ignore
    const mailData = {
        from: 'any@mail.cc',
        to: email,
        subject: subject,
        text: text,
        html: ReactDOMServer.renderToStaticMarkup(<AccountInvite data={data} ></AccountInvite>)
    }
    transporter.sendMail(mailData, function (err, info) {
        if(err) {
            console.log(err)
            res.status(400)
        } else {
            console.log(info)
            res.status(200)
        }
    })

    res.json()

}
