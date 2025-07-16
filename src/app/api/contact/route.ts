import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Všechna pole jsou povinná.' }, { status: 400 });
  }

  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS;
  const smtpFrom = process.env.EMAIL_FROM;
  const smtpTo = process.env.EMAIL_TO;
  if (!smtpUser || !smtpPass || !smtpFrom || !smtpTo) {
    return NextResponse.json({ error: 'Chybí SMTP přihlašovací údaje.' }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.seznam.cz',
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    await transporter.sendMail({
      from: `Wloom web <${smtpFrom}>`,
      to: [smtpTo, smtpFrom],
      subject: `Nová zpráva z webu od ${name}`,
      text: `Jméno: ${name}\nEmail: ${email}\n\nZpráva:\n${message}`,
      html: `<p><b>Jméno:</b> ${name}<br/><b>Email:</b> ${email}</p><p>${message.replace(/\n/g, '<br/>')}</p>`,
      replyTo: email,
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Chyba při odesílání e-mailu:', error, error?.response);
    return NextResponse.json({ error: 'Nepodařilo se odeslat e-mail.' }, { status: 500 });
  }
} 