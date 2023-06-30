import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { menuStylesContext } from "../../../context/menuStylesContext";

import { useMenuContext } from "../../../hooks/useMenu";
import { Console } from "console";
import MenuStyles from "../../../components/MenuStyles";
const placeholder = require("../../../assets/placeholder.webp");

type TextAlign = "" | "left" | "center" | "right";

export default function Customize() {
    const [selectedStyle, setSelectedStyle] = useState("");

    const { Styles, dispatch } = useContext(menuStylesContext);

    const [styleName, setStyleName] = useState("");
    const [activeStyle, setActiveStyle] = useState("");

    const [bodyBackgroundColor, setBodyBackgroundColor] = useState("#000000");
    const [bodySecondaryColor, setbodySecondaryColor] = useState("#000000");
    const [bodyPrimaryColor, setBodyPrimaryColor] = useState("#000000");

    const [categoryColor, setCategoryColor] = useState("#000000");
    const [categoryBackgroundColor, setCategoryBackgroundColor] =
        useState("#000000");
    const [categoryFontFamily, setCategoryFontFamily] = useState("");
    const [categoryFontWeight, setCategoryFontWeight] = useState("");
    const [categoryTextAlign, setCategoryTextAlign] = useState<TextAlign>("");
    const [categoryTextDecoration, setCategoryTextDecoration] = useState("");

    const [itemColor, setItemColor] = useState("#000");
    const [itemBackgroundColor, setItemBackgroundColor] = useState("#fff");
    const [itemFontFamily, setItemFontFamily] = useState("");
    const [itemFontWeight, setItemFontWeight] = useState("");
    const [itemTextAlign, setItemTextAlign] = useState<TextAlign>("");
    const [itemTextDecoration, setItemTextDecoration] = useState("");

    const updateMenu = (Style: String) => {
        if (Style === "") {
            toast.error("Choose Valid Style", {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            const filteredArray: any[] = Styles.filter(
                (element: any) => element.name === Style
            );
            setBodyBackgroundColor(filteredArray[0].styles.body.BackgroundColor);
            setBodyPrimaryColor(filteredArray[0].styles.body.PrimaryColor);
            setbodySecondaryColor(filteredArray[0].styles.body.SecondaryColor);

            setCategoryColor(filteredArray[0].styles.category.Color);
            setCategoryBackgroundColor(
                filteredArray[0].styles.category.BackgroundColor
            );
            setCategoryFontFamily(filteredArray[0].styles.category.FontFamily);
            setCategoryTextAlign(filteredArray[0].styles.category.TextAlign);
            setCategoryFontWeight(filteredArray[0].styles.category.fontWeight);
            setCategoryTextDecoration(filteredArray[0].styles.category.TextDecoration);

            setItemColor(filteredArray[0].styles.item.Color);
            setItemBackgroundColor(filteredArray[0].styles.item.BackgroundColor);
            setItemFontFamily(filteredArray[0].styles.item.FontFamily);
            setItemTextAlign(filteredArray[0].styles.item.TextAlign);
            setItemFontWeight(filteredArray[0].styles.item.fontWeight);
            setItemTextDecoration(filteredArray[0].styles.item.TextDecoration);
        }
    };

    const selectStyle = async () => {
        const response = await fetch("/menu/customizations/" + selectedStyle, {
            method: "PUT",
            body: JSON.stringify({
                active: true,
            }),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
        });
        const json = await response.json();
        if (!response.ok) {
            toast.error(json.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        if (response.ok) {
            updateMenu(selectedStyle);
            toast.success(json.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };
    const addStyle = async () => {
        const response = await fetch("/menu/customizations", {
            method: "POST",
            body: JSON.stringify({
                body: {
                    BackgroundColor: bodyBackgroundColor,
                    PrimaryColor: bodyPrimaryColor,
                    SecondaryColor: bodySecondaryColor,
                },
                category: {
                    FontFamily: categoryFontFamily,
                    TextDecoration: categoryTextDecoration,
                    Color: categoryColor,
                    BackgroundColor: categoryBackgroundColor,
                    TextAlign: categoryTextAlign,
                    fontWeight: categoryFontWeight,
                },
                item: {
                    FontFamily: itemFontFamily,
                    TextDecoration: itemTextDecoration,
                    Color: itemColor,
                    BackgroundColor: itemBackgroundColor,
                    textAlign: itemTextAlign,
                    fontWeight: itemFontWeight,
                },
                name: styleName,
            }),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
        });
        const json = await response.json();
        if (!response.ok) {
            toast.error(json.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        if (response.ok) {
            toast.success(json.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    useEffect(() => {
        const fetchStyles = async () => {
            try {
                const response = await fetch("/menu/customizations", {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("jwt")}`,
                    },
                });

                if (response.ok) {
                    const json = await response.json();

                    dispatch({ type: "SET", payload: json.data });
                }
            } catch (error) { }
        };

        const fetchActive = async () => {
            try {
                const response = await fetch("/menu/active", {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("jwt")}`,
                    },
                });

                if (response.ok) {
                    const json = await response.json();

                    setStyleName(json.data.menu.name);
                    setSelectedStyle(json.data.menu.name);

                    setBodyBackgroundColor(json.data.menu.body.BackgroundColor);
                    setBodyPrimaryColor(json.data.menu.body.PrimaryColor);
                    setbodySecondaryColor(json.data.menu.body.SecondaryColor);

                    setCategoryColor(json.data.menu.category.Color);
                    setCategoryBackgroundColor(json.data.menu.category.BackgroundColor);
                    setCategoryFontFamily(json.data.menu.category.FontFamily);
                    setCategoryTextAlign(json.data.menu.category.TextAlign);
                    setCategoryFontWeight(json.data.menu.category.fontWeight);
                    setCategoryTextDecoration(json.data.menu.category.TextDecoration);

                    setItemColor(json.data.menu.item.Color);
                    setItemBackgroundColor(json.data.menu.item.BackgroundColor);
                    setItemFontFamily(json.data.menu.item.FontFamily);
                    setItemTextAlign(json.data.menu.item.textAlign);
                    setItemFontWeight(json.data.menu.item.fontWeight);
                    setItemTextDecoration(json.data.menu.item.TextDecoration);
                }
            } catch (error) { }
        };

        fetchActive();
        fetchStyles();
    }, [dispatch]);

    useEffect(() => {
        document.title = `Menu | Customize`;
    });

    return (
        <div className="row">
            <div className="col-8">
                <div className="GeneralItem scroll " style={{ padding: "0px" }}>
                    <div id="accordion">
                        <div
                            className="card"
                            style={{
                                border: "1px #F0F0EF ",
                                borderRadius: "10px 10px 0px 0px",
                            }}
                        >
                            <div id="headingOne">
                                <h6 className="mb-0">
                                    <button
                                        data-toggle="collapse"
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                            padding: "15px",
                                            backgroundColor: "#F0F0EF",
                                            borderBottom: "1px solid #fff",
                                            borderRadius: "10px 10px 0px 0px",
                                        }}
                                        data-target="#collapseOne"
                                        aria-expanded="true"
                                        aria-controls="collapseOne"
                                    >
                                        Body
                                    </button>
                                </h6>
                            </div>
                            <div
                                id="collapseOne"
                                className="collapse show"
                                aria-labelledby="headingOne"
                                data-parent="#accordion"
                            >
                                <div className="card-body" style={{ padding: "20px" }}>
                                    <table width="100%">
                                        <tbody>
                                            <tr>
                                                <td width="80%" height="40px">
                                                    {" "}
                                                    <label>Primary Color</label>
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <input
                                                        type="color"
                                                        value={bodyPrimaryColor}
                                                        onChange={(e) =>
                                                            setBodyPrimaryColor(e.target.value)
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="80%" height="40px">
                                                    {" "}
                                                    <label>Secondary Color</label>
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <input
                                                        type="color"
                                                        value={bodySecondaryColor}
                                                        onChange={(e) =>
                                                            setbodySecondaryColor(e.target.value)
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="80%" height="40px">
                                                    {" "}
                                                    <label>Background Color</label>
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <input
                                                        type="color"
                                                        value={bodyBackgroundColor}
                                                        onChange={(e) =>
                                                            setBodyBackgroundColor(e.target.value)
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div
                            className="card"
                            style={{ border: "1px #F0F0EF ", borderRadius: "0px" }}
                        >
                            <h6 className="mb-0">
                                <button
                                    style={{
                                        width: "100%",
                                        textAlign: "left",
                                        padding: "15px",
                                        backgroundColor: "#F0F0EF",
                                        borderBottom: "1px solid #fff",
                                        borderRadius: "0px",
                                    }}
                                    data-toggle="collapse"
                                    data-target="#collapseTwo"
                                    aria-expanded="false"
                                    aria-controls="collapseTwo"
                                >
                                    Category
                                </button>
                            </h6>
                        </div>
                        <div
                            id="collapseTwo"
                            className="collapse"
                            aria-labelledby="headingTwo"
                            data-parent="#accordion"
                        >
                            <div className="card-body" style={{ padding: "20px" }}>
                                <table width="100%">
                                    <tbody>
                                        <tr>
                                            <td width="80%" height="40px">
                                                {" "}
                                                <label>Background Color</label>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <input
                                                    type="color"
                                                    value={categoryBackgroundColor}
                                                    onChange={(e) =>
                                                        setCategoryBackgroundColor(e.target.value)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="80%" height="40px">
                                                {" "}
                                                <label>Text Color</label>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <input
                                                    type="color"
                                                    value={categoryColor}
                                                    onChange={(e) => setCategoryColor(e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="80%" height="40px">
                                                {" "}
                                                <label>Text Align</label>
                                            </td>
                                            <td>
                                                <select
                                                    style={{ marginInline: "auto" }}
                                                    className="form-select shadow-none"
                                                    value={categoryTextAlign}
                                                    onChange={(e) =>
                                                        setCategoryTextAlign(e.target.value as TextAlign)
                                                    }
                                                >
                                                    <option value="">Choose</option>
                                                    <option value="left">Left</option>
                                                    <option value="center">Center</option>
                                                    <option value="right">Right</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="80%" height="40px">
                                                <label>Font </label>
                                            </td>
                                            <td>
                                                <select
                                                    style={{ marginInline: "auto" }}
                                                    className="form-select shadow-none"
                                                    value={categoryFontFamily}
                                                    onChange={(e) =>
                                                        setCategoryFontFamily(e.target.value)
                                                    }
                                                >
                                                    <option style={{ fontFamily: "Arial" }}>Arial</option>
                                                    <option style={{ fontFamily: "Brush Script MT" }}>
                                                        Brush Script MT
                                                    </option>
                                                    <option style={{ fontFamily: "Helvetica" }}>
                                                        Helvetica
                                                    </option>
                                                    <option style={{ fontFamily: "Georgia" }}>
                                                        Georgia
                                                    </option>
                                                    <option style={{ fontFamily: "Times New Roman" }}>
                                                        Times New Roman
                                                    </option>
                                                    <option style={{ fontFamily: "Courier New" }}>
                                                        Courier New
                                                    </option>
                                                    <option style={{ fontFamily: "Verdana" }}>
                                                        Verdana
                                                    </option>
                                                    <option style={{ fontFamily: "Impact" }}>
                                                        Impact
                                                    </option>
                                                    <option style={{ fontFamily: "Comic Sans MS" }}>
                                                        Comic Sans MS
                                                    </option>
                                                    <option style={{ fontFamily: "Trebuchet MS" }}>
                                                        Trebuchet MS
                                                    </option>
                                                    <option style={{ fontFamily: "Arial Black" }}>
                                                        Arial Black
                                                    </option>
                                                    <option style={{ fontFamily: "Palatino Linotype" }}>
                                                        Palatino Linotype
                                                    </option>
                                                    <option style={{ fontFamily: "Lucida Sans Unicode" }}>
                                                        Lucida Sans Unicode
                                                    </option>
                                                    <option style={{ fontFamily: "Tahoma" }}>
                                                        Tahoma
                                                    </option>
                                                    <option style={{ fontFamily: "Courier" }}>
                                                        Courier
                                                    </option>
                                                    <option style={{ fontFamily: "Lucida Console" }}>
                                                        Lucida Console
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="80%" height="40px">
                                                {" "}
                                                <label>
                                                    <b>Bold</b>
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        cursor: "pointer",
                                                        marginInline: "auto",
                                                        display: "block",
                                                        position: "relative"
                                                    }}
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={categoryFontWeight === "bold"}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setCategoryFontWeight("bold");
                                                        } else {
                                                            setCategoryFontWeight("");
                                                        }
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="80%" height="40px">
                                                {" "}
                                                <label>
                                                    <i>Italic</i>
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        cursor: "pointer",
                                                        marginInline: "auto",
                                                        display: "block",
                                                        position: "relative"
                                                    }}
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={categoryTextDecoration === "italic"}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setCategoryTextDecoration("italic");
                                                        } else {
                                                            setCategoryTextDecoration("");
                                                        }
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>{" "}
                            </div>
                        </div>
                        <div
                            className="card"
                            style={{ border: "1px #F0F0EF ", borderRadius: "0px" }}
                        >
                            <h6 className="mb-0">
                                <button
                                    style={{
                                        width: "100%",
                                        textAlign: "left",
                                        padding: "15px",
                                        backgroundColor: "#F0F0EF",
                                        borderBottom: "1px solid #fff",
                                        borderRadius: "0px",
                                    }}
                                    data-toggle="collapse"
                                    data-target="#collapseThree"
                                    aria-expanded="false"
                                    aria-controls="collapseThree"
                                >
                                    Item
                                </button>
                            </h6>
                        </div>
                        <div
                            id="collapseThree"
                            className="collapse"
                            aria-labelledby="headingThree"
                            data-parent="#accordion"
                        >
                            <div className="card-body" style={{ padding: "20px" }}>
                                <table width="100%">
                                    <tbody>
                                        <tr>
                                            <td width="80%" height="40px">
                                                {" "}
                                                <label>Background Color</label>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <input
                                                    type="color"
                                                    value={itemBackgroundColor}
                                                    onChange={(e) =>
                                                        setItemBackgroundColor(e.target.value)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="80%" height="40px">
                                                {" "}
                                                <label>Text Color</label>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <input
                                                    type="color"
                                                    value={itemColor}
                                                    onChange={(e) => setItemColor(e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="80%" height="40px">
                                                {" "}
                                                <label>Text Align</label>
                                            </td>
                                            <td>
                                                <select
                                                    style={{ marginInline: "auto" }}
                                                    className="form-select shadow-none"
                                                    value={itemTextAlign}
                                                    onChange={(e) =>
                                                        setItemTextAlign(e.target.value as TextAlign)
                                                    }
                                                >
                                                    <option value="">Choose</option>
                                                    <option value="left">Left</option>
                                                    <option value="center">Center</option>
                                                    <option value="right">Right</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="80%" height="40px">
                                                <label>Font </label>
                                            </td>
                                            <td>
                                                <select
                                                    style={{ marginInline: "auto" }}
                                                    className="form-select shadow-none"
                                                    value={itemFontFamily}
                                                    onChange={(e) => setItemFontFamily(e.target.value)}
                                                >
                                                    <option style={{ fontFamily: "Arial" }}>Arial</option>
                                                    <option style={{ fontFamily: "Brush Script MT" }}>
                                                        Brush Script MT
                                                    </option>
                                                    <option style={{ fontFamily: "Helvetica" }}>
                                                        Helvetica
                                                    </option>
                                                    <option style={{ fontFamily: "Georgia" }}>
                                                        Georgia
                                                    </option>
                                                    <option style={{ fontFamily: "Times New Roman" }}>
                                                        Times New Roman
                                                    </option>
                                                    <option style={{ fontFamily: "Courier New" }}>
                                                        Courier New
                                                    </option>
                                                    <option style={{ fontFamily: "Verdana" }}>
                                                        Verdana
                                                    </option>
                                                    <option style={{ fontFamily: "Impact" }}>
                                                        Impact
                                                    </option>
                                                    <option style={{ fontFamily: "Comic Sans MS" }}>
                                                        Comic Sans MS
                                                    </option>
                                                    <option style={{ fontFamily: "Trebuchet MS" }}>
                                                        Trebuchet MS
                                                    </option>
                                                    <option style={{ fontFamily: "Arial Black" }}>
                                                        Arial Black
                                                    </option>
                                                    <option style={{ fontFamily: "Palatino Linotype" }}>
                                                        Palatino Linotype
                                                    </option>
                                                    <option style={{ fontFamily: "Lucida Sans Unicode" }}>
                                                        Lucida Sans Unicode
                                                    </option>
                                                    <option style={{ fontFamily: "Tahoma" }}>
                                                        Tahoma
                                                    </option>
                                                    <option style={{ fontFamily: "Courier" }}>
                                                        Courier
                                                    </option>
                                                    <option style={{ fontFamily: "Lucida Console" }}>
                                                        Lucida Console
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="80%" height="40px">
                                                {" "}
                                                <label>
                                                    <b>Bold</b>
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        cursor: "pointer",
                                                        marginInline: "auto",
                                                        display: "block",
                                                        position: "relative"
                                                    }}
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={itemFontWeight === "bold"}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setItemFontWeight("bold");
                                                        } else {
                                                            setItemFontWeight("");
                                                        }
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="80%" height="40px">
                                                {" "}
                                                <label>
                                                    <i>Italic</i>
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        cursor: "pointer",
                                                        marginInline: "auto",
                                                        display: "block",
                                                        position: "relative"
                                                    }}
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={itemTextDecoration === "italic"}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setItemTextDecoration("italic");
                                                        } else {
                                                            setItemTextDecoration("");
                                                        }
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="input-group mb-3 mt-3 p-3">
                        <h6 className=" m-2">Style Name:</h6>
                        <input

                            type="text"
                            style={{
                                borderRadius: "5px 0px 0px 5px",
                            }}
                            className="form-control shadow-non"
                            value={styleName}
                            onChange={(e) => {
                                setStyleName(e.target.value);
                            }}
                            required
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                addStyle();
                            }}
                        >
                            {" "}
                            Add
                        </button>
                    </div>

                    <div className="input-group mb-3 mt-3 p-3">
                        <h6 className=" m-2">Set Style </h6>
                        <select
                            style={{
                                borderRadius: "5px 0px 0px 5px",
                            }}
                            className="form-control shadow-non"
                            value={selectedStyle}
                            onChange={(e) => {
                                setSelectedStyle(e.target.value);
                                updateMenu(e.target.value);
                            }}
                            required
                        >
                            <option value="">Choose</option>
                            {Styles &&
                                Styles.map((s: any) => (
                                    <option key={s.name} value={s.name}>
                                        {s.name}
                                    </option>
                                ))}
                        </select>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                selectStyle();
                            }}
                        >
                            {" "}
                            Select
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-4">
                <div
                    className="GeneralItem"
                    style={{
                        height: "69vh",
                        borderRadius: "15px",
                        padding: "0px",
                        position: "relative",
                        backgroundColor: bodyBackgroundColor,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: bodyPrimaryColor,
                            height: "60px",
                            padding: "10px",
                            paddingLeft: "20px",
                            borderRadius: "10px 10px 0px 0px",
                            borderBottom: "1px solid" + bodySecondaryColor,
                        }}
                    >
                        <i
                            style={{ fontSize: "30px", color: bodySecondaryColor }}
                            className="bi bi-arrow-left"
                        ></i>
                    </div>
                    <div>
                        <h4
                            style={{
                                color: categoryColor,
                                backgroundColor: categoryBackgroundColor,
                                textAlign: categoryTextAlign || undefined,
                                fontFamily: categoryFontFamily,
                                padding: "15px",
                                fontStyle: categoryTextDecoration,
                                fontWeight: categoryFontWeight === "bold" ? "bold" : "normal",
                            }}
                        >
                            Category
                        </h4>

                        <table
                            width="100%"
                            style={{
                                margin: "0px",
                            }}
                        >
                            <tbody>
                                <tr
                                    style={{
                                        backgroundColor: itemBackgroundColor,
                                        color: itemColor,
                                    }}
                                >
                                    <td>
                                        <img
                                            width="150px"
                                            src={placeholder}
                                            alt=""
                                            style={{ padding: "15px" }}
                                        />
                                    </td>
                                    <td>
                                        <h4
                                            style={{
                                                textAlign: itemTextAlign || undefined,
                                                fontFamily: itemFontFamily,
                                                padding: "15px",
                                                fontStyle: itemTextDecoration,
                                                fontWeight:
                                                    itemFontWeight === "bold" ? "bold" : "normal",
                                            }}
                                        >
                                            Item
                                        </h4>
                                        <span>Lorem ipsum dolor sit amet consec...</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div></div>
                    <div
                        style={{
                            bottom: 0,
                            position: "absolute",
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-around",
                            backgroundColor: bodyPrimaryColor,
                            padding: "5px",
                            zIndex: "99",
                            height: "60px",
                            borderRadius: "0px 0px 10px 10px",
                            borderTop: "1px solid " + bodySecondaryColor,
                        }}
                    >
                        <a
                            href="#"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                textDecoration: "none",
                                textAlign: "center",
                                fontSize: "15px",
                                color: bodySecondaryColor,
                                width: "80px",
                                paddingTop: "5px",
                            }}
                        >
                            {" "}
                            <i className="bi bi-book"></i>Menu
                        </a>
                        <a
                            href="#"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                textDecoration: "none",
                                textAlign: "center",
                                fontSize: "15px",
                                color: bodySecondaryColor,
                                width: "80px",
                                paddingTop: "5px",
                            }}
                        >
                            {" "}
                            <i className="bi bi-star"></i>promo
                        </a>
                        <a
                            href="#"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                textDecoration: "none",
                                textAlign: "center",
                                fontSize: "15px",
                                color: bodySecondaryColor,
                                width: "80px",
                                paddingTop: "5px",
                            }}
                        >
                            {" "}
                            <i className="bi bi-file-earmark-text"></i>Order
                        </a>
                        <a
                            href="#"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                textDecoration: "none",
                                textAlign: "center",
                                fontSize: "15px",
                                color: bodySecondaryColor,
                                width: "80px",
                                paddingTop: "5px",
                            }}
                        >
                            {" "}
                            <i className="bi bi-cash-coin"></i>Payment
                        </a>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={1000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
        </div>
    );
}
