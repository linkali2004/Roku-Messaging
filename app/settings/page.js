"use client";
import { OverallContext } from '@/context/OverallContext';
import { RegistrationContext } from '@/context/RegistrationContext';
import { Avatar, CircularProgress, TextField, Button } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

export default function Page() {
  const [userInfo, setUserInfo] = useState(null);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: ""
  });
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const[isUpdating,setIsUpdating] = useState(false);
  const {name} = useContext(RegistrationContext);
  const {setSnackOpen,setSnackbarMsg} = useContext(OverallContext);
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64String = reader.result;
      setIsUploading(true);

      try {
        const response = await fetch("/api/uploadavatar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ file: base64String })
        });

        const data = await response.json();
        if (data.success) {
          setAvatarUrl(data.url);
          setSnackbarMsg(data.message);
          setSnackOpen(true);
        } else {
          console.error("Upload failed", data.message);
        }
        setIsUploading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        setIsUploading(false);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setIsUploading(false);
    };
  };
  useEffect(() => {
    async function fetchUserInfo() {
      const response = await fetch("/api/getuser", { method: "GET" });
      const data = await response.json();
      setUserInfo(data.data);
      setAvatarUrl(data.data.avatar);
      setUserData(data.data)
    }
    fetchUserInfo();
  }, []);
  async function updateHandler() {
    setIsUpdating(true);
    setUserData((prev) => {
      let endResult = { ...prev }
      if (prev.username == "") {
        endResult = { ...endResult, username: userInfo.username }
      }
      if (prev.password == "") {
        endResult = { ...endResult, password: userInfo.password }
      }
      if (prev.email == "") {
        endResult = { ...endResult, email: userInfo.email }
      }
      if (prev.avatar == "") {
        endResult = { ...endResult, avatar: userInfo.avatar }
      }
      endResult = { ...endResult, avatar: avatarUrl,id:name.userID }
      return endResult;
    });

    const response = await fetch("/api/getuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData),
      cache: "no-store"
    })
    const data= await response.json();
    setIsUpdating(false);
    setSnackOpen(true);
    setSnackbarMsg(data.message);
  }


  return (
    <div className='flex flex-col w-full h-full gap-2 items-center p-4'>
      <p className='text-2xl font-semibold text-white'>Change Your Personal Information</p>
      <div className='flex flex-col gap-3 items-center w-full p-4'>
        {userInfo == null ? <CircularProgress /> : (
          Object.keys(userInfo).map((item, index) => {
            if (item !== "_id" && item !== "password" && item!="avatar") {
              return (
                <div className="w-full" key={index}>
                  <p className='text-xl font-medium text-gray-500 text-capitalize text-center'>{item}</p>
                  <TextField
                    size="small"
                    fullWidth
                    value={userData[item]}
                    onChange={(e) => setUserData((prev) => ({ ...prev, [item]: e.target.value }))}
                    sx={{
                      background: "#1F1F28",
                      marginTop: "5px",
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: '#A6A7AD',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A6A7AD',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                        borderRadius: "24px"
                      },
                    }}
                  />
                </div>
              );
            } else if (item === "password" && item!="avatar") {
              return (
                <div className="w-full" key={index}>
                  <p className='text-xl font-medium text-gray-500 text-center'>Password</p>
                  <TextField
                    size="small"
                    fullWidth
                    type="password"
                    value={userData.password}
                    onChange={(e) => setUserData((prev) => ({ ...prev, password: e.target.value }))}
                    sx={{
                      background: "#1F1F28",
                      marginTop: "5px",
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: '#A6A7AD',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A6A7AD',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                        borderRadius: "24px"
                      },
                    }}
                  />
                </div>
              );
            }
          })
        )}
        <div className="flex flex-col items-center gap-3">
          <p className='text-xl font-medium text-gray-200 text-center'>Upload Profile Picture</p>
          {userInfo == null ? <CircularProgress /> : (
            <>
            <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload">
            <Button
              variant="contained"
              component="span"
              sx={{ marginTop: "10px", backgroundColor: "black" }}
            >
              Upload Image
            </Button>
          </label>

          {avatarUrl ? (
          <Avatar src={avatarUrl} sx={{ width: 100, height: 100, marginTop: "20px" }} />
        ) : (
          <Avatar size="large">M</Avatar>
        )}

          {isUploading && <CircularProgress />}
            </>
          )}
          
        </div>


      </div>
     {userInfo != null ? (isUpdating == true ?<CircularProgress></CircularProgress> : <Button variant="contained" sx={{ backgroundColor: "black" }} onClick={updateHandler} disabled={userData.username == userInfo.username && userData.avatar == userInfo.avatar && userData.email==userInfo.email && userInfo.password == userData.password}>Update Details</Button>):<div></div>}
    </div>
  );
}
