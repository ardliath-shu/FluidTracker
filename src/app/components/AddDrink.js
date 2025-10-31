"use client";

import { useState, useRef } from "react";
import { logNewDrinkAction } from "@/app/actions/patients";
import BarcodeScanner from "@/app/components/BarcodeScanner";
import Card from "@/app/components/Card";

export default function AddDrinkForm({ patient, onPatientUpdated }) {
  const cardRef = useRef(null);
  const [barcode, setBarcode] = useState("");
  const [drinkName, setDrinkName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [showBarcodeInput, setShowBarcodeInput] = useState(false);
  const lastScannedRef = useRef(null);

  // Fetch product by barcode (scan or manual)
  async function fetchProduct(code) {
    if (!code || code === lastScannedRef.current) return;
    lastScannedRef.current = code;
    setIsFetching(true);

    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${code}.json`,
      );
      const data = await res.json();

      if (data.status === 1) {
        const p = data.product;
        setDrinkName(p.product_name_en || p.product_name || "");
        setIngredients(p.ingredients_text_en || "");

        const rawQuantity =
          p.quantity || p.serving_size || p.serving_quantity || "";
        const match = rawQuantity.match(/([\d.]+)\s*(ml|cl|l|ltr)?/i);
        if (match) {
          let val = parseFloat(match[1]);
          const unit = match[2]?.toLowerCase();
          if (unit === "l") val *= 1000;
          else if (unit === "cl") val *= 10;
          setQuantity(val);
        } else {
          setQuantity("");
        }
      } else {
        alert("Product not found");
        setDrinkName("");
        setQuantity("");
        setIngredients("");
      }
    } catch (err) {
      console.error("Error fetching:", err);
      alert("Error fetching product data");
    } finally {
      setIsFetching(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!patient) {
      alert("Please select a patient first.");
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedPatient = await logNewDrinkAction(
        patient.patientId,
        quantity,
        drinkName,
      );

      //alert(`Added ${drinkName} (${quantity}ml) for ${patient.firstName}`);

      // refresh dashboard
      onPatientUpdated?.(updatedPatient);
      cardRef.current?.collapse();

      // clear form
      setDrinkName("");
      setQuantity("");
      setBarcode("");
      setIngredients("");
      lastScannedRef.current = null;
    } catch (err) {
      console.error(err);
      alert("Failed to add drink");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card
      ref={cardRef}
      colour="blue"
      icon="fa-bottle-water"
      title="Start a Drink"
      collapsible={true}
      defaultOpen={false}
    >
      <form onSubmit={handleSubmit}>
        {/* Scanner */}
        <BarcodeScanner onDetected={(code) => fetchProduct(code)} />
        {/* Toggle manual barcode input */}
        {!showBarcodeInput && (
          <div
            className="barcode-manual-toggle"
            onClick={() => setShowBarcodeInput(true)}
          >
            Enter barcode manually
          </div>
        )}

        {/* Manual barcode input row */}
        {showBarcodeInput && (
          <>
            <div className="row">
              <div className="col">
                <div className="form-floating no-margin">
                  <input
                    type="text"
                    id="barcode"
                    placeholder="Enter barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                  <label htmlFor="barcode">Barcode</label>
                </div>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="btn w-100"
                  onClick={() => fetchProduct(barcode)}
                  disabled={isFetching}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>{" "}
                  {isFetching ? "Searching..." : "Search"}
                </button>
              </div>
            </div>
            <div
              className="barcode-manual-toggle"
              onClick={() => setShowBarcodeInput(false)}
            >
              Hide barcode entry
            </div>
          </>
        )}

        <hr />

        {/* Drink details */}
        <div className="row">
          <div className="col">
            <div className="form-floating">
              <input
                type="text"
                id="drink_name"
                placeholder="Drink Name"
                value={drinkName}
                onChange={(e) => setDrinkName(e.target.value)}
                required
              />
              <label htmlFor="drink_name">Drink Name</label>
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <input
                type="number"
                id="quantity"
                placeholder="Quantity (ml)"
                value={quantity}
                step={50}
                min={0}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <label htmlFor="quantity">Quantity (ml)</label>
            </div>
          </div>
        </div>

        {/* {ingredients && (
          <div className="ingredients-preview">
            <small>{ingredients}</small>
          </div>
        )} */}

        <button
          type="submit"
          className="btn green w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Adding..."
          ) : (
            <>
              <i className="fa fa-plus"></i> Add Drink
            </>
          )}
        </button>
      </form>
    </Card>
  );
}
