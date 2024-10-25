import React from "react";
import { Box, Breadcrumbs, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Root() {
  const location = useLocation();
  const path = location.pathname === "/" ? [""] : location.pathname.split("/");
  const breadcrumbs = path.reduce<{ title: string, path: string }[]>(
    (prev, curr) =>
      [...prev, (prev.length > 0 ? { title: curr, path: `${prev[prev.length - 1].path}/${curr}` } : { title: "Home", path: curr })],
    []);

  const drawerWidth = 150;

  return <div>
    <Drawer open={true} variant="persistent">
      <Box sx={{ width: drawerWidth }} role="presentation">
        <List>
          {['Languages', 'Words', 'Phrases', 'Tags'].map((text) => (
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
    <div style={{ marginLeft: drawerWidth, marginBottom: '2em' }}>
      <Breadcrumbs>
        {breadcrumbs.map(crumb =>
          <Link to={crumb.path}>{crumb.title}</Link>
        )}
      </Breadcrumbs>
      <Outlet />
    </div>
    <div style={{
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100%',
      textAlign: 'center',
      backgroundColor: '#9cf',
      borderTop: '1px solid black',
    }}>
      áÁ éÉ íÍ óÓ úÚ üÜ ñÑ ¿ ¡
    </div>
  </div>
}