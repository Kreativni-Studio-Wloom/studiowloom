import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Všechna pole jsou povinná.' }, { status: 400 });
  }

  // Kontrola, že proměnné prostředí jsou nastavené
  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS;
  const smtpTo = process.env.EMAIL_TO;
  if (!smtpUser || !smtpPass || !smtpTo) {
    return NextResponse.json({ error: 'Chybí SMTP přihlašovací údaje.' }, { status: 500 });
  }

  // SMTP transport kompatibilní s Vercel
  const transporter = nodemailer.createTransport({
    host: 'smtp.seznam.cz',
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: { rejectUnauthorized: false }, // fallback pro serverless prostředí
  });

  try {
    await transporter.sendMail({
      from: `"Wloom web" <${smtpUser}>`,
      to: smtpTo,
      subject: `Nová zpráva z webu od ${name}`,
      text: `Jméno: ${name}\nEmail: ${email}\n\nZpráva:\n${message}`,
      replyTo: email,
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Detailní logování pro debugging na Vercelu
    console.error('Chyba při odesílání e-mailu:', error, error?.response);
    return NextResponse.json({ error: 'Nepodařilo se odeslat e-mail.' }, { status: 500 });
  }
} 