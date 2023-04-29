import React, { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Cookies from "js-cookie"

import { makeStyles, Theme } from "@material-ui/core/styles"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CloseIcon from '@material-ui/icons/Close';
import GroupIcon from '@material-ui/icons/Group';

import { signOut } from "lib/api/auth"
import { AuthContext } from "App"
import { Event, Follow } from "interfaces/index";
import { addFollow } from "lib/api/event";

const useStyles = makeStyles((theme: Theme) => ({
  iconButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textDecoration: "none",
    color: "inherit"
  },
  linkBtn: {
    textTransform: "none"
  }
}))

const Header: React.FC = () => {
  const { loading, isSignedIn, setIsSignedIn, currentUser } = useContext(AuthContext)
  const [ isModal, setIsModal ] = useState<string>('')
  const [ followMail, setFollowMail ] = useState<string>('')
  const [ followName, setFollowName ] = useState<string>('')
  const [ members, setMembers ] = useState<string>('')
  const classes = useStyles()
  const navigate = useNavigate()

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await signOut()

      if (res.data.success === true) {
        // サインアウト時には各Cookieを削除
        Cookies.remove("_access_token")
        Cookies.remove("_client")
        Cookies.remove("_uid")

        setIsSignedIn(false)
        navigate("/signin")

        console.log("Succeeded in sign out")
      } else {
        console.log("Failed in sign out")
      }
    } catch (err) {
      console.log(err)
    }
  }


  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const params: Follow = {
      user_id: currentUser?.id != undefined ? currentUser?.id : 0,
      follow_name: followName,
      follow_mail: followMail,
      isApprove: 'false'
    }

    if (followName != '' && followMail != '') {
      try {
        const res = await addFollow(params)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    }
    setIsModal("false")
    setFollowMail("")
    setFollowName("")
  }

  const AuthButtons = () => {
    // 認証完了後はサインアウト用のボタンを表示
    // 未認証時は認証用のボタンを表示
    if (!loading) {
      if (isSignedIn) {
        return (
          <Button
            color="inherit"
            className={classes.linkBtn}
            onClick={handleSignOut}
          >
            <div style={{color: "#1A4F83"}}>
            Sign out
            </div>
          </Button>
        )
      } else {
        return (
          <>
            <Button
              component={Link}
              to="/signin"
              color="inherit"
              className={classes.linkBtn}
            >
              <div style={{color: "#1A4F83"}}>
              Sign in
            </div>
            </Button>
            <Button
              component={Link}
              to="/signup"
              color="inherit"
              className={classes.linkBtn}
            >
              <div style={{color: "#1A4F83"}}>
              Sign Up
            </div>
            </Button>
          </>
        )
      }
    } else {
      return <></>
    }
  }

  return (
    <>
      <AppBar style={{backgroundColor: "rgb(250, 250, 250)", boxShadow: "0 0 1px #1A4F83"}} position="static">
        <div style={{zIndex: "5" ,position: "fixed",top: "70px", right: "100px", width: "200px", height: "250px", backgroundColor: "white", display: isModal == "true" ? "block" : "none", borderRadius: "8px", boxShadow: "0px 0px 10px rgba(150, 150, 150, .5)"}}>
          <div style={{margin: "20px"}}>
            <div style={{display: "flex", justifyContent: "end", alignItems: "center"}}>
              <CloseIcon onClick={(e)=>{setIsModal("false")}} style={{cursor: "pointer", color: "#1A4F83"}} />
            </div>
            <div style={{marginTop: "20px"}}>
              <div style={{color: "#1A4F83"}}>name:</div>
              <input style={{border: "none", borderBottom: "1px solid #1A4F83"}} type="text" name="name" value={followName} onChange={(e) => setFollowName(e.currentTarget.value)} />
            </div>
            <div style={{marginTop: "15px"}}>
              <div style={{color: "#1A4F83"}}>mail:</div>
              <input style={{border: "none", borderBottom: "1px solid #1A4F83"}} type="text" name="mail" value={followMail} onChange={(e) => setFollowMail(e.currentTarget.value)} />
            </div>
            <div style={{display: "flex", justifyContent: "end", marginTop: "30px"}}>
              <button style={{backgroundColor: "#1A4F83", color: "white", border:"none", padding: "5px 20px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer"}} onClick={handleClick}>追加</button>

            </div>
          </div>
        </div>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.iconButton}
            style={{cursor: "pointer", color: "#1A4F83"}}
          >
          </IconButton>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            className={classes.title}
          >
          <div style={{color: "#1A4F83"}}>Calendar</div>
          </Typography>
          <PersonAddIcon onClick={() => setIsModal("true")} style={{cursor: "pointer", color: "#1A4F83"}} />
          <AuthButtons />
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header