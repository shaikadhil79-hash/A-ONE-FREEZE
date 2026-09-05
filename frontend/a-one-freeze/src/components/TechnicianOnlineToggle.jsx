import { useState } from "react";
import "./TechnicianOnlineToggle.css";

import {
  MapPin,
  Power,
  LoaderCircle,
  Navigation,
} from "lucide-react";


function TechnicianOnlineToggle({
  isOnline,
  onStatusChange,
}) {

  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");


  // ==============================
  // GET CURRENT LOCATION
  // ==============================

  const getLocation = () => {

    return new Promise((resolve, reject) => {

      if (!navigator.geolocation) {

        reject(
          new Error(
            "Location services are not supported by this browser."
          )
        );

        return;
      }


      navigator.geolocation.getCurrentPosition(

        (position) => {

          console.log(
            "Location received:",
            position.coords.latitude,
            position.coords.longitude
          );

          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

        },


        (error) => {

          console.error(
            "Location error:",
            error
          );

          let message =
            "Unable to get your current location.";

          if (error.code === error.PERMISSION_DENIED) {

            message =
              "Location permission was denied. Please allow location access for this website.";

          }

          else if (
            error.code === error.POSITION_UNAVAILABLE
          ) {

            message =
              "Your current location is unavailable. Please make sure Windows Location is turned on.";

          }

          else if (
            error.code === error.TIMEOUT
          ) {

            message =
              "Location request timed out. Please try again.";

          }

          reject(
            new Error(message)
          );

        },


        {
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 60000,
        }

      );

    });

  };


  // ==============================
  // GO ONLINE / OFFLINE
  // ==============================

  const handleStatusChange = async () => {

    setLocationError("");

    setLoading(true);


    try {

      let latitude = null;
      let longitude = null;


      // ==============================
      // GET LOCATION ONLY WHEN
      // GOING ONLINE
      // ==============================

      if (!isOnline) {

        const location =
          await getLocation();

        latitude =
          location.latitude;

        longitude =
          location.longitude;

      }


      // ==============================
      // IMPORTANT
      // GET TECHNICIAN TOKEN
      // ==============================

      const token =
        localStorage.getItem(
          "technicianAccessToken"
        );


      console.log(
        "Technician token found:",
        !!token
      );


      if (!token) {

        throw new Error(
          "Technician login session not found. Please login again."
        );

      }


      // ==============================
      // UPDATE ONLINE STATUS
      // ==============================

      const response =
        await fetch(

          "http://127.0.0.1:5000/api/technician/online-status",

          {

            method: "PATCH",


            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },


            body:
              JSON.stringify({

                is_online:
                  !isOnline,

                latitude,

                longitude,

              }),

          }

        );


      const data =
        await response.json();


      console.log(
        "Online status response:",
        data
      );


      if (!response.ok) {

        throw new Error(

          data.message ||

          data.error ||

          "Unable to update technician status."

        );

      }


      // ==============================
      // UPDATE PARENT DASHBOARD
      // ==============================

      onStatusChange(
        data.is_online,
        latitude,
        longitude
      );


      // ==============================
      // SAVE STATUS
      // ==============================

      localStorage.setItem(

        "technicianOnline",

        String(data.is_online)

      );


    }


    catch (error) {

      console.error(
        "Online status error:",
        error
      );


      setLocationError(
        error.message
      );

    }


    finally {

      setLoading(false);

    }

  };


  return (

    <div className="technician-online-container">


      <button

        className={
          isOnline
            ? "technician-duty-button online"
            : "technician-duty-button offline"
        }

        onClick={handleStatusChange}

        disabled={loading}

      >


        {loading ? (

          <>

            <LoaderCircle
              size={18}
              className="spin"
            />

            Updating...

          </>

        ) : isOnline ? (

          <>

            <Power size={18} />

            GO OFFLINE

          </>

        ) : (

          <>

            <MapPin size={18} />

            GO ONLINE

          </>

        )}


      </button>


      {locationError && (

        <div className="location-error">

          <Navigation size={18} />


          <div>

            <strong>
              Unable to Go Online
            </strong>


            <p>
              {locationError}
            </p>


            <button
              onClick={handleStatusChange}
            >

              Try Again

            </button>


          </div>

        </div>

      )}


    </div>

  );

}


export default TechnicianOnlineToggle;