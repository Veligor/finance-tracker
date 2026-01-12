import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/global.scss";
import styles from "./MainLayout.module.scss";
import Header from "../components/Header/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.appLayout}>
      {/* Sidebar слева */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {/* Основная часть */}
      <div className={styles.contentArea}>
        <Header onBurgerClick={() => setIsSidebarOpen(true)} />
        {/* Router сюда кладёт Home / Stats */}
        <main className={styles.mainContent}>
          <div className="appContainer">{children}</div>
        </main>
      </div>
    </div>
  );
}
