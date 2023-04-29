import React, { useContext, useEffect } from "react"
import { AuthContext } from "App"

import "../../styles/Calendar.css";

import dayGridPlugin from "@fullcalendar/daygrid";
import { useCallback, useState } from "react";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { Event, updateFollow } from "interfaces/index";
import { sendEvent, getEvent, deleteEvent, updateApproval, destroyApproval } from "lib/api/event";
import FullCalendar from "@fullcalendar/react";
import EventClickArg from "@fullcalendar/react";
import CloseIcon from '@material-ui/icons/Close';

type allEvents = {
  title: string;
  start: string;
  id: string;
  color: string;
  extendedProps: object;
};

type extendes = {
  body: String,
  name: String,
  id: Number,
  title: string,
  bool: boolean,
  event_id: string
}

const colors = ['rgba(67, 203, 195, .75)', 'rgba(143, 203, 67, .75)', 'rgba(234, 49, 101. .75)', 'rgba(188, 156, 255, .75)', 'rgba(255, 174, 128, .75)']

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
  const [followers, setFollowers] = useState([])
  const [followersInfo, setFollowersInfo] = useState([])
  const [followEvent, setFollowEvent] = useState([])
  const [isDetails, setIsDetails] = useState<boolean>(false)
  const [detailsEvent, setDetailsEvent] = useState<extendes>({
    body: "",
    name: "",
    id: 0,
    title: "",
    bool: false,
    event_id: "",
  })

  useEffect(() => {
    const getUsers = async () => {
      const json = await getEvent(currentUser?.id != undefined ? currentUser?.id : 0);
      console.log(json)
      const allContents = json['data']['allEvent']
      const allFollowContents = json['data']['visibleFollowsEvent']
      setFollowers(json['data']['followers'])
      setFollowersInfo(json['data']['followersInfo'])
      setDatabase(allContents)
      setFollowEvent(allFollowContents)
      let allDatas = []
      for (const value of allContents) {
        let data = {
          title: value['title'], 
          start: value['date'],
          id: value['id'].toString(10),
          color: colors[0],
          extendedProps : {
            body: value['body'],
            name: value['name'],
            id: currentUser?.id != undefined ? currentUser?.id : 0,
            title: value['title']
          }
        }
        allDatas.push(data)
      }
      let color = 1
      if (allFollowContents != undefined) {
        let follow_id = allFollowContents[0]['userId']
        for (let i = 0; i < allFollowContents.length; i++ ) {
          if (follow_id != allFollowContents[i]['userId']) {
            color += 1
            follow_id = allFollowContents[i]['userId']
          }
          let data = {
            title: allFollowContents[i]['title'], 
            start: allFollowContents[i]['date'],
            id: allFollowContents[i]['id'].toString(10),
            color: colors[color],
            extendedProps : {
              body: allFollowContents[i]['body'],
              name: allFollowContents[i]['name'],
              id: allFollowContents[i]['userId'],
              title: allFollowContents[i]['title']
            }
          }
          allDatas.push(data)
        }
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
    const argData = {
      body: arg.event._def.extendedProps['body'],
      name: arg.event._def.extendedProps['name'],
      id: arg.event._def.extendedProps['id'],
      title: arg.event.title,
      bool: currentUser?.id == arg.event._def.extendedProps['id'] ? true : false,
      event_id: arg.event._def.publicId
    }
    setDetailsEvent(argData)
    setIsDetails(true)
  }, []);

  const handleDeleteEvent = () => {
    const deleteEvents = async () => {
      const json = await deleteEvent(parseInt(detailsEvent['event_id']));
      setIsAdd(isAdd + 1)
    };
    deleteEvents(); 
    setIsDetails(false)

  }

  const handleApprovalClick = async (follower_id: number) => {
    const params: updateFollow = {
      user_id: currentUser?.id != undefined ? currentUser?.id : 0,
      follower_id: follower_id,
      isApprove: "true",
    }
    try {
      const res = await updateApproval(params)
      console.log(res)
      setIsAdd(isAdd + 1)
    } catch (err) {
      console.log(err)
    }
    
  }
  const handleNotApprovalClick = async (follower_id: number) => {
    const params: updateFollow = {
      user_id: currentUser?.id != undefined ? currentUser?.id : 0,
      follower_id: follower_id,
      isApprove: "never",
    }
    try {
      const res = await updateApproval(params)
      console.log(res)
      setIsAdd(isAdd + 1)
    } catch (err) {
      console.log(err)
    }

  }
  
  return (
    <>
      {
        isSignedIn && currentUser ? (
          <>
            <div style={{position: "relative", color: "#1A4F83"}}>
              <div style={{position: "fixed", top: "100px", left: "200px", borderRadius: "8px", display: isModal ? "block" : "none", height: "200px", width: "400px", zIndex: "10", backgroundColor: "white", boxShadow: "0px 0px 10px rgba(150, 150, 150, .5)"}}>
                <div style={{margin: "10px"}}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div className="">
                      {date}
                    </div>
                    <CloseIcon onClick={(e)=>{setIsModal(false)}} style={{cursor: "pointer"}} />
                  </div>
                  <div style={{marginTop: "30px"}}>
                    <input onChange={(e)=>{setEvent(e.target.value)}} value={event} type="text" placeholder="イベントを追加" style={{border: "none", borderBottom: "1px solid rgba(26, 79, 131, .5)", fontSize: "20px"}} />
                  </div>
                  <div style={{marginTop: "15px"}}>
                    <input onChange={(e)=>{setBody(e.target.value)}} value={body} type="text" placeholder="本文を追加" style={{border: "none", borderBottom: "1px solid rgba(26, 79, 131, .5)", fontSize: "20px"}} />
                  </div>
                  <div style={{display: "flex", justifyContent: "end", marginTop: "30px"}}>
                    <button style={{backgroundColor: "#1A4F83", color: "white", border:"none", padding: "5px 20px", borderRadius: "5px", fontWeight: "bold"}} onClick={handleClick}>追加</button>
                  </div>
                </div>
              </div>
              <div style={{position: "fixed", top: "100px", left: "200px", borderRadius: "8px", width: "400px", height: "250px", zIndex: "5", display: isDetails ? "block" : "none", boxShadow: "0px 0px 10px rgba(150, 150, 150, .5)", backgroundColor: "white"}}>
                <div style={{margin: "20px"}}>
                  <div style={{display: "flex", justifyContent: "end", alignItems: "center"}}>
                    <CloseIcon onClick={(e)=>{setIsDetails(false)}} style={{cursor: "pointer"}} />
                  </div>
                  <div style={{marginTop: "15px"}}>
                    イベント名：{detailsEvent?detailsEvent['title']:""}
                  </div>
                  <div style={{marginTop: "15px"}}>
                    内容：{detailsEvent?detailsEvent['body']:""}
                  </div>
                  <div style={{marginTop: "15px"}}>
                    作成者：{detailsEvent?detailsEvent['name']:""}
                  </div>
                  <div style={{display: "flex", justifyContent: "end", marginTop: "30px"}}>
                    <button onClick={handleDeleteEvent} style={{display: detailsEvent["bool"] == true ? "block" : "none", backgroundColor: "#1A4F83", color: "white", border:"none", padding: "5px 20px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", marginRight: "10px"}}>削除</button>
                  </div>
                </div>
              </div>
              
              {
                followersInfo?.map((value, index) => {
                  return(
                    <div key={index} style={{display: "flex", color: "black", fontSize: "20px", margin: "20px 0"}}>
                      <div>{value['name']}からフォローが来ています。承認しますか？</div>
                      <button style={{backgroundColor: "#1A4F83", color: "white", border:"none", padding: "5px 20px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", margin: "0 10px"}} onClick={() => handleApprovalClick(value['id'])}>Yes</button>
                      <button style={{backgroundColor: "#1A4F83", color: "white", border:"none", padding: "5px 20px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", marginRight: "10px"}} onClick={() => handleNotApprovalClick(value['id'])}>No</button>
                    </div>
                  )
                }
                )
              }
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