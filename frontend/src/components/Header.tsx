function openNav(): void {
    const t = document.getElementById("myBtn") as HTMLButtonElement;
    if (t.value === "ON") {
        document.getElementById("mySidenav")!.style.width = "0px";
        document.getElementById("main")!.style.marginLeft = "0px";

        t.value = "OFF";

    } else if (t.value === "OFF") {
        document.getElementById("mySidenav")!.style.width = "250px";
        document.getElementById("main")!.style.marginLeft = "250px";

        t.value = "ON";

    }
}

function Header() {
    return (
        <nav className="header">
            <div>
                <button id="myBtn" onClick={openNav} value="ON">
                    <span
                        id="menuicon"
                        style={{ fontSize: "30px", cursor: "pointer", transition: "0.5s" }}
                    >
                        ☰
                    </span>
                </button>
            </div>
            <span
                className="lnr lnr-drop"
                style={{ fontSize: "30px", marginRight: "300px" }}
            ></span>
        </nav>
    );
}

export default Header;