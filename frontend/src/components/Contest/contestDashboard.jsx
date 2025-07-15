import React, { useState, useEffect, useContext } from 'react';
import {UserContext} from '../../context/UserContext';
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
  styled,
  Tooltip
} from '@mui/material';
import { 
  AccessTime as AccessTimeIcon, 
  Person as PersonIcon, 
  CalendarToday as CalendarIcon,
  Timer as TimerIcon,
  HowToReg as RegisterIcon,
  Lock as LockIcon,
  EmojiEvents as TrophyIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { formatDistanceToNow, format } from 'date-fns';
import { getAllGlobalContests } from '../Tasks/getAllGlobalContests';

// Styled components with theme-aware colors
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.primary.main
  }
}));

const StatusBadge = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  ...(status === 'upcoming' && {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)',
    color: theme.palette.mode === 'dark' ? theme.palette.warning.light : theme.palette.warning.dark
  }),
  ...(status === 'current' && {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
    color: theme.palette.mode === 'dark' ? theme.palette.success.light : theme.palette.success.dark
  }),
  ...(status === 'past' && {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(158, 158, 158, 0.2)' : 'rgba(158, 158, 158, 0.1)',
    color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[700]
  })
}));

const ContestDashboard = () => {
  const {user} = useContext(UserContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(Number(localStorage.getItem('contestTabValue')) || 0);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [currentContests, setCurrentContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const theme = useTheme();

  const getTimeRemaining = (targetDate) => {
    return formatDistanceToNow(new Date(targetDate), { addSuffix: true });
  };

  const formatContestDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy - h:mm a');
  };

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const data = await getAllGlobalContests();
        const now = new Date();
        
        const upcoming = data.filter(c => new Date(c.startTime) > now)
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        const current = data.filter(c => new Date(c.startTime) <= now && new Date(c.endTime) > now)
          .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        const past = data.filter(c => new Date(c.endTime) <= now)
          .sort((a, b) => new Date(b.endTime) - new Date(a.endTime));
        
        setUpcomingContests(upcoming);
        setCurrentContests(current);
        setPastContests(past);
        setContests(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch contests');
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
    
    return () => {
      localStorage.removeItem('contestTabValue');
    };
  }, []);

  const handleRegister = async (contestId) => {
    try {
      // Get actual userId (from localStorage, Context, etc.)
      const userId = user._id;
      // if (!userId) {
      //   console.error("User not logged in.");
      //   return;
      // }
      const response = await fetch(`http://localhost:3000/contests/${contestId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // include cookies if needed
        body: JSON.stringify({ userId }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed on the server');
      }
  
      // Update local state optimistically
      const updateParticipants = (prev) =>
        prev.map(c =>
          c._id === contestId && !c.Participants.includes(userId)
            ? { ...c, Participants: [...c.Participants, userId] }
            : c
        );
  
      setContests(updateParticipants);
      setUpcomingContests(updateParticipants);
      setCurrentContests(updateParticipants);
      window.location.reload(); // Reload to reflect changes in the UI
    } catch (err) {
      console.error('Registration failed:', err.message);
    }
  };
  

  const handleTabChange = (event, newValue) => {
    localStorage.setItem('contestTabValue', newValue);
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          mb: 6, 
          fontWeight: 700, 
          color: 'text.primary',
          textAlign: 'center',
          fontSize: { xs: '2rem', md: '2.5rem' },
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(45deg, #ff9800, #ab47bc)' 
            : 'linear-gradient(45deg, #7b1fa2, #4527a0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Coding Contests
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ 
          mb: 4,
          '& .MuiTabs-indicator': {
            height: 4,
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.primary.main
          }
        }}
      >
        <Tab 
          label="Upcoming" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1rem',
            '&.Mui-selected': { 
              color: theme.palette.mode === 'dark' ? theme.palette.warning.light : theme.palette.primary.dark 
            }
          }} 
        />
        <Tab 
          label="Ongoing" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1rem',
            '&.Mui-selected': { 
              color: theme.palette.mode === 'dark' ? theme.palette.success.light : theme.palette.primary.dark 
            }
          }} 
        />
        <Tab 
          label="Past" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1rem',
            '&.Mui-selected': { 
              color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.primary.dark 
            }
          }} 
        />
      </Tabs>

      <Box sx={{ minHeight: '60vh' }}>
        {tabValue === 0 && (
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                fontWeight: 600,
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <AccessTimeIcon fontSize="medium" />
              Upcoming Contests
            </Typography>
            {upcomingContests.length === 0 ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  py: 10,
                  color: 'text.disabled',
                  border: `1px dashed ${theme.palette.divider}`,
                  borderRadius: 2
                }}
              >
                <CalendarIcon sx={{ fontSize: 60, mb: 2, color: theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(156, 39, 176, 0.3)' }} />
                <Typography variant="h6">No upcoming contests scheduled</Typography>
                <Typography variant="body1">Check back later for new contests</Typography>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
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
                    formatDate={formatContestDate}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                fontWeight: 600,
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TimerIcon fontSize="medium" />
              Ongoing Contests
            </Typography>
            {currentContests.length === 0 ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  py: 10,
                  color: 'text.disabled',
                  border: `1px dashed ${theme.palette.divider}`,
                  borderRadius: 2
                }}
              >
                <TimerIcon sx={{ fontSize: 60, mb: 2, color: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(56, 142, 60, 0.3)' }} />
                <Typography variant="h6">No contests running currently</Typography>
                <Typography variant="body1">Check upcoming contests to participate</Typography>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
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
                    formatDate={formatContestDate}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                fontWeight: 600,
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TrophyIcon fontSize="medium" />
              Past Contests
            </Typography>
            {pastContests.length === 0 ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  py: 10,
                  color: 'text.disabled',
                  border: `1px dashed ${theme.palette.divider}`,
                  borderRadius: 2
                }}
              >
                <TrophyIcon sx={{ fontSize: 60, mb: 2, color: theme.palette.mode === 'dark' ? 'rgba(189, 189, 189, 0.3)' : 'rgba(117, 117, 117, 0.3)' }} />
                <Typography variant="h6">No past contests available</Typography>
                <Typography variant="body1">Participate in upcoming contests to see them here</Typography>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
                  gap: 3 
                }}
              >
                {pastContests.map((contest) => (
                  <ContestCard
                    key={contest._id}
                    contest={contest}
                    status="past"
                    getTimeRemaining={getTimeRemaining}
                    formatDate={formatContestDate}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const ContestCard = ({ contest, status, onRegister, getTimeRemaining, formatDate }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const {user} = useContext(UserContext); // Get user from context or default to empty object
  // In a real app, you would check against the actual logged-in user
  const [isRegistered, setIsRegistered] = useState(
    contest.Participants.includes(user._id || '')
  );

  const handleRegisterClick = (e) => {
    e.stopPropagation();
    onRegister(contest._id);
    setIsRegistered(true);
  };

  const handleCardClick = () => {
    window.location.href = `/contests/${contest._id}`;
  };

  const getStatusIcon = () => {
    switch(status) {
      case 'current': return <TimerIcon fontSize="small" />;
      case 'upcoming': return <AccessTimeIcon fontSize="small" />;
      case 'past': return <TrophyIcon fontSize="small" />;
      default: return null;
    }
  };

  const getStatusLabel = () => {
    switch(status) {
      case 'current': return 'Live Now';
      case 'upcoming': return 'Upcoming';
      case 'past': return 'Completed';
      default: return '';
    }
  };

  return (
    <StyledCard 
      elevation={isHovered ? 6 : 2}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <StatusBadge 
            status={status}
            label={getStatusLabel()}
            size="small"
            icon={getStatusIcon()}
          />
          
          {contest.isPrivate && (
            <Chip 
              label="Private" 
              size="small"
              icon={<LockIcon fontSize="small" />}
              sx={{ 
                ml: 1,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(171, 71, 188, 0.2)' 
                  : 'rgba(156, 39, 176, 0.1)',
                color: theme.palette.mode === 'dark' 
                  ? theme.palette.secondary.light 
                  : theme.palette.primary.dark
              }}
            />
          )}
        </Box>

        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            color: theme.palette.mode === 'dark' 
              ? theme.palette.secondary.light 
              : theme.palette.primary.dark,
            minHeight: '3rem'
          }}
        >
          {contest.title}
        </Typography>

        <Box display="flex" alignItems="center" mb={2} sx={{ color: 'text.secondary' }}>
          <PersonIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            component="a"
            href={`/profile/user/${contest.creator.username}`}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: theme.palette.mode === 'dark' 
                  ? theme.palette.secondary.light 
                  : theme.palette.primary.main,
                textDecoration: 'underline'
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            By {contest.creator.username}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mb={2}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 500 }}>
              Starts
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {formatDate(contest.startTime)}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 500 }}>
              Ends
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {formatDate(contest.endTime)}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.disabled' }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Duration: {contest.duration}
          </Typography>
        </Box>

        {status !== 'past' && (
          <Box display="flex" alignItems="center" mb={3}>
            <TimerIcon 
              fontSize="small" 
              sx={{ 
                mr: 1, 
                color: status === 'current' 
                  ? (theme.palette.mode === 'dark' ? theme.palette.success.light : theme.palette.success.dark)
                  : (theme.palette.mode === 'dark' ? theme.palette.warning.light : theme.palette.warning.dark)
              }} 
            />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: status === 'current' 
                  ? (theme.palette.mode === 'dark' ? theme.palette.success.light : theme.palette.success.dark)
                  : (theme.palette.mode === 'dark' ? theme.palette.warning.light : theme.palette.warning.dark)
              }}
            >
              {status === 'current'
                ? `Ends ${getTimeRemaining(contest.endTime)}`
                : `Starts ${getTimeRemaining(contest.startTime)}`}
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center" pt={1} mt="auto">
          <Chip
            label={`${contest.Participants.length} ${contest.Participants.length === 1 ? 'Participant' : 'Participants'}`}
            variant="outlined"
            size="small"
            avatar={
              <Avatar sx={{ 
                width: 24, 
                height: 24,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(171, 71, 188, 0.2)' 
                  : 'rgba(156, 39, 176, 0.1)',
                color: theme.palette.mode === 'dark' 
                  ? theme.palette.secondary.light 
                  : theme.palette.primary.dark
              }}>
                {contest.Participants.length}
              </Avatar>
            }
            sx={{ 
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)',
              borderColor: theme.palette.divider
            }}
          />

          <Box display="flex" gap={1} onClick={(e) => e.stopPropagation()}>
            {/* Upcoming Contests: Only register button */}
            {status === 'upcoming' && contest.registrationOpen && !isRegistered && (
              <Button
                variant="contained"
                size="small"
                startIcon={<RegisterIcon />}
                onClick={handleRegisterClick}
                sx={{
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? theme.palette.secondary.dark 
                    : theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? theme.palette.secondary.main 
                      : theme.palette.primary.dark
                  }
                }}
              >
                Register
              </Button>
            )}
            
            {status === 'upcoming' && isRegistered && (
              <Tooltip title="You are registered for this contest" arrow>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CheckCircleIcon />}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 2,
                    borderColor: theme.palette.mode === 'dark' 
                      ? theme.palette.success.light 
                      : theme.palette.success.dark,
                    color: theme.palette.mode === 'dark' 
                      ? theme.palette.success.light 
                      : theme.palette.success.dark,
                    '&:hover': {
                      borderColor: theme.palette.mode === 'dark' 
                        ? theme.palette.success.light 
                        : theme.palette.success.dark,
                    }
                  }}
                >
                  Registered
                </Button>
              </Tooltip>
            )}
            
            {/* Ongoing Contests: Both register and enter buttons */}
            {status === 'current' && (
              <>
                {!isRegistered && contest.registrationOpen && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<RegisterIcon />}
                    onClick={handleRegisterClick}
                    sx={{
                      fontWeight: 600,
                      textTransform: 'none',
                      px: 2,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? theme.palette.secondary.dark 
                        : theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? theme.palette.secondary.main 
                          : theme.palette.primary.dark
                      }
                    }}
                  >
                    Register
                  </Button>
                )}
                
                {isRegistered && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    sx={{
                      fontWeight: 600,
                      textTransform: 'none',
                      px: 2,
                      borderColor: theme.palette.mode === 'dark' 
                        ? theme.palette.success.light 
                        : theme.palette.success.dark,
                      color: theme.palette.mode === 'dark' 
                        ? theme.palette.success.light 
                        : theme.palette.success.dark,
                      '&:hover': {
                        borderColor: theme.palette.mode === 'dark' 
                          ? theme.palette.success.light 
                          : theme.palette.success.dark,
                      }
                    }}
                  >
                    Registered
                  </Button>
                )}
                
                <Button
                  variant="contained"
                  size="small"
                  href={`/contests/${contest._id}`}
                  disabled={!isRegistered}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 2,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? theme.palette.primary.dark 
                      : theme.palette.primary.main,
                    '&:disabled': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(66, 66, 66, 0.5)' 
                        : 'rgba(189, 189, 189, 0.5)',
                      color: theme.palette.text.disabled
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? theme.palette.primary.main 
                        : theme.palette.primary.dark
                    }
                  }}
                >
                  Enter
                </Button>
              </>
            )}
            
            {/* Past Contests: Only enter button */}
            {status === 'past' && (
              <Button
                variant="contained"
                size="small"
                href={`/contests/${contest._id}`}
                sx={{
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? theme.palette.grey[700] 
                    : theme.palette.grey[500],
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? theme.palette.grey[600] 
                      : theme.palette.grey[600]
                  }
                }}
              >
                Enter
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ContestDashboard;