/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  AppStateStore, 
  Executive, 
  DELCAEvent, 
  Invitation, 
  NotificationItem, 
  ActivityLog, 
  SystemSettings 
} from '../types';

export async function fetchAppStateFromFirestore(): Promise<Partial<AppStateStore> | null> {
  const fetchPromise = (async () => {
    try {
      const execSnap = await getDocs(collection(db, 'executives'));
      const evtSnap = await getDocs(collection(db, 'events'));
      const invSnap = await getDocs(collection(db, 'invitations'));
      const notifSnap = await getDocs(collection(db, 'notifications'));

      const executives: Executive[] = [];
      execSnap.forEach(d => executives.push(d.data() as Executive));

      const events: DELCAEvent[] = [];
      evtSnap.forEach(d => events.push(d.data() as DELCAEvent));

      const invitations: Invitation[] = [];
      invSnap.forEach(d => invitations.push(d.data() as Invitation));

      const notifications: NotificationItem[] = [];
      notifSnap.forEach(d => notifications.push(d.data() as NotificationItem));

      if (executives.length === 0 && events.length === 0) {
        return null; // Fallback to server defaults on initial boot
      }

      return {
        executives,
        events,
        invitations,
        notifications
      };
    } catch (error) {
      console.warn('Firestore fetch fallback to API server:', error);
      return null;
    }
  })();

  const timeoutPromise = new Promise<null>((resolve) => {
    setTimeout(() => {
      console.warn('Firestore fetch timed out, utilizing local server state');
      resolve(null);
    }, 3000);
  });

  return Promise.race([fetchPromise, timeoutPromise]);
}

export async function saveExecutiveToFirestore(exec: Executive): Promise<void> {
  try {
    await setDoc(doc(db, 'executives', exec.id), exec, { merge: true });
  } catch (error) {
    console.error('Failed to sync executive to Firestore:', error);
  }
}

export async function saveEventToFirestore(evt: DELCAEvent): Promise<void> {
  try {
    await setDoc(doc(db, 'events', evt.id), evt, { merge: true });
  } catch (error) {
    console.error('Failed to sync event to Firestore:', error);
  }
}

export async function saveInvitationToFirestore(inv: Invitation): Promise<void> {
  try {
    await setDoc(doc(db, 'invitations', inv.id), inv, { merge: true });
  } catch (error) {
    console.error('Failed to sync invitation to Firestore:', error);
  }
}

export async function saveNotificationToFirestore(notif: NotificationItem): Promise<void> {
  try {
    await setDoc(doc(db, 'notifications', notif.id), notif, { merge: true });
  } catch (error) {
    console.error('Failed to sync notification to Firestore:', error);
  }
}

export async function seedInitialFirestoreData(state: AppStateStore): Promise<void> {
  try {
    const batch = writeBatch(db);

    state.executives.forEach(exec => {
      batch.set(doc(db, 'executives', exec.id), exec);
    });

    state.events.forEach(evt => {
      batch.set(doc(db, 'events', evt.id), evt);
    });

    state.invitations.forEach(inv => {
      batch.set(doc(db, 'invitations', inv.id), inv);
    });

    state.notifications.forEach(notif => {
      batch.set(doc(db, 'notifications', notif.id), notif);
    });

    await batch.commit();
    console.log('Successfully seeded initial state into Firestore');
  } catch (error) {
    console.error('Failed to seed initial Firestore data:', error);
  }
}
