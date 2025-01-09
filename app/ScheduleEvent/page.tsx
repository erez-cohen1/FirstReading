/*
create a new component called ScheduleEvent that will be the page that will be displayed when clicking on a certain event in the Schedule page. this component should contain the following:
1. a header with the committee name and event name
2. a section with the event start time
3. a section with the event description which is fetched via a function called fetchEventDescription that will be implemented in the ScheduleEvent component
4. a section with the event participants which is fetched via a function called fetchEventParticipants that will be implemented in the ScheduleEvent component
5. a link to the event's live stream if it exists
*/
import { CommitteeEvent } from "../Components/Schedule";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  fetchEventDescription,
  fetchEventParticipants,
} from "../getScheduleData";

export default function ScheduleEvent(props: CommitteeEvent) {
  const router = useRouter();
  const { id } = router.query;
  const [eventDescription, setEventDescription] = useState<string>("");
  const [eventParticipants, setEventParticipants] = useState<string>("");
  const [eventLiveStream, setEventLiveStream] = useState<string>("");

  useEffect(() => {
    fetchEventDescription(id as string, setEventDescription);
    fetchEventParticipants(id as string, setEventParticipants);
  }, []);

  return (
    <main className="main-page">
      <header className="main-header">
        <h1>{eventDescription}</h1>
      </header>
      <section>
        <h2>תיאור האירוע</h2>
        <p>{eventDescription}</p>
      </section>
      <section>
        <h2>משתתפים</h2>
        <p>{eventParticipants}</p>
      </section>
      <section>
        <h2>שידור חי</h2>
        <a href={eventLiveStream}>שידור חי</a>
      </section>
    </main>
  );
}
