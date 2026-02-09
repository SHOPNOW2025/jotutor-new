
// Fix: Use Firebase v8 compat imports to resolve module errors.
import firebase from "firebase/compat/app";
import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { SiteContent, OnboardingOptions, Course, Payment } from './types';
import { initialData } from './mockData';

// Your web app's Firebase configuration
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

export const auth = firebase.auth ? firebase.auth() : null;
export const db = firebase.firestore ? firebase.firestore() : null;

// Map from the app's old sheet names to Firestore collection names
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

    for (const key of publicCollections) {
        const collectionName = collectionMap[key];
        const promise = db.collection(collectionName).get().then(snapshot => {
            const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            const dataKey = collectionName === 'blogPosts' ? 'blog' : collectionName;
            data[dataKey] = docs;
        });
        promises.push(promise);
    }
    
    const configPromise = db.collection('config').doc('main').get().then(docSnap => {
        if (docSnap.exists) {
            data['config'] = docSnap.data();
        } else {
            console.warn("Config document 'main' does not exist in Firestore.");
            data['config'] = { siteContent: null, siteContentEn: null, onboardingOptions: null };
        }
    });
    promises.push(configPromise);

    await Promise.all(promises);
    return { success: true, data };
};

export const fetchAdminData = async (): Promise<{ success: boolean; data: any; failedCollections?: string[] }> => {
    if (!db) return { success: false, data: {} };
    const data: { [key: string]: any } = {};
    const failedCollections: string[] = [];
    
    const adminCollections = ['Users', 'Staff', 'Payments'];
    for (const key of adminCollections) {
        const collectionName = collectionMap[key];
        try {
            const snapshot = await db.collection(collectionName).get();
            const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            data[key] = docs;
        } catch (error) {
            failedCollections.push(key);
        }
    }
    return { success: failedCollections.length === 0, data, failedCollections };
};

export const onAuthStateChangedListener = (callback: (user: firebase.User | null) => void) => {
    if (auth) return auth.onAuthStateChanged(callback);
    return () => {};
};

export const overwriteCollection = async (sheetName: string, newData: any[]): Promise<{ success: boolean; error?: string }> => {
    if (!db) return { success: false, error: 'Database not initialized' };
    const collectionName = collectionMap[sheetName];
    const batch = db.batch();
    const collectionRef = db.collection(collectionName);

    try {
        const existingDocsSnapshot = await collectionRef.get();
        const existingIds = new Set(existingDocsSnapshot.docs.map(d => d.id));
        const newIds = new Set(newData.map(item => item.id.toString()));

        newData.forEach(item => {
            const { id, ...data } = item;
            const docRef = collectionRef.doc(id.toString());
            batch.set(docRef, data);
        });

        existingIds.forEach(id => {
            if (!newIds.has(id)) batch.delete(collectionRef.doc(id));
        });
    
        await batch.commit();
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Updates the 'main' document in the 'config' collection with merging.
 */
export const updateConfig = async (configData: { 
    siteContent?: SiteContent | null, 
    siteContentEn?: SiteContent | null,
    onboardingOptions?: OnboardingOptions | null 
}): Promise<{ success: boolean; error?: string }> => {
    if (!db) return { success: false, error: 'Database not initialized' };
    try {
        // Crucial: Use merge: true to update only the keys provided (e.g., update EN without losing AR)
        await db.collection('config').doc('main').set(configData, { merge: true });
        return { success: true };
    } catch (error: any) {
        console.error("Error updating Firestore config:", error);
        return { success: false, error: error.message };
    }
};

export const setDocument = async (sheetName: string, docId: string, data: object): Promise<{ success: boolean; error?: string }> => {
    if (!db) return { success: false, error: 'Database not initialized' };
    const collectionName = collectionMap[sheetName];
     try {
        await db.collection(collectionName).doc(docId).set(data, { merge: true });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Seeds the 'courses' collection with the initial data from mockData.ts.
 */
export const seedInitialCourses = async (): Promise<{ success: boolean; error?: string; seededCourses?: Course[] }> => {
    if (!db) return { success: false, error: 'Database not initialized' };
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
