"use client"; 

import { useState } from "react";
import Card from "@/app/components/Card";


export default function AddTest() {
    const [barcode, setBarcode] = useState("");
    const [drinkName, setDrinkName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [measurement, setMeasurement] = useState("");
    const [ingredients, setIngredients] = useState("");

    const handleBarcodeSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const data = await response.json();

            if (data.status === 1) {
                setDrinkName(data.product.product_name_en || data.product.product_name || "");
                //setQuantity(data.product.quantity || data.product.serving_size || data.product.serving_quantity || "")
                setIngredients(data.product.ingredients_text_en || "")
                // If quntity includes ml, cl or ltr text set measurement select value
                let rawQuantity = data.product.quantity || data.product.serving_size || data.product.serving_quantity || "";

                // Extract number and unit (e.g., "200 ml" => "200", "ml")
                const quantityMatch = rawQuantity.match(/([\d.]+)\s*(ml|cl|l|ltr)?/i);

                if (quantityMatch) {
                    setQuantity(quantityMatch[1]); // sets just the number part
                    const unit = quantityMatch[2]?.toLowerCase();

                    // Normalize l to ltr
                    if (unit === "l") {
                        setMeasurement("ltr");
                    } else if (unit === "cl" || unit === "ml") {
                        setMeasurement(unit);
                    } else {
                        setMeasurement(""); // fallback
                    }
                } else {
                    setQuantity(rawQuantity); // fallback if pattern didn't match
                    setMeasurement("");
                }

            } else {
                alert("Product not found");
                setDrinkName("");
                setQuantity("");
                setIngredients("");
            }
        } catch (error) {
            console.error("Failed to fetch product:", error);
            alert("Error fetching product");
            setDrinkName("");
            setQuantity("");
            setIngredients("");
        }
    };

    return (
        <div>
            <h1>Add A Drink</h1>
            <hr />
            <p className="center">Add a common drink and the details.</p>
            <br />

            {/* Search by Barcode */}
            <Card colour="" icon="fa-search" title="Search Drink">
                <form onSubmit={handleBarcodeSubmit}>
                    <div className="row">
                        <div className="col">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    id="barcode"
                                    placeholder="Barcode Number"
                                    value={barcode}
                                    onChange={(e) => setBarcode(e.target.value)}
                                    required
                                />
                                <label htmlFor="barcode">Enter A Barcode Number</label>
                            </div>
                        </div>
                        <div className="">
                            <button type="submit" className="btn blue w-100">Search For A Drink</button>
                        </div>
                    </div>
                </form>
            </Card>

            {/*  Drink Details */}
            <Card colour="" icon="fa-bottle-water" title="Add A Drink Type">
                <form>
                    
                    <div className="row-sm">
                        <div className="col flex-2">
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
                        <div className="flex-1">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    id="quantity"
                                    placeholder="Quantity (eg: 200)"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                                <label htmlFor="quantity">Quantity</label>
                            </div>
                        </div>
                        <div className="">
                            <div className="form-floating">
                            
                                <select 
                                    id="measurement" 
                                    name="measurement"
                                    value={measurement}
                                    onChange={(e) => setMeasurement(e.target.value)}
                                >
                                    <option value=""></option>
                                    <option value="ml">ml</option>
                                    <option value="cl">cl</option>
                                    <option value="ltr">ltr</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    <div className="form-floating">
                        <textarea 
                            id="ingredients" 
                            placeholder="Ingredients" 
                            value={ingredients}
                            
                            onChange={(e) => setIngredients(e.target.value)}
                            ></textarea>
                        <label htmlFor="ingredients">Ingredients</label>
                    </div>
                    <button type="submit" className="btn green w-100"><i className="fa fa-plus"></i> Add</button>
                </form>
            </Card>
        </div>
    );
}
