import Header from "../components/Header"
import Hero from "../components/Hero"
import Author from "../components/Author"
import ArticleList from "../components/ArticleList"
import TutorialList from "../components/TutorialList"
import Footer from "../components/Footer"

function Home() {
    return (
        <>
            <Header />
            <Hero />
            <Author />
            <ArticleList />
            <TutorialList />
            <Footer />
        </>
    )
}

export default Home