import { Redirect, Route, useLocation } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { albums, helpBuoy, ribbon } from 'ionicons/icons';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import Slider from './pages/Slider';
import Login from './pages/Login';
// import FinanceCards from './pages/FinanceCards';
import Flashcards from './pages/FinanceCards'; // Import the new Flashcards component
import UnderConstruction from './pages/UnderConstruction';
import Profile from './pages/Profile';
import { useEffect } from 'react';
import seedFirestore from './seedFirestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import QuizList from './pages/QuizList';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AppContent />
    </IonReactRouter>
  </IonApp>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const showTabs = !['/slider', '/login', '/categories', '/profile'].includes(location.pathname);

  useEffect(() => {
    const auth = getAuth();

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(`User ${user.email} is currently authenticated.`);
      } else {
        console.log('No user is currently authenticated.');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {showTabs ? (
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home" component={Home} />
            
            <Route exact path="/progress" component={Progress} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/quiz" component={QuizList} />
            <Route exact path="/quiz/:quizId" component={Quiz} />
          
            <Route exact path="/flashcards/:categoryName" component={Flashcards} /> {/* New Route for Flashcards */}
            {/* <Route exact path="/finance-cards" component={FinanceCards} /> */}
            <Route exact path="/">
              <Redirect to="/slider" />
            </Route>
            <Route path="/categories" component={UnderConstruction} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon aria-hidden="true" icon={albums} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="quiz" href="/quiz">
              <IonIcon aria-hidden="true" icon={helpBuoy} />
              <IonLabel>Quiz</IonLabel>
            </IonTabButton>
            <IonTabButton tab="progress" href="/progress">
              <IonIcon aria-hidden="true" icon={ribbon} />
              <IonLabel>Progress</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      ) : (
        <IonRouterOutlet>
          <Route exact path="/slider" component={Slider} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/">
            <Redirect to="/slider" />
          </Route>
          <Route path="/categories" component={UnderConstruction} />
        </IonRouterOutlet>
      )}
    </>
  );
};

export default App;


// import { Redirect, Route, useLocation } from 'react-router-dom';
// import {
//   IonApp,
//   IonIcon,
//   IonLabel,
//   IonRouterOutlet,
//   IonTabBar,
//   IonTabButton,
//   IonTabs,
//   setupIonicReact
// } from '@ionic/react';
// import { IonReactRouter } from '@ionic/react-router';
// import { albums, helpBuoy, ribbon } from 'ionicons/icons';
// import Home from './pages/Home';
// import Quiz from './pages/Quiz';
// import Progress from './pages/Progress';
// import Slider from './pages/Slider';
// import Login from './pages/Login';
// import FinanceCards from './pages/FinanceCards';
// import UnderConstruction from './pages/UnderConstruction';
// import Profile from './pages/Profile';
// import { useEffect } from 'react';
// import seedFirestore from './seedFirestore';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';


// setupIonicReact();

// const App: React.FC = () => (

//   <IonApp>
//     <IonReactRouter>
//       <AppContent />
//     </IonReactRouter>
//   </IonApp>
// );

// const AppContent: React.FC = () => {
//   const location = useLocation();
//   const showTabs = !['/slider', '/login', '/categories'].includes(location.pathname);

  
//   useEffect(() => {
//     const auth = getAuth();

//     // Listen for authentication state changes
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         // User is signed in
//         // seedFirestore().catch(console.error);
//         console.log(`User ${user.email} is currently authenticated.`);
//       } else {
//         console.log('No user is currently authenticated.');
//       }
//     });

//     // Cleanup the listener on component unmount
//     return () => unsubscribe();
//   }, []);


//   return (
//     <>
//       {showTabs ? (
//         <IonTabs>
//           <IonRouterOutlet>
//             <Route exact path="/home" component={Home} />
//             <Route exact path="/quiz" component={Quiz} />
//             <Route exact path="/progress" component={Progress} />
//             <Route exact path="/profile" component={Profile} />
//             <Route path="/finance-cards" component={FinanceCards} exact={true} />
//             <Route exact path="/">
//               <Redirect to="/slider" />
//             </Route>
//             <Route path="/categories" component={UnderConstruction} />
            
//           </IonRouterOutlet>
//           <IonTabBar slot="bottom">
//             <IonTabButton tab="home" href="/home">
//               <IonIcon aria-hidden="true" icon={albums} />
//               <IonLabel>Home</IonLabel>
//             </IonTabButton>
//             <IonTabButton tab="quiz" href="/quiz">
//               <IonIcon aria-hidden="true" icon={helpBuoy} />
//               <IonLabel>Quiz</IonLabel>
//             </IonTabButton>
//             <IonTabButton tab="progress" href="/progress">
//               <IonIcon aria-hidden="true" icon={ribbon} />
//               <IonLabel>Progress</IonLabel>
//             </IonTabButton>
//           </IonTabBar>
//         </IonTabs>
//       ) : (
//         <IonRouterOutlet>
//           <Route exact path="/slider" component={Slider} />
//           <Route exact path="/login" component={Login} />
//           <Route exact path="/profile" component={Profile} />
//           <Route exact path="/">
//             <Redirect to="/slider" />
//           </Route>
//           <Route path="/categories" component={UnderConstruction} /> 
        
//         </IonRouterOutlet>
//       )}
//     </>
//   );
// };

// export default App;