import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import { 
  AccessTime as AccessTimeIcon, 
  Person as PersonIcon, 
  CalendarToday as CalendarIcon,
  Timer as TimerIcon,
  HowToReg as RegisterIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { formatDistanceToNow} from 'date-fns';
import { getAllGlobalContests } from '../Tasks/getAllGlobalContests';


const ContestDashboard = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [currentContests, setCurrentContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);

  // Fixed duration formatter
  // const formatDuration = (durationObj) => {
  //   const parts = [];
  //   if (durationObj.days > 0) parts.push(`${durationObj.days}d`);
  //   if (durationObj.hours > 0) parts.push(`${durationObj.hours}h`);
  //   if (durationObj.minutes > 0) parts.push(`${durationObj.minutes}m`);
  //   return parts.join(' ') || '0m';
  // };


  const getTimeRemaining = (targetDate) => {
    return formatDistanceToNow(new Date(targetDate), { addSuffix: true });
  };

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const data = await getAllGlobalContests();
        const now = new Date();
        setUpcomingContests(
          data.filter(c => new Date(c.startTime) > now)
        );
        setCurrentContests(
          data.filter(c => new Date(c.startTime) <= now && new Date(c.endTime) > now)
        );
        setPastContests(
          data.filter(c => new Date(c.endTime) <= now)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [setContests, setUpcomingContests, setCurrentContests, setPastContests, setError, setLoading]);
  const handleRegister = async (contestId) => {
    console.log('Registering for contest:', contestId);
    await fetch(`http://localhost:3000/contests/${contestId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session management
    })
    window.location.reload(); // Reload to reflect registration changes
  }
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h3" component="h1" className="text-center mb-8 font-bold text-gray-800">
        Contest Dashboard
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        className="mb-6"
      >
        <Tab label="Upcoming" />
        <Tab label="Current" />
        <Tab label="Past" />
      </Tabs>

      <div className="space-y-6">
        {tabValue === 0 && (
          <div>
            <Typography variant="h5" className="mb-4 font-semibold text-gray-700">
              Upcoming Contests
            </Typography>
            {upcomingContests.length === 0 ? (
              <Typography className="text-center text-gray-500">
                No upcoming contests found
              </Typography>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingContests.map((contest) => (
                  <ContestCard
                    key={contest._id}
                    contest={contest}
                    status="upcoming"
                    onRegister={handleRegister}
                    getTimeRemaining={getTimeRemaining}
                    getContestDuration={contest.duration}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {tabValue === 1 && (
          <div>
            <Typography variant="h5" className="mb-4 font-semibold text-gray-700">
              Current Contests
            </Typography>
            {currentContests.length === 0 ? (
              <Typography className="text-center text-gray-500">
                No current contests running
              </Typography>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentContests.map((contest) => (
                  <ContestCard
                    key={contest._id}
                    contest={contest}
                    status="current"
                    onRegister={handleRegister}
                    getTimeRemaining={getTimeRemaining}
                    getContestDuration={contest.duration}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {tabValue === 2 && (
          <div>
            <Typography variant="h5" className="mb-4 font-semibold text-gray-700">
              Past Contests
            </Typography>
            {pastContests.length === 0 ? (
              <Typography className="text-center text-gray-500">
                No past contests available
              </Typography>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastContests.map((contest) => (
                  <ContestCard
                    key={contest._id}
                    contest={contest}
                    status="past"
                    getTimeRemaining={getTimeRemaining}
                    getContestDuration={contest.duration}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ContestCard = ({ contest, status, onRegister, getTimeRemaining}) => {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    setIsRegistered(contest.Participants.includes('current-user'));
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
            className="mb-2"
          />
        );
      case 'current':
        return (
          <Chip
            label="Live Now"
            color="success"
            size="small"
            icon={<TimerIcon fontSize="small" />}
            className="mb-2"
          />
        );
      case 'past':
        return (
          <Chip
            label="Completed"
            color="default"
            size="small"
            className="mb-2"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="space-y-3">
        <div className="flex justify-between items-start">
          {getStatusBadge()}
          {contest.isPrivate && (
            <Chip 
              label="Private" 
              color="secondary" 
              size="small"
              icon={<LockIcon fontSize="small" />}
              className="mb-2"
            />
          )}
        </div>

        <Typography variant="h5" component="h2" className="font-bold">
          {contest.title}
        </Typography>

        <div className="flex items-center space-x-2 text-gray-600">
          <PersonIcon fontSize="small" />
          <Typography
            variant="body2"
            component="a"
            href={`/profile/user/${contest.creator.username}`}
            className="hover:text-blue-600 hover:underline cursor-pointer"
          >
            {contest.creator.username}
          </Typography>
        </div>

        <Divider className="my-2" />

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <CalendarIcon fontSize="small" className="text-gray-500" />
            <div>
              <Typography variant="caption" className="text-gray-500">
                Starts
              </Typography>
              <Typography variant="body2">
                {new Date(contest.startTime).toLocaleString()}
              </Typography>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <CalendarIcon fontSize="small" className="text-gray-500" />
            <div>
              <Typography variant="caption" className="text-gray-500">
                Ends
              </Typography>
              <Typography variant="body2">
              {new Date(contest.startTime).toLocaleString()}
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <AccessTimeIcon fontSize="small" className="text-gray-500" />
          <Typography variant="body2">
            Duration: {contest.duration}
          </Typography>
        </div>

        {status !== 'past' && (
          <div className="flex items-center space-x-2">
            <TimerIcon fontSize="small" className="text-gray-500" />
            <Typography variant="body2" className={status === 'current' ? 'text-green-600' : 'text-amber-600'}>
              {status === 'current'
                ? `Ends ${getTimeRemaining(contest.endTime)}`
                : `Starts ${getTimeRemaining(contest.startTime)}`}
            </Typography>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <Chip
            label={`${contest.Participants.length} Participants`}
            variant="outlined"
            size="small"
            avatar={<Avatar>{contest.Participants.length}</Avatar>}
          />

          {status !== 'past' && (
            <div className="space-x-2">
              {contest.registrationOpen && !isRegistered && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<RegisterIcon />}
                  onClick={() => onRegister(contest._id)}
                  // disabled={status === 'current'}
                >
                  Register
                </Button>
              )}
              {isRegistered && (
                <Chip
                  label="Registered"
                  color="success"
                  size="small"
                  variant="outlined"
                />
              )}
              <Button
                variant="outlined"
                size="small"
                href={`/contests/${contest._id}`}
              >
                {status === 'current' ? 'Enter' : 'View'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContestDashboard;