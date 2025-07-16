import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Všechna pole jsou povinná.' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.seznam.cz',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Wloom web" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Nová zpráva z webu od ${name}`,
      text: `Jméno: ${name}\nEmail: ${email}\n\nZpráva:\n${message}`,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Chyba při odesílání e-mailu:', error);
    return NextResponse.json({ error: 'Nepodařilo se odeslat e-mail.' }, { status: 500 });
  }
} 