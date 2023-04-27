import React, { useContext, useEffect } from "react"
import { AuthContext } from "App"

import "../../styles/Calendar.css";

import dayGridPlugin from "@fullcalendar/daygrid";
import { useCallback, useState } from "react";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { Event } from "interfaces/index";
import { sendEvent, getEvent, deleteEvent } from "lib/api/event";
import FullCalendar from "@fullcalendar/react";
import EventClickArg from "@fullcalendar/react";

type allEvents = {
  title: string;
  start: string;
  id: string;
};

// とりあえず認証済みユーザーの名前やメールアドレスを表示
const Home: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext)
  const [isModal, setIsModal] = useState<boolean>(false);
  const [date, setDate] = useState<string>('');
  const [event, setEvent] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [allEvent, setAllEvent] = useState<allEvents[]>([]);
  const [database, setDatabase] = useState();
  const [isAdd, setIsAdd] = useState(0);

  useEffect(() => {
    const getUsers = async () => {
      const json = await getEvent(currentUser?.id != undefined ? currentUser?.id : 0);
      const allContents = json['data']['allEvent']
      setDatabase(allContents)
      let allDatas = []
      for (const value of allContents) {
        let data = {
          title: value['title'], 
          start: value['date'],
          id: value['id'].toString(10)
        }
        allDatas.push(data)
      }
      setAllEvent(allDatas)
    };
    getUsers(); 
  }, [currentUser?.id, isAdd]);


  const handleDateClick = useCallback((arg: DateClickArg) => {
    setDate(arg.dateStr);
    setIsModal(true)
  }, []);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const params: Event = {
      body: body,
      date: date,
      name: currentUser?.name != undefined ? currentUser?.name : "",
      title: event,
      user_id: currentUser?.id != undefined ? currentUser?.id : 0,
    }
    setEvent('');
    setBody('');
    setIsModal(false);

    if (body != '' && event != '') {
      try {
        const res = await sendEvent(params)
        console.log(res)
        setIsAdd(isAdd + 1)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const handleEventClick = useCallback((arg: import("/Users/matsudarisa/dev/calendar2/frontend/node_modules/@fullcalendar/core/internal-common").a1) => {
      let isRemove = window.confirm(`このイベント「${arg.event.title}」を削除しますか`)
      console.log(arg)

      if (isRemove == true) {
        const deleteEvents = async () => {
          const json = await deleteEvent(parseInt(arg.event._def.publicId));
          setIsAdd(isAdd + 1)
        };
        deleteEvents(); 
      }
  }, []);
  
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
                <div>
                  <input onChange={(e)=>{setBody(e.target.value)}} value={body} type="text" placeholder="本文を追加" style={{border: "none", borderBottom: "1px solid black", fontSize: "20px"}} />
                </div>
                <button onClick={handleClick}>完了</button>
                <button onClick={(e)=>{setIsModal(false)}}>キャンセル</button>
              </div>
              <h1>Signed in successfully!</h1>
              <h2>Email: {currentUser?.email}</h2>
              <h2>Name: {currentUser?.name}</h2>
              <FullCalendar
                initialView="dayGridMonth"
                locale="ja" // 日本語化
                events={allEvent}
                plugins={[dayGridPlugin, interactionPlugin]}
                editable={true}
                eventClick={handleEventClick}
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