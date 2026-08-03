import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Add Gmail & Google Calendar scopes
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.addScope('https://www.googleapis.com/auth/calendar.events');
provider.addScope('https://www.googleapis.com/auth/calendar.readonly');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain access token from Google authentication.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      console.warn('Google sign-in popup was closed before completing authentication.');
      return null;
    }
    if (error?.code === 'auth/popup-blocked') {
      throw new Error('The sign-in popup was blocked by your browser. Please enable popups and try again.');
    }
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Sends a real RFC 2822 email message using Gmail API
 */
export const sendGmailMessage = async (
  accessToken: string,
  toEmail: string,
  subject: string,
  bodyText: string
): Promise<{ id: string; threadId: string }> => {
  const utf8ToB64 = (str: string) => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => 
      String.fromCharCode(parseInt(p1, 16))
    ));
  };

  const rawMessage = [
    `To: ${toEmail}`,
    `Subject: =?utf-8?B?${utf8ToB64(subject)}?=`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    bodyText
  ].join('\r\n');

  const encodedMessage = utf8ToB64(rawMessage)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: encodedMessage
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gmail API dispatch error: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Creates an event on the user's primary Google Calendar using Google Calendar API
 */
export const createGoogleCalendarEvent = async (
  accessToken: string,
  event: {
    title: string;
    description: string;
    location?: string;
    startIso: string; // ISO string e.g. 2026-08-04T14:00:00.000Z
    endIso: string;
    attendees?: string[];
  }
): Promise<{ id: string; htmlLink: string }> => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const body = {
    summary: event.title,
    description: event.description,
    location: event.location || '',
    start: {
      dateTime: event.startIso,
      timeZone
    },
    end: {
      dateTime: event.endIso,
      timeZone
    },
    attendees: (event.attendees || []).map(email => ({ email }))
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Google Calendar API error: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Fetches upcoming scheduled events from user's primary Google Calendar
 */
export const fetchGoogleCalendarEvents = async (
  accessToken: string,
  maxResults = 20
): Promise<any[]> => {
  const timeMin = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&singleEvents=true&orderBy=startTime&maxResults=${maxResults}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Google Calendar list error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
};
