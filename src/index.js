import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css';
import App from "./App";
import { QuizProvider } from "./context/QuizContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <QuizProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </QuizProvider>
);
