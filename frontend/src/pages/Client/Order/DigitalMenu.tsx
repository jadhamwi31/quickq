import { useEffect, useState } from 'react';
import { useActiveMenu } from '../../../hooks/useActiveMenu';
import { useNavigate, Link } from 'react-router-dom'
import PackageJson from '../../../../package.json'
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
const placeholder = require('../../../assets/placeholder.webp')

export default function DigitalMenu() {
    let navigate = useNavigate();
    const routeChange = (dishName: String) => {
        let path = `../dish/${dishName}`;
        navigate(path);
    }
    const { ActiveMenu } = useActiveMenu();
    const [menuItem, setMenuItem] = useState<{
        name: string;
        image: string;
        price: string;
        category: string;
        description: string;
        ingredients: {
            name: string;
            amount: number;
            unit: string;
        }[];
    }[]>([]);
    const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
    const handleCheckboxChange = (category: string) => {
        if (checkedCategories.includes(category)) {
            setCheckedCategories(checkedCategories.filter((cat) => cat !== category));
        } else {
            setCheckedCategories([...checkedCategories, category]);
        }
    };
    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch('/dishes');
            const json = await response.json();
            if (response.ok) {
                setMenuItem(json);
            }
        };
        fetchItems();
    }, []);
    const categoryNames = Array.from(new Set(menuItem.map((item) => item.category)));
    return (
        < >
            <div className="menuItems">

                <div >
                    {categoryNames.slice(0, 3).map((category) => {
                        const items = menuItem.filter((item) => item.category === category);

                        return (
                            <div key={category}>
                                <h1 style={{

                                    fontFamily: ActiveMenu ? ActiveMenu.data.menu.category.FontFamily : "Arial",
                                    textDecoration: ActiveMenu ? ActiveMenu.data.menu.category.TextDecoration : "normal",
                                    color: ActiveMenu ? ActiveMenu.data.menu.category.Color : "#000",
                                    backgroundColor: ActiveMenu ? ActiveMenu.data.menu.category.BackgroundColor : "#fff",
                                    fontWeight: ActiveMenu ? ActiveMenu.data.menu.category.fontWeight : "#000",
                                    fontStyle: ActiveMenu ? ActiveMenu.data.menu.category.TextDecoration : "left",
                                    textAlign: ActiveMenu ? ActiveMenu.data.menu.category.TextAlign : "left",
                                    width: "100%",
                                    padding: "10px",


                                }}>{category}</h1>
                                <div className='slide'>
                                    {items.map((item) => (
                                        <div key={item.name} className='slideitem' style={{
                                            backgroundImage: `url(${PackageJson.proxy}/images/${item ? item.image : placeholder})`,
                                            backgroundSize: "cover",
                                            cursor: "pointer",
                                            padding: "0px",
                                            position: "relative"
                                        }} onClick={() => {
                                            routeChange(item.name)
                                        }}>
                                            <p style={{
                                                position: "absolute",
                                                bottom: 10,
                                                fontSize: "25px",
                                                textAlign: "center",
                                                fontFamily: ActiveMenu ? ActiveMenu.data.menu.item.FontFamily : "Arial",
                                                width: "100%",
                                                background: "rgba(0, 0, 0, 0.5)",
                                                color: "white"
                                            }}>{item.name}</p>
                                        </div>

                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>



























                <div>
                    {categoryNames.map((category) => {
                        const items = menuItem.filter((item) => item.category === category);
                        const isChecked = checkedCategories.includes(category);

                        return (
                            <div key={category}>
                                <label
                                    style={{

                                        fontFamily: ActiveMenu ? ActiveMenu.data.menu.category.FontFamily : "Arial",
                                        textDecoration: ActiveMenu ? ActiveMenu.data.menu.category.TextDecoration : "normal",
                                        color: ActiveMenu ? ActiveMenu.data.menu.category.Color : "#000",
                                        backgroundColor: ActiveMenu ? ActiveMenu.data.menu.category.BackgroundColor : "#fff",
                                        fontWeight: ActiveMenu ? ActiveMenu.data.menu.category.fontWeight : "#000",
                                        fontStyle: ActiveMenu ? ActiveMenu.data.menu.category.TextDecoration : "left",
                                        textAlign: ActiveMenu ? ActiveMenu.data.menu.category.TextAlign : "left",
                                        width: "100%",
                                        padding: "10px"

                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleCheckboxChange(category)}
                                        style={{ display: "none" }}
                                    />
                                    <span style={{
                                        cursor: "pointer"
                                    }}>
                                        <h1>{category}</h1></span>

                                </label>
                                {isChecked && (
                                    <table width="100%" style={{
                                        margin: "0px",

                                    }}>
                                        {items.map((item) => (





                                            <tbody>



                                                <tr className="tr-hover" style={{

                                                    color: ActiveMenu ? ActiveMenu.data.menu.item.Color : "#000",
                                                    fontFamily: ActiveMenu ? ActiveMenu.data.menu.item.FontFamily : "Arial",
                                                    fontStyle: ActiveMenu ? ActiveMenu.data.menu.item.TextDecoration : "right",
                                                    textDecoration: "none",
                                                    display: "block",
                                                    width: "100%",
                                                    backgroundColor: ActiveMenu ? ActiveMenu.data.menu.item.BackgroundColor : "#000",
                                                    cursor: "pointer",
                                                    padding: "20px",



                                                }} onClick={() => {
                                                    routeChange(item.name)
                                                }}>
                                                    <td rowSpan={2} style={{
                                                        width: "500px",
                                                        height: "150px",
                                                        borderRadius: " 25px",
                                                        padding: "10px",
                                                        backgroundSize: "cover",


                                                        backgroundImage: `URL(${PackageJson.proxy}/images/${item.image ? item.image : placeholder})`
                                                    }}>

                                                    </td>
                                                    <td width="500px" height="30px" style={{
                                                        paddingLeft: "60px"
                                                    }}>

                                                        <h4 style={{



                                                            textAlign: ActiveMenu ? ActiveMenu.data.menu.item.textAlign : "left",
                                                            fontWeight: ActiveMenu ? ActiveMenu.data.menu.item.fontWeight : "normal"

                                                        }}>{item.name}</h4>
                                                        <span >{item.description}</span><br />
                                                        <span ><b>Price :</b>{item.price} $</span>
                                                    </td>


                                                </tr>

                                            </tbody>
                                        ))}
                                    </table>
                                )
                                }
                            </div>
                        );
                    })}
                </div >

            </div>

        </>
    );
}
