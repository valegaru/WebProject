import Navbar from "../../components/Navbar/Navbar"
import DateCarousel from "../../components/DateCarousel/DateCarousel"
import CustomButton from "../../components/CustomButton/CustomButton"

function ExpenseTracker() {
 
  return (
      <>
        <Navbar></Navbar>
        <div className="carousel-and-button">
          <DateCarousel></DateCarousel>
          <CustomButton label="ADD EXPENSE"></CustomButton>
        </div>
      </>
  )
}

export default ExpenseTracker