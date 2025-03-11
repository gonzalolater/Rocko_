import { SLACK_WEBHOOK_URL } from '@/constants/env';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: NextRequest) {
  if (SLACK_WEBHOOK_URL) {
    try {
      const { message, level } = await req.json();

      await axios
        .post(
          SLACK_WEBHOOK_URL,
          {
            text: `${level.toUpperCase()}: ${message}`,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then((response) => {
          console.log('Message sent successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });

      return NextResponse.json({ msg: 'OK' }, { status: 200 });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return NextResponse.json(
        { error: 'Error Proccessing Log' },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json({ error: 'Logging Unavailable' }, { status: 501 });
  }
}
