import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  Avatar,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Box,
  useTheme,
  ThemeProvider,
  createTheme,
  Skeleton
} from '@mui/material';
import { 
  AccessTime as AccessTimeIcon, 
  Person as PersonIcon, 
  CalendarToday as CalendarIcon,
  Timer as TimerIcon,
  HowToReg as RegisterIcon,
  Lock as LockIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { getAllGlobalContests } from '../Tasks/getAllGlobalContests';

// Theme creation
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light theme
          primary: {
            main: '#7b1fa2', // Violet
          },
          secondary: {
            main: '#ff9800', // Orange
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: {
            primary: '#212121',
            secondary: '#4a4a4a',
          },
        }
      : {
          // Dark theme
          primary: {
            main: '#ab47bc', // Lighter violet
          },
          secondary: {
            main: '#ffb74d', // Light orange
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#e0e0e0',
            secondary: '#b0b0b0',
          },
        }),
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

const ContestDashboard = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [currentContests, setCurrentContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  
  // Get theme mode from localStorage or default to 'light'
  const themeMode = localStorage.getItem('themeMode') || 'light';
  const theme = useMemo(() => createTheme(getDesignTokens(themeMode)), [themeMode]);

  const formatDuration = (durationObj) => {
    const parts = [];
    if (durationObj.days > 0) parts.push(`${durationObj.days}d`);
    if (durationObj.hours > 0) parts.push(`${durationObj.hours}h`);
    if (durationObj.minutes > 0) parts.push(`${durationObj.minutes}m`);
    return parts.join(' ') || '0m';
  };

  const getTimeRemaining = (targetDate) => {
    return formatDistanceToNow(new Date(targetDate), { addSuffix: true });
  };

  useEffect(() => {
    const fetchContests = async () => {
      try {
        // Check localStorage first
        const cachedContests = localStorage.getItem('cachedContests');
        const cacheTime = localStorage.getItem('contestsCacheTime');
        
        // Use cache if less than 5 minutes old
        if (cachedContests && cacheTime && Date.now() - parseInt(cacheTime) < 300000) {
          const data = JSON.parse(cachedContests);
          processContests(data);
          setLoading(false);
          return;
        }

        // Fetch fresh data
        const data = await getAllGlobalContests();
        localStorage.setItem('cachedContests', JSON.stringify(data));
        localStorage.setItem('contestsCacheTime', Date.now().toString());
        processContests(data);
      } catch (err) {
        setError(err.message || 'Failed to load contests');
      } finally {
        setLoading(false);
      }
    };

    const processContests = (data) => {
      const now = new Date();
      setContests(data);
      setUpcomingContests(
        data.filter(c => new Date(c.startTime) > now)
      );
      setCurrentContests(
        data.filter(c => new Date(c.startTime) <= now && new Date(c.endTime) > now)
      );
      setPastContests(
        data.filter(c => new Date(c.endTime) <= now)
      );
    };

    fetchContests();
  }, []);

  const handleRegister = async (contestId) => {
    try {
      // In a real app, this would be an actual API call
      console.log(`Registering for contest ${contestId}`);
      
      // Update local storage to reflect registration
      const updatedContests = contests.map(c => 
        c._id === contestId 
          ? { ...c, Participants: [...c.Participants, 'current-user'] } 
          : c
      );
      
      localStorage.setItem('cachedContests', JSON.stringify(updatedContests));
      setContests(updatedContests);
      
      // Re-process contests
      const now = new Date();
      setUpcomingContests(updatedContests.filter(c => new Date(c.startTime) > now));
      setCurrentContests(updatedContests.filter(c => new Date(c.startTime) <= now && new Date(c.endTime) > now));
      setPastContests(updatedContests.filter(c => new Date(c.endTime) <= now));
      
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          backgroundColor: 'background.default', 
          minHeight: '100vh',
          py: 4,
          px: { xs: 2, sm: 4 }
        }}
      >
        <Box maxWidth="1200px" mx="auto">
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              textAlign: 'center', 
              mb: 4, 
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.8rem', sm: '2.2rem' }
            }}
          >
            Contest Dashboard
          </Typography>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              mb: 4,
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
                height: 3,
              }
            }}
          >
            <Tab label="Upcoming" sx={{ fontWeight: 600 }} />
            <Tab label="Current" sx={{ fontWeight: 600 }} />
            <Tab label="Past" sx={{ fontWeight: 600 }} />
          </Tabs>

          <Box sx={{ mb: 4 }}>
            {tabValue === 0 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                  Upcoming Contests
                </Typography>
                {upcomingContests.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                    <Typography>No upcoming contests found</Typography>
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
                      gap: 3 
                    }}
                  >
                    {upcomingContests.map((contest) => (
                      <ContestCard
                        key={contest._id}
                        contest={contest}
                        status="upcoming"
                        onRegister={handleRegister}
                        getTimeRemaining={getTimeRemaining}
                        formatDuration={formatDuration}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                  Current Contests
                </Typography>
                {currentContests.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                    <Typography>No current contests running</Typography>
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
                      gap: 3 
                    }}
                  >
                    {currentContests.map((contest) => (
                      <ContestCard
                        key={contest._id}
                        contest={contest}
                        status="current"
                        onRegister={handleRegister}
                        getTimeRemaining={getTimeRemaining}
                        formatDuration={formatDuration}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                  Past Contests
                </Typography>
                {pastContests.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                    <Typography>No past contests available</Typography>
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
                      gap: 3 
                    }}
                  >
                    {pastContests.map((contest) => (
                      <ContestCard
                        key={contest._id}
                        contest={contest}
                        status="past"
                        getTimeRemaining={getTimeRemaining}
                        formatDuration={formatDuration}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const ContestCard = ({ contest, status, onRegister, getTimeRemaining, formatDuration }) => {
  const theme = useTheme();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate current user from localStorage
    const currentUser = localStorage.getItem('currentUser') || 'current-user';
    setIsRegistered(contest.Participants.includes(currentUser));
    setLoading(false);
  }, [contest.Participants]);

  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return (
          <Chip
            label="Upcoming" 
            color="warning" 
            size="small"
            icon={<AccessTimeIcon fontSize="small" />}
            sx={{ mb: 1 }}
          />
        );
      case 'current':
        return (
          <Chip
            label="Live Now"
            color="success"
            size="small"
            icon={<TimerIcon fontSize="small" />}
            sx={{ mb: 1 }}
          />
        );
      case 'past':
        return (
          <Chip
            label="Completed"
            color="default"
            size="small"
            sx={{ mb: 1 }}
          />
        );
      default:
        return null;
    }
  };

  const renderButtons = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rounded" width={90} height={36} />
          <Skeleton variant="rounded" width={70} height={36} />
        </Box>
      );
    }
    
    switch (status) {
      case 'upcoming':
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {contest.registrationOpen && !isRegistered ? (
              <Button
                variant="contained"
                size="small"
                startIcon={<RegisterIcon />}
                onClick={() => onRegister(contest._id)}
                sx={{ flexShrink: 0 }}
              >
                Register
              </Button>
            ) : isRegistered ? (
              <Chip
                label="Registered"
                color="success"
                size="small"
                variant="outlined"
                sx={{ height: '100%' }}
              />
            ) : null}
          </Box>
        );
      
      case 'current':
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {contest.registrationOpen && !isRegistered && (
              <Button
                variant="contained"
                size="small"
                startIcon={<RegisterIcon />}
                onClick={() => onRegister(contest._id)}
                sx={{ flexShrink: 0 }}
              >
                Register
              </Button>
            )}
            {isRegistered && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                href={`/contests/${contest._id}`}
                startIcon={<LaunchIcon />}
              >
                Enter
              </Button>
            )}
          </Box>
        );
      
      case 'past':
        return (
          <Button
            variant="outlined"
            size="small"
            href={`/contests/${contest._id}`}
            startIcon={<LaunchIcon />}
            sx={{ 
              borderColor: theme.palette.mode === 'light' ? '#7b1fa2' : '#ffb74d',
              color: theme.palette.mode === 'light' ? '#7b1fa2' : '#ffb74d'
            }}
          >
            View
          </Button>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        border: theme.palette.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {getStatusBadge()}
          {contest.isPrivate && (
            <Chip 
              label="Private" 
              color="secondary" 
              size="small"
              icon={<LockIcon fontSize="small" />}
              sx={{ mb: 1 }}
            />
          )}
        </Box>

        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 700, 
            mb: 1.5,
            color: 'text.primary',
            minHeight: '3.5rem'
          }}
        >
          {contest.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
          <PersonIcon fontSize="small" />
          <Typography
            variant="body2"
            component="a"
            href={`/profile/user/${contest.creator.username}`}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline',
                cursor: 'pointer'
              },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {contest.creator.username}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', mt: '2px' }} />
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Starts
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                {new Date(contest.startTime).toLocaleString([], { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', mt: '2px' }} />
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Ends
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                {new Date(contest.endTime).toLocaleString([], { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>Duration: </Typography> 
            {formatDuration(contest.duration)}
          </Typography>
        </Box>

        {status !== 'past' && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 2,
            p: 1,
            borderRadius: 1,
            backgroundColor: status === 'current' ? 
              theme.palette.mode === 'light' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.2)' :
              theme.palette.mode === 'light' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.2)'
          }}>
            <TimerIcon fontSize="small" sx={{ 
              color: status === 'current' ? 'success.main' : 'warning.main' 
            }} />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500,
                color: status === 'current' ? 'success.main' : 'warning.main'
              }}
            >
              {status === 'current'
                ? `Ends ${getTimeRemaining(contest.endTime)}`
                : `Starts ${getTimeRemaining(contest.startTime)}`}
            </Typography>
          </Box>
        )}

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 'auto', 
          pt: 2 
        }}>
          <Chip
            label={`${contest.Participants.length} Participants`}
            variant="outlined"
            size="small"
            avatar={
              <Avatar sx={{ 
                width: 24, 
                height: 24,
                backgroundColor: theme.palette.mode === 'light' ? '#e0d8f0' : '#3a2b45',
                color: 'text.primary'
              }}>
                {contest.Participants.length}
              </Avatar>
            }
            sx={{
              borderColor: theme.palette.mode === 'light' ? '#e0d8f0' : '#3a2b45',
              backgroundColor: theme.palette.mode === 'light' ? '#f5f2fa' : '#2a1e35',
              color: 'text.secondary'
            }}
          />
          
          {renderButtons()}
        </Box> 
      </CardContent>
    </Card>
  );
};

export default ContestDashboard;