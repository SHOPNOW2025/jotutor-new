
// Fix: Use Firebase v8 compat imports to resolve module errors.
import firebase from "firebase/compat/app";
import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { SiteContent, OnboardingOptions, Course, Payment } from './types';
import { initialData } from './mockData';

// Your web app's Firebase configuration from user prompt
const firebaseConfig = {
  apiKey: "AIzaSyD22o_UCJ7xrbawNuIlACvFtbQB9HeUn9g",
  authDomain: "jototur-2f755.firebaseapp.com",
  projectId: "jototur-2f755",
  storageBucket: "jototur-2f755.appspot.com",
  messagingSenderId: "122916103662",
  appId: "1:122916103662:web:bd7ef6e0c6d7be0a2bdaff",
  measurementId: "G-YSH7WBLZYB"
};

// Initialize Firebase safely
let app;
try {
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

// Export auth and db safely. If init failed, these might be undefined or mock objects could be used (though app will likely be offline)
// We export the instances.
export const auth = firebase.auth ? firebase.auth() : null;
export const db = firebase.firestore ? firebase.firestore() : null;

// Enable offline persistence only if db exists
if (db) {
    try {
        db.enablePersistence().catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn("Firebase persistence failed: multiple tabs open");
            } else if (err.code === 'unimplemented') {
                console.warn("Firebase persistence not supported by browser");
            }
        });
    } catch (e) {
        console.warn("Offline persistence initialization error", e);
    }
}

// --- Authentication Functions ---
export const onAuthStateChangedListener = (callback: (user: firebase.User | null) => void) => {
    if (auth) {
        return auth.onAuthStateChanged(callback);
    }
    // Fallback if auth didn't load
    console.warn("Auth service not available");
    return () => {}; 
};

// --- Firestore Functions ---

// Map from the app's old sheet names to Firestore collection names (lowercase)
const collectionMap: { [key: string]: string } = {
    'Users': 'users',
    'Teachers': 'teachers',
    'Courses': 'courses',
    'Staff': 'staff',
    'Payments': 'payments',
    'Testimonials': 'testimonials',
    'Blog': 'blogPosts',
    'HeroSlides': 'heroSlides',
};

const publicCollections = ['Teachers', 'Courses', 'Testimonials', 'Blog', 'HeroSlides'];

/**
 * Fetches all public data from Firestore collections.
 */
export const fetchPublicData = async (): Promise<{ success: boolean; data: any }> => {
    if (!db) return { success: false, data: {} };

    const data: { [key: string]: any } = {};
    const promises = [];

    // Fetch all public collections
    for (const key of publicCollections) {
        const collectionName = collectionMap[key];
        const promise = db.collection(collectionName).get().then(snapshot => {
            const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            const dataKey = collectionName === 'blogPosts' ? 'blog' : collectionName;
            data[dataKey] = docs;
        });
        promises.push(promise);
    }
    
    // Fetch the main config document (also public)
    const configPromise = db.collection('config').doc('main').get().then(docSnap => {
        if (docSnap.exists) {
            data['config'] = docSnap.data();
        } else {
            console.warn("Config document 'main' does not exist in Firestore.");
            data['config'] = { siteContent: null, onboardingOptions: null };
        }
    });
    promises.push(configPromise);

    try {
        await Promise.all(promises);
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching public data:", error);
        return { success: false, data: {} };
    }
};

const adminCollections = ['Users', 'Staff', 'Payments'];

/**
 * Fetches all admin-only data from Firestore collections individually.
 */
export const fetchAdminData = async (): Promise<{ success: boolean; data: any; failedCollections?: string[] }> => {
    if (!db) return { success: false, data: {} };

    const data: { [key: string]: any } = {};
    const failedCollections: string[] = [];
    
    // Fetch all admin-only collections individually
    for (const key of adminCollections) {
        const collectionName = collectionMap[key];
        try {
            const snapshot = await db.collection(collectionName).get();
            const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            data[collectionName] = docs;
        } catch (error) {
            console.error(`Failed to fetch collection '${collectionName}':`, error);
            failedCollections.push(collectionName);
        }
    }
    
    if (failedCollections.length > 0) {
        return { success: false, data, failedCollections };
    }

    return { success: true, data };
};

