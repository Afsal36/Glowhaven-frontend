import { OrbitProgress } from "react-loading-indicators";
import { createPortal } from "react-dom";

export default function Loader({ visible }) {
  const loaderRoot = document.getElementById("loader-root");

  if (!loaderRoot) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        // background: "rgba(255, 255, 255, 0.65)",
        display: visible ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999999,
      }}
    >
      <OrbitProgress dense color="#32cd32" size="medium" />
    </div>,
    loaderRoot
  );
}
