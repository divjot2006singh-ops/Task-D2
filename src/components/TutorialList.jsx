import Tutorial from "./Tutorial"

function TutorialList() {

    const tutorials = [
        {
            name: "JavaScript Basics",
            description: "Introduction to JavaScript.",
            rating: 5,
            username: "Divjot",
            image: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg"
        },
        {
            name: "React Router",
            description: "Learn how to navigate between React pages.",
            rating: 5,
            username: "Alex",
            image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg"
        },
        {
            name: "ExpressJS",
            description: "Introduction to ExpressJS and backend development.",
            rating: 4.9,
            username: "John",
            image: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg"
        }
    ]

    return (
        <section
            id="tutorials"
            style={{
                padding: "40px",
                textAlign: "center",
                backgroundColor: "#f7f7f7"
            }}
        >

            <h2>Featured Tutorials</h2>

            <p>
                Learn new skills through our developer tutorials.
            </p>

            <div style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap"
            }}>

                {tutorials.map(function(tutorial) {

                    return (
                        <Tutorial
                            key={tutorial.name}
                            name={tutorial.name}
                            description={tutorial.description}
                            rating={tutorial.rating}
                            username={tutorial.username}
                            image={tutorial.image}
                        />
                    )

                })}

            </div>

        </section>
    )
}

export default TutorialList