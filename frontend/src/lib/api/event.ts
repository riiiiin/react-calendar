import client from "lib/api/client"
import Cookies from "js-cookie"
import applyCaseMiddleware from "axios-case-converter"
import axios from "axios"

import { Event } from "interfaces/index"

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
