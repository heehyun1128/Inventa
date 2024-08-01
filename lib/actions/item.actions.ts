"use server";

import {
  collection,
  addDoc,
  getDocs,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { CreateItemInterface } from "@/components/InventoryForm";
import { ItemInterface } from "@/components/InventoryTable";
import { randomUUID } from "crypto";

export interface GetItemInterface {
  id: string;
  name: string;
  sku: string;
  quantity: string;
  price: string;
  location: string;
}

export async function addItem(item: CreateItemInterface) {
  try {
    const q = query(collection(db, "items"), where("sku", "==", item.sku));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
    
      const docRef = doc(db, "items", querySnapshot.docs[0].id);
      const existingItem = querySnapshot.docs[0].data();

      await updateDoc(docRef, {
        quantity: Number(existingItem.quantity) + Number(item.quantity),
      });
    } else {
      await addDoc(collection(db, "items"), {
        id: randomUUID(),
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        location: item.location,
      });
    }
  } catch (err) {
    console.error("Error adding item:", err);
    if (err instanceof Error) {
      throw new Error(`Error:${err.message}`);
    } else {
      throw new Error(`${JSON.stringify(err)}`);
    }
  }
}

export const getItems = async (): Promise<GetItemInterface[]> => {
  try {
    const items: GetItemInterface[] = [];
    const querySnapshot = await getDocs(collection(db, "items"));

    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as GetItemInterface);
      console.log(doc.id);
    });
    return items;
  } catch (err) {
    console.error("Error getting items:", err);
    if (err instanceof Error) {
      throw new Error(`Error: ${err.message}`);
    } else {
      throw new Error(`${JSON.stringify(err)}`);
    }
  }
};

export const getItemByQuery = async () => {
  try {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let items: GetItemInterface[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as GetItemInterface);
      });
    });
  } catch (err) {
    console.error("Error getting items:", err);
    if (err instanceof Error) {
      throw new Error(`Error: ${err.message}`);
    } else {
      throw new Error(`${JSON.stringify(err)}`);
    }
  }
};
