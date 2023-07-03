import Main from "./Main";
import { createRoot } from 'react-dom/client';
import React from "react";

const container = document.getElementById("main");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Main />);
