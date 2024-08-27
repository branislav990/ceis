import "./header.css";

const Header = () => {
    return (
        <header className="header">
            <nav className="navbar">
                <a href="{% url 'blog:blog-post-list' %}" className="nav-logo">
                    <img
                        src={require("../assets/ceis_logo_2.png")}
                        alt="CEIS logo"
                        height="60"
                    />
                </a>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <a
                            href="{% url 'blog:blog-post-list' %}"
                            className="nav-link nav-link-active"
                        >
                            Blog
                        </a>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link nav-link-inactive">
                            Biblioteka
                        </span>
                    </li>

                    <li className="nav-item">
                        <span className="nav-link nav-link-inactive">
                            Zaštita prirode
                        </span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link nav-link-inactive">Kontakt</span>
                    </li>
                </ul>
                <div className="hamburger">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </nav>
        </header>
    );
};

export default Header;
