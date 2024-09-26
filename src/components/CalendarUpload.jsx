import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const CalendarUpload = ({ fileName, uploadDateTime }) => {
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const createCalendarEvent = async () => {
      try {
        const event = {
          summary: `Uploaded video: ${fileName}`,
          start: {
            dateTime: uploadDateTime,
            timeZone: "UTC",
          },
          end: {
            dateTime: new Date(new Date(uploadDateTime).getTime() + 30 * 60 * 1000).toISOString(), // 30 min duration
            timeZone: "UTC",
          },
        };

        const response = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(event),
          }
        );

        if (response.ok) {
          console.log("Event created successfully");
          alert(`Event created successfully`);
        } else {
          console.error("Failed to create event");
        }
      } catch (error) {
        console.error("Error adding event to calendar:", error);
      }
    };

    if (fileName && uploadDateTime) {
      createCalendarEvent();
    }
  }, [fileName, uploadDateTime, token]);

  return null; // No UI is needed for this component
};

export default CalendarUpload;
