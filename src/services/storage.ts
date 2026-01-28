import type { Story } from '../types/story';

const DB_NAME = 'stories-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject(request.error);
        }

        request.onsuccess = () => {
            resolve(request.result);
        }

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                

                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        }
    })
}

export const addStory = async (story: Story): Promise<void> => {
    const db = await initDB();

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const addRequest = store.add(story);

        addRequest.onsuccess = () => {
            resolve();
        }

        addRequest.onerror = () => {
            reject(addRequest.error);
        }
        
    })

}

export const getStory = async (): Promise<Story[]> => {
    const db = await initDB();
    const twentyFourHouresAgo = Date.now() - 24 * 60 * 60 * 1000;

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('timestamp');

        const range = IDBKeyRange.lowerBound(twentyFourHouresAgo);
        const getRequest = index.getAll(range);

        getRequest.onsuccess = () => {
            resolve(getRequest.result);
        }

        getRequest.onerror = () => {
            reject(getRequest.error);
        }

    });
}