import React from "react";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

export default function Root() {
  const drawerWidth = 150;
  return <div>
    <Drawer open={true} variant="persistent">
      <Box sx={{ width: drawerWidth }} role="presentation">
        <List>
          {['Languages', 'Words', 'Phrases'].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText>
                  <Link to={text}>{text}</Link>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
    <div style={{ marginLeft: drawerWidth }}>
      <Outlet />
    </div>
  </div>
}