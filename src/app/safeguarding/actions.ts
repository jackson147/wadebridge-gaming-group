'use server'

import { z } from "zod";
import nodemailer from "nodemailer";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type FormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
  fields?: {
    name: string;
    email: string;
    message: string;
  };
  success?: boolean;
};

export async function submitSafeguardingConcern(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = (formData.get("name") as string) || "";
  const email = (formData.get("email") as string) || "";
  const message = (formData.get("message") as string) || "";

  const validatedFields = schema.safeParse({
    name,
    email,
    message,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      fields: { name, email, message },
      success: false,
    };
  }

  const { name: validatedName, email: validatedEmail, message: validatedMessage } = validatedFields.data;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      secure: process.env.EMAIL_SERVER_PORT === "465",
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.SAFEGUARDING_EMAIL_TO,
      subject: `Safeguarding Concern from ${validatedName}`,
      text: `
        Name: ${validatedName}
        Email: ${validatedEmail}

        Message:
        ${validatedMessage}
      `,
    });

    return { success: true, message: "Concern submitted successfully." };
  } catch (error) {
    console.error("Email error:", error);
    return { 
      success: false, 
      message: "Failed to send email. Please try again.",
      fields: { name, email, message }
    };
  }
}