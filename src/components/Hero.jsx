import img2 from "../images/img2.jpeg"

function Hero() {
    return (
        <section style={{
            textAlign: "center",
            backgroundColor: "white",
            paddingBottom: "30px"
        }}>

            <img
                src={img2}
                alt="Deakin University"
                style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover"
                }}
            />

            <h2 style={{
                fontSize: "32px",
                marginTop: "25px"
            }}>
                Hey, I'm Divjot Singh
            </h2>

            <p>
                Welcome to DEV@Deakin
            </p>

        </section>
    )
}

export default Hero