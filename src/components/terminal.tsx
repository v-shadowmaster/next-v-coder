"use client";

import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import socket from "@/lib/socket";

interface TerminalData {
  data: string;
}

const TerminalUI: React.FC = () => {
  const terminal = useRef<HTMLDivElement | null>(null);
  const isRendered = useRef(false);

  useEffect(() => {
    if (isRendered.current) {
      return;
    }
    isRendered.current = true;
    const term = new Terminal({
      rows: 30,
      cols: 80,
      fontFamily: "monospace", // Set the font to monospace
      fontSize: 20, // Increase the font size
    });

    if (terminal.current) {
      term.open(terminal.current);
    }

    term.onData((data) => {
      socket.emit("terminal:write", data);
      console.log("Data written to terminal:", data);
    });

    socket.on("terminal:data", (data: TerminalData) => {
      console.log("Data received from terminal:", data);
      term.write(data.data);
    });

    return () => {
      socket.off("terminal:data");
    };
  }, []);

  return <div ref={terminal} />;
};

export default TerminalUI;
