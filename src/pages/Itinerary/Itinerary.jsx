import { useDispatch, useSelector } from "react-redux"
import Navbar from "../../components/Navbar/Navbar"
import { useEffect, useState } from "react"
import { fetchUserData } from "../../utils/firebaseUtils"
import MapComponent from "../../components/Map/MapComponent/MapComponent"
import { setMapType } from "../../store/mapInfo/MapInfo"
import ExpenseCalendar from "../../components/CalendarRework/CalendarRework"
import CalendarRework from "../../components/CalendarRework/CalendarRework"

const Itinerary = () => {

    const dispatch = useDispatch()
    const uid = useSelector((state) => state.auth.userId);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadingFunction = async () => {
            await fetchUserData(uid);
            dispatch(setMapType("itinerary"))
            setLoading(true);
        }

        loadingFunction();
    }, [])

    return(
        <>
            <Navbar></Navbar>
            <MapComponent></MapComponent>
            <CalendarRework></CalendarRework>
        </>
    )
}

export default Itinerary