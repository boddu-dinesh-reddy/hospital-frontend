import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Collapse
} from '@mui/material'
import {
  Dashboard,
  People,
  CalendarMonth,
  Receipt,
  Group,
  LocalHospital,
  ExpandLess,
  ExpandMore,
  PersonAdd,
  Event,
  Payment,
  Schedule
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [expandedItems, setExpandedItems] = React.useState({})

  const handleItemClick = (path) => {
    navigate(path)
    if (!open) onClose()
  }

  const handleExpandClick = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }))
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Dashboard />,
      path: '/',
      roles: ['Admin', 'Doctor', 'Nurse', 'Receptionist']
    },
    {
      title: 'Patients',
      icon: <People />,
      roles: ['Admin', 'Doctor', 'Nurse', 'Receptionist'],
      subItems: [
        { title: 'Patient List', path: '/patients', icon: <People /> },
        { title: 'Add Patient', path: '/patients/new', icon: <PersonAdd /> }
      ]
    },
    {
      title: 'Appointments',
      icon: <CalendarMonth />,
      roles: ['Admin', 'Doctor', 'Nurse', 'Receptionist'],
      subItems: [
        { title: 'Appointments', path: '/appointments', icon: <CalendarMonth /> },
        { title: 'Schedule', path: '/schedule', icon: <Schedule /> },
        { title: 'New Appointment', path: '/appointments/new', icon: <Event /> }
      ]
    },
    {
      title: 'Billing',
      icon: <Receipt />,
      roles: ['Admin', 'Receptionist'],
      subItems: [
        { title: 'Bills & Invoices', path: '/billing', icon: <Receipt /> },
        { title: 'Payment History', path: '/billing/payments', icon: <Payment /> }
      ]
    },
    {
      title: 'Staff Management',
      icon: <Group />,
      roles: ['Admin'],
      subItems: [
        { title: 'Staff List', path: '/staff', icon: <Group /> },
        { title: 'Add Staff', path: '/staff/new', icon: <PersonAdd /> }
      ]
    }
  ]

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  )

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const drawerWidth = open ? 240 : 60

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          overflowX: 'hidden',
          mt: 8
        },
      }}
    >
      <Box sx={{ overflow: 'auto', pt: 2 }}>
        <List>
          {filteredMenuItems.map((item, index) => (
            <React.Fragment key={item.title}>
              {item.subItems ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleExpandClick(item.title)}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.title} 
                        sx={{ opacity: open ? 1 : 0 }} 
                      />
                      {open && (expandedItems[item.title] ? <ExpandLess /> : <ExpandMore />)}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={expandedItems[item.title] && open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem key={subItem.title} disablePadding>
                          <ListItemButton
                            onClick={() => handleItemClick(subItem.path)}
                            selected={isActive(subItem.path)}
                            sx={{
                              pl: 4,
                              minHeight: 40,
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText 
                              primary={subItem.title}
                              primaryTypographyProps={{ fontSize: '0.875rem' }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleItemClick(item.path)}
                    selected={isActive(item.path)}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.title} 
                      sx={{ opacity: open ? 1 : 0 }} 
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidebar
