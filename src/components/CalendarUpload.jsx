import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CalendarUpload = ({ fileName, uploadDateTime }) => {
  const { token } = useSelector((state) => state.auth);
  const [eventCreated, setEventCreated] = useState(false); // State to track event creation

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
          setEventCreated(true); // Mark the event as created
          alert(`Event created successfully`);
        } else {
          console.error("Failed to create event");
        }
      } catch (error) {
        console.error("Error adding event to calendar:", error);
      }
    };

    // Only create the event if it hasn't been created yet
    if (fileName && uploadDateTime && !eventCreated) {
      createCalendarEvent();
    }
  }, [fileName, uploadDateTime, token, eventCreated]); // Add eventCreated to dependencies

  return null; // No UI is needed for this component
};

export default CalendarUpload;
