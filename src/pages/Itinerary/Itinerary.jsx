import { useSelector } from "react-redux"
import Navbar from "../../components/Navbar/Navbar"
import { useEffect, useState } from "react"
import { fetchUserData } from "../../utils/firebaseUtils"
import MapComponent from "../../components/Map/MapComponent/MapComponent"

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
            <MapComponent></MapComponent>
        </>
    )
}

export default Itinerary