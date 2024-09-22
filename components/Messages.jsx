"use client";
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { ChatContext } from '@/context/ChatContext';
import { useRouter } from 'next/navigation';
import { RegistrationContext } from '@/context/RegistrationContext';
import { CircularProgress } from '@mui/material';
import { SocketContext } from '@/context/SocketContext';

export default function Messages() {
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const { chatUsers, Public, favourite, setChatUsers } = React.useContext(ChatContext);
  const { name } = React.useContext(RegistrationContext);
  const {socket} = React.useContext(SocketContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const handleListItemClick = (event, index, name) => {
    setSelectedIndex(index);
    router.push("/chat/" + name);
  };

  React.useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      const response = await fetch("/api/fetchtalkeduser", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(name.userID),
        cache: "no-store"
      });
      console.log(name);
      const data = await response.json();
      setChatUsers(data.previousChats);
      setIsLoading(false);
    }
    if (name.userID != null) {
      fetchUsers();
    }
  }, [name,socket]);

  const displayList = Public ? chatUsers : favourite;

  return (
    <>
      {isLoading && (
        <div className="flex w-full justify-center">
          <CircularProgress />
        </div>
      )}
      <List sx={{ width: '100%', bg: "transparent", color: "white" }}>
        {displayList?.map((item, index) => {
          return (
            <React.Fragment key={item._id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  backgroundColor: selectedIndex === index ? '#191924' : 'transparent',
                  cursor: 'pointer'
                }}
                onClick={(event) => handleListItemClick(event, index, item._id)}
              >
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/assets/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={item.username}
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: '#A6A7AD', display: 'inline' }}
                    >
                      Click on the chat to view
                    </Typography>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          );
        })}
      </List>
    </>
  );
}
