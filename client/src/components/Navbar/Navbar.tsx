import "./navbar.css";

function Navbar() {
  return (
    <nav>
      <div className="navContent">
        <a href="/">
          <h2>GIKAM</h2>
        </a>

        <div className="buttons">
          <a id="register-button" href="/signup">
            SIGN UP
          </a>
          <a id="login button" href="/login">
            LOGIN
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
