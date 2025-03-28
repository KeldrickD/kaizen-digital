import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface ContactFormEmailProps {
  name: string;
  email: string;
  phone: string;
  message: string;
  service?: string;
}

export default function ContactFormEmail({
  name,
  email,
  phone,
  message,
  service,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Contact Form Submission from {name}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 px-5">
            <Heading className="text-2xl font-bold text-gray-900 mb-4">
              New Contact Form Submission
            </Heading>
            
            <Section className="mt-4">
              <Text className="text-gray-700">
                <strong>Name:</strong> {name}
              </Text>
              <Text className="text-gray-700">
                <strong>Email:</strong> {email}
              </Text>
              <Text className="text-gray-700">
                <strong>Phone:</strong> {phone}
              </Text>
              {service && (
                <Text className="text-gray-700">
                  <strong>Service Interest:</strong> {service}
                </Text>
              )}
            </Section>

            <Hr className="my-4 border-gray-300" />

            <Section>
              <Text className="text-gray-700">
                <strong>Message:</strong>
              </Text>
              <Text className="text-gray-700 whitespace-pre-wrap">{message}</Text>
            </Section>

            <Hr className="my-4 border-gray-300" />

            <Text className="text-sm text-gray-600">
              This is an automated notification from Kaizen Digital Design.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
} 