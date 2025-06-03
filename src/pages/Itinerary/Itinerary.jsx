import { useSelector } from "react-redux"
import Navbar from "../../components/Navbar/Navbar"
import { useEffect, useState } from "react"
import { fetchUserData } from "../../utils/firebaseUtils"

const Itinerary = () => {

    const uid = useSelector((state) => state.auth.userId);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadingFunction = async () => {
            await fetchUserData(uid);
            setLoading(true);
        }

        loadingFunction();
    }, [])

    return(
        <>
            <Navbar></Navbar>
        </>
    )
}

export default Itinerary