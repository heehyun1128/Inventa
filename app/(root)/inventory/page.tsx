"use client";
import InventoryPieChart from "@/components/InventoryPieChart";
import InventoryTable, { ItemInterface } from "@/components/InventoryTable";
import { GetItemInterface, getItems } from "@/lib/actions/item.actions";
import React, { useEffect, useState } from "react";

const Inventory: React.FC = () => {
  const [items, setItems] = useState<GetItemInterface[]>([]);

  const fetchItems = async () => {
    try {
      const itemList = await getItems();
      console.log("Fetched itemList:", itemList);
      setItems(itemList);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  useEffect(() => {

    fetchItems();
  }, []);

  

  return (
    <div style={{display:"flex",flexDirection:"column", alignItems:"center",justifyContent:"center"}}>
      {items.length > 0 ? <InventoryTable items={items} setItems={setItems} /> : <p>Loading...</p>}
      <h2>Inventory Matrix</h2>
      <InventoryPieChart items={items}/>
    </div>
  );
};

export default Inventory;
