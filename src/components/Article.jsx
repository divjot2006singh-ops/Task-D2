function Article(props) {
    return (
        <div style={{
            width: "250px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            textAlign: "center"
        }}>

            <img
                src={props.image}
                alt={props.name}
                style={{
                    width: "100%",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px"
                }}
            />

            <h3>{props.name}</h3>

            <p>{props.description}</p>

            <p>⭐ {props.rating}</p>

            <p>{props.author}</p>

            <button>
                Read More
            </button>

        </div>
    )
}

export default Article