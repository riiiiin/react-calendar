import client from "lib/api/client"
import Cookies from "js-cookie"
import applyCaseMiddleware from "axios-case-converter"
import axios from "axios"

import { Event, Follow, updateFollow } from "interfaces/index"

const options = {
    ignoreHeaders: true 
  }
  
const client1 = applyCaseMiddleware(axios.create({
baseURL: "http://localhost:3001/"
}), options)

// イベント作成
export const sendEvent = (params: Event) => {
  return client1.post("events/create", params)
}

export const getEvent = (id: number) => {
  return client1.post("events/index", {
    user_id: id
  })
}

export const deleteEvent = (id: number) => {
  return client1.post("events/destroy", {
    id: id
  })
}

export const addFollow = (params: Follow) => {
    return client1.post("events/createFollow", params)
}

export const updateApproval = (params: updateFollow) => {
    return client1.post("events/updateFollow", params)
}

export const destroyApproval = (params: updateFollow) => {
    return client1.post("events/destroyFollow", params)
}
