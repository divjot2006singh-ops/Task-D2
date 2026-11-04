import img3 from "../images/img3.jpg"

function Author() {
    return (
        <section
            id="about"
            style={{
                padding: "50px",
                textAlign: "center",
                backgroundColor: "white"
            }}
        >

            <h2>Author Profile</h2>

            <img
                src={img3}
                alt="Divjot Singh"
                style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "50%"
                }}
            />

            <p>
                I am an AI Engineer and university student based in Australia.
            </p>

            <div style={{
                width: "120px",
                borderTop: "2px solid teal",
                margin: "25px auto"
            }}>
            </div>

            <h3 style={{
                color: "teal"
            }}>
                Here's what I've done so far
            </h3>

        </section>
    )
}

export default Author