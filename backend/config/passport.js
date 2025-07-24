const passport = require('passport');
const Community = require('../models/community/community');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); // <-- your User model
const Notification = require('../models/notification/notification');
const GitHubStrategy = require('passport-github2').Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ oauthId: profile.id, oauthProvider: 'google' });

      if (existingUser) {
        console.log("User already exists:", existingUser);
        return done(null, existingUser);
      }


      // 🆕 Create a new user for first-time login via Google
      const newUser = new User({
        oauthProvider: 'google',
        oauthId: profile.id,
        email: profile.emails?.[0]?.value,
        firstName: profile.name?.givenName || '',
        lastName: profile.name?.familyName || '',
        username: profile.emails?.[0]?.value?.split('@')[0], // fallback username
        profilePicture: profile.photos?.[0]?.value || undefined,
        accountStatus: 'active'
      });
     const community = await Community.findOne();
     if(community == null){
        Community.create(
            {
              name:"DecodeByCode"
            }
        );
     }
     console.log(community);

      community.numberOfUsers += 1;
      await community.save();
      //giving notification if user is new 

      const notification = new Notification({
      recipient: newUser._id,
      type: "SYSTEM",
      message: "Welcome to DecodeByCode Community",
      link: "/profile"
    });
    await notification.save();

            
      await newUser.save();

      return done(null, newUser);
    } catch (error) {
      console.error("Google Strategy Error:", error);
      return done(error, null);
    }
  }
));
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/github/callback',
  scope: ['user:email'] // <-- ensure this
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let email = null;

    // Try to get primary email if emails array is populated
    if (profile.emails && profile.emails.length > 0) {
      email = profile.emails.find(e => e.verified)?.value || profile.emails[0].value;
    }

    // Fallback email if GitHub doesn't return any (rare)
    if (!email) {
      email = `${profile.username}@users.noreply.github.com`;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) return done(null, existingUser);

    const newUser = await User.create({
      email,
      username: profile.username,
      oauthProvider: 'github',
      oauthId: profile.id,
      profilePicture: profile.photos?.[0]?.value || ''
    });
    //giving notification if user is new 
    const notification = new Notification({
      recipient: newUser._id,
      type: "SYSTEM",
      message: "Welcome to DecodeByCode Community",
      link: "/profile/u/"+newUser.username
    });
    await notification.save();

    const community = await Community.findOne();
    console.log(community);
    community.numberOfUsers += 1;
    await community.save();




    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
}));


module.exports = passport;