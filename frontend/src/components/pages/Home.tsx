import React, { useContext } from "react"
import { AuthContext } from "App"

import "../../styles/Calendar.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useCallback, useState } from "react";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";


// とりあえず認証済みユーザーの名前やメールアドレスを表示
const Home: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext)
  const [isModal, setIsModal] = useState<boolean>(false);
  const [date, setDate] = useState<string>();
  const [event, setEvent] = useState<string>('');


  const handleDateClick = useCallback((arg: DateClickArg) => {
    setDate(arg.dateStr);
    setIsModal(true)
  }, []);

  const handleClick = () => {
    setEvent('');
    setIsModal(false);
  }
  
  return (
    <>
      {
        isSignedIn && currentUser ? (
          <>
            <div style={{position: "relative"}}>
              <div style={{position: "absolute", top: 0, left: 0, display: isModal ? "block" : "none", height: "200px", width: "400px", zIndex: "10", backgroundColor: "white", boxShadow: "0px 0px 10px rgba(0, 0, 0, .5)"}}>
                <div className="">
                  {date}
                </div>
                <div>
                  <input onChange={(e)=>{setEvent(e.target.value)}} value={event} type="text" placeholder="イベントを追加" style={{border: "none", borderBottom: "1px solid black", fontSize: "20px"}} />
                </div>
                <button onClick={handleClick}>完了</button>
              </div>
              <h1>Signed in successfully!</h1>
              <h2>Email: {currentUser?.email}</h2>
              <h2>Name: {currentUser?.name}</h2>
              <FullCalendar
                initialView="dayGridMonth"
                locale="ja" // 日本語化
                events={[
                  { title: "event 1", start: "2023-06-01" },
                  // endに指定した日付は含まないので注意
                  { title: "event 2", start: "2021-06-03", end: "2021-06-05" },
                  {
                    title: "event 3",
                    start: "2021-06-07T10:00:00", // 時間を指定するときはISO 8601の形式で。
                  },
                ]}
                plugins={[dayGridPlugin, interactionPlugin]}

                dateClick={handleDateClick} 
              />
            </div>
            
          </>
        ) : (
          <h1>Not signed in</h1>
        )
      }
    </>
  )
}

export default Home