import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { message, Row, Col } from "antd";
import { GetBookingsOfUser } from "../../apicalls/bookings";
import moment from "moment";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetBookingsOfUser();
      if (response.success) {
        setBookings(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Row gutter={[16, 16]}>
        {bookings.map((booking) => (
          <Col key={booking._id} span={12}>
            {booking.show ? (
              <div className="card p-2 flex justify-between uppercase">
                <div>
                  <h1 className="text-xl">
                    {booking.show.movie && booking.show.movie.title} ({booking.show.movie && booking.show.movie.language})
                 </h1>
                  <div className="divider"></div>
                  <h1 className="text-sm">
                    {booking.show.theatre && booking.show.theatre.name} ({booking.show.theatre && booking.show.theatre.address})
                  </h1>
                  <h1 className="text-sm">
                    Date & Time: {booking.show.date && moment(booking.show.date).format("MMM Do YYYY")}{" "}
                    - {booking.show.time && moment(booking.show.time, "HH:mm").format("hh:mm A")}
                  </h1>

                  <h1 className="text-sm">
                    Amount : $ {booking.show.ticketPrice * booking.seats.length}
                  </h1>
                 <h1 className="text-sm">Booking ID: {booking._id}</h1>
               </div>

                <div>
                  {booking.show.movie && booking.show.movie.poster && (
                    <img
                      src={booking.show.movie.poster}
                      alt=""
                      height={100}
                      width={100}
                      className="br-1"
                    />
                  )}
                  <h1 className="text-sm">Seats: {booking.seats.join(", ")}</h1>
                </div>
              </div>
            ) : (
              <div>
                Error: No show data available for this booking.
              </div>
            )}
          </Col>
        ))}
      </Row>
    </div>
  );

}

export default Bookings;
