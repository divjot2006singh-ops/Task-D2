import "./Footer.css";

function Footer() {
return ( <footer className="site-footer" id="contact">
<form className="newsletter-bar" onSubmit={(event) => event.preventDefault()}> <h2>SIGN UP FOR OUR DAILY INSIDER</h2>

            <input
                type="email"
                placeholder="Enter your email"
                aria-label="Enter your email"
                required
            />

            <button type="submit">Subscribe</button>
        </form>

        <div className="footer-content">
            <div className="footer-column">
                <h3>Explore</h3>
                <p>Home</p>
                <p>Questions</p>
                <p>Articles</p>
                <p>Tutorials</p>
            </div>

            <div className="footer-column">
                <h3>Support</h3>
                <p>FAQs</p>
                <p>Help</p>
                <p>Contact Us</p>
            </div>

            <div className="footer-column">
                <h3>Stay connected</h3>

                <div className="social-icons">
                    <a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noreferrer">
                        <img src="https://cdn.simpleicons.org/facebook/ffffff" alt="Facebook" />
                    </a>

                    <a href="https://twitter.com/" aria-label="Twitter" target="_blank" rel="noreferrer">
                        <img src="https://cdn.simpleicons.org/x/ffffff" alt="Twitter/X" />
                    </a>

                    <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer">
                        <img src="https://cdn.simpleicons.org/instagram/ffffff" alt="Instagram" />
                    </a>
                </div>
            </div>
        </div>

        <div className="footer-bottom">
            <h3>DEV@Deakin 2022</h3>

            <div className="footer-legal">
                <p>Privacy Policy</p>
                <p>Terms</p>
                <p>Code of Conduct</p>
            </div>
        </div>
    </footer>
);


}

export default Footer;
