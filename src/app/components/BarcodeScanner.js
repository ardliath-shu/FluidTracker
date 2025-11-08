"use client";

import { useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useToast } from "@/app/hooks/useToast";

export default function BarcodeScanner({ onDetected }) {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const startScanner = async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      showToast(
        "Camera access not supported or must be served over HTTPS.",
        "error",
      );
      return;
    }

    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;
    setScanning(true);

    try {
      await codeReader.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, error) => {
          if (result) {
            onDetected(result.getText());

            // Stop after successul scan
            stopScanner();
          }
        },
      );
    } catch (err) {
      console.error("Error starting scanner:", err);
      showToast("Failed to access camera", "error");
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (typeof codeReaderRef.current?.reset === "function") {
      codeReaderRef.current.reset();
    }
    // Stop all media tracks to fully release the camera
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject;
      stream.getTracks().forEach((track) => track.stop()); // This turns off the camera
      video.srcObject = null;
    }
    setScanning(false);
  };

  return (
    <>
      <div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            marginTop: "1rem",
            display: scanning ? "block" : "none",
          }}
        />

        {!scanning && (
          <button className="btn w-100" onClick={startScanner}>
            <i className="fa fa-barcode" /> Scan Barcode
          </button>
        )}

        {scanning && (
          <button
            className="btn red w-100"
            onClick={stopScanner}
            style={{ marginTop: "1rem" }}
          >
            <i className="fa fa-stop" /> Stop Scanning
          </button>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