/**
 * Subscribes to the Payments collection for real-time updates.
 * This fixes the issue where data disappears after a few seconds due to stale fetches.
 */
export const subscribeToPayments = (callback: (payments: Payment[]) => void) => {
    if (!db) return () => {};
    
    // Subscribe to the 'payments' collection
    return db.collection('payments').onSnapshot(snapshot => {
        const payments = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Payment));
        callback(payments);
    }, error => {
        console.error("Error subscribing to payments:", error);
    });
};


/**
 * Overwrites an entire collection with a new set of data.
 */
export const overwriteCollection = async (sheetName: string, newData: any[]): Promise<{ success: boolean; error?: string }> => {
    if (!db) return { success: false, error: "Database not initialized" };
    
    const collectionName = collectionMap[sheetName];
    if (!collectionName) return { success: false, error: 'Invalid collection name' };

    const batch = db.batch();
    const collectionRef = db.collection(collectionName);

    try {
        // Get existing documents to determine deletions
        const existingDocsSnapshot = await collectionRef.get();
        const existingIds = new Set(existingDocsSnapshot.docs.map(d => d.id));
        const newIds = new Set(newData.map(item => item.id.toString()));

        // Batch set/update new data
        newData.forEach(item => {
            const { id, ...data } = item;
            const docRef = collectionRef.doc(id.toString());
            batch.set(docRef, data);
        });

        // Batch delete documents that are no longer in the new data
        existingIds.forEach(id => {
            if (!newIds.has(id)) {
                const docRef = collectionRef.doc(id);
                batch.delete(docRef);
            }
        });
    
        await batch.commit();
        return { success: true };
    } catch (error: any) {
        console.error(`Error overwriting collection ${collectionName}:`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Sets (creates or overwrites) a specific document in a collection.
 */
export const setDocument = async (sheetName: string, docId: string, data: object): Promise<{ success: boolean; error?: string }> => {
    if (!db) return { success: false, error: "Database not initialized" };

    const collectionName = collectionMap[sheetName];
    if (!collectionName) return { success: false, error: 'Invalid collection name' };

     try {
        await db.collection(collectionName).doc(docId).set(data);
        return { success: true };
    } catch (error: any) {
        console.error(`Error setting document in ${collectionName}:`, error);
        return { success: false, error: error.message };
    }
};


/**
 * Updates the 'main' document in the 'config' collection.
 * Extended to support siteContentEn
 */
export const updateConfig = async (configData: { siteContent?: SiteContent | null, siteContentEn?: SiteContent | null, onboardingOptions?: OnboardingOptions | null }): Promise<{ success: boolean; error?: string }> => {
    if (!db) return { success: false, error: "Database not initialized" };
    try {
        await db.collection('config').doc('main').set(configData, { merge: true });
        return { success: true };
    } catch (error: any) {
        console.error('Error updating config:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Seeds the 'courses' collection with the initial data from mockData.ts.
 */
export const seedInitialCourses = async (): Promise<{ success: boolean; error?: string; seededCourses?: Course[] }> => {
    if (!db) return { success: false, error: "Database not initialized" };

    const collectionName = 'courses';
    const coursesToSeed = initialData.courses;
    const collectionRef = db.collection(collectionName);
    const batch = db.batch();

    try {
        coursesToSeed.forEach(course => {
            const { id, ...data } = course;
            const docRef = collectionRef.doc(id.toString());
            batch.set(docRef, data);
        });

        await batch.commit();
        return { success: true, seededCourses: coursesToSeed };
    } catch (error: any) {
        console.error(`Error seeding collection ${collectionName}:`, error);
        return { success: false, error: error.message };
    }
};
