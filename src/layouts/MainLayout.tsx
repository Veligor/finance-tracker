import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/global.scss";
import styles from "./MainLayout.module.scss"; 
import Header from "../components/Header/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.appLayout}>
      {/* Sidebar слева */}
      <Sidebar />
      {/* Основная часть */}
      <div className={styles.contentArea}>
        <Header />
        {/* Router сюда кладёт Home / Stats */}
        <main className={styles.mainContent}>
          <div className="appContainer">{children}</div>
        </main>
      </div>
    </div>
  );
}
