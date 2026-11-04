import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewPost from "./pages/NewPost";
import BrowsePosts from "./pages/BrowsePosts";
import Pricing from "./pages/Pricing";

import "./App.css";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/post" element={<NewPost />} />
                <Route path="/browse-posts" element={<BrowsePosts />} />
                <Route path="/pricing" element={<Pricing />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;