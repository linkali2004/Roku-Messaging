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

export default function GroupChatInboxContainer({groups}) {
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const router = useRouter();

  const handleListItemClick = (event, index, ids) => {
    setSelectedIndex(index);
    router.push("/groupchat/" + ids.toString().trim());
  };



  return (
    <>
      <List sx={{ width: '100%', bg: "transparent", color: "white" }}>
        {groups?.map((item, index) => {
          return (
            <React.Fragment key={item._id}> 
              <ListItem
                alignItems="flex-start"
                sx={{
                  backgroundColor: selectedIndex === index ? '#191924' : 'transparent',
                  cursor: 'pointer'
                }}
                onClick={(event) => handleListItemClick(event, index, item.participants)}
              >
                <ListItemText
                  primary={`Chat Group ${index+1}:`}
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: '#A6A7AD', display: 'inline' }}
                    >
                      Click on it to view
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
