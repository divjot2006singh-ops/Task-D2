import Article from "./Article"

function ArticleList() {

    const articles = [
        {
            name: "C# Programming",
            description: "A C# programming project developed during university.",
            rating: 5,
            author: "Divjot",
            image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg"
        },
        {
            name: "Networking Project",
            description: "A networking project involving IP addressing and routing.",
            rating: 5,
            author: "Alex",
            image: "https://images.pexels.com/photos/2881224/pexels-photo-2881224.jpeg"
        },
        {
            name: "Web Development",
            description: "A website developed using HTML, CSS and React.",
            rating: 5,
            author: "John",
            image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg"
        }
    ]

    return (
        <section
            id="articles"
            style={{
                padding: "30px",
                textAlign: "center",
                backgroundColor: "white"
            }}
        >

            <h2>Featured Articles</h2>

            <p>
                Read articles from our developer community.
            </p>

            <div style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap"
            }}>

                {articles.map(function(article) {

                    return (
                        <Article
                            key={article.name}
                            name={article.name}
                            description={article.description}
                            rating={article.rating}
                            author={article.author}
                            image={article.image}
                        />
                    )

                })}

            </div>

        </section>
    )
}

export default ArticleList