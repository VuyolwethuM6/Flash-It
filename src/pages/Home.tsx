import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonIcon,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonImg,
  useIonRouter
} from '@ionic/react';
import { searchOutline, trophyOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import './Home.css';

const LoadingDots: React.FC = () => (
  <div className="loading-dots">
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </div>
);

const Home: React.FC = () => {
  const router = useIonRouter();
  const history = useHistory();
  const [categories, setCategories] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [searching, setSearching] = useState<boolean>(false);

  // Fetch current user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        setUser(userSnap.data());
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const subjectsCollection = collection(db, 'subjects');
      const subjectSnapshot = await getDocs(subjectsCollection);
      const subjectList = subjectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(subjectList);
      setFilteredCategories(subjectList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearchClick = async () => {
    setSearching(true);
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
      setSearching(false);
      return;
    }
    try {
      const q = query(
        collection(db, 'subjects'),
        where('name', '>=', searchQuery),
        where('name', '<=', searchQuery + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const result = querySnapshot.docs.map(doc => doc.data());
      setFilteredCategories(result);
    } catch (error) {
      console.error("Error searching categories: ", error);
      setFilteredCategories([]);
    }
    setSearching(false);
  };

  const navigateToFlashcards = (categoryId: string) => {
    console.log(categoryId);
    history.push(`/flashcards/${categoryId}`);
  };

  const viewProfile = () => {
    history.push('/profile');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="custom-toolbar">
          <div className="header-content">
            <div className="xp-score">
              <IonIcon icon={trophyOutline} />
              <span>{user?.points || 0} XP</span>
            </div>
            <div className="user-avatar" onClick={viewProfile}>
              <img src={user?.profilePicture || 'https://bub.bh/wp-content/uploads/2018/02/image-placeholder.jpg'} alt="User Avatar" />
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="search-bar-container">
          <h1>Find flashcards you want to learn</h1>
          <div className="custom-searchbar">
            <input
              type="text"
              placeholder="Search for anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearchClick}>
              <IonIcon icon={searchOutline} />
            </button>
          </div>
        </div>

        <div className="category-header">
          <h2>Categories</h2>
          <a href="/categories">See all</a>
        </div>

        <IonGrid className="category-grid">
          <IonRow>
            {loading ? (
              <IonCol size="12">
                <LoadingDots />
              </IonCol>
            ) : (
              filteredCategories.length === 0 && !searching ? (
                <IonCol size="12">
                  <p>No categories available.</p>
                </IonCol>
              ) : (
                filteredCategories.length === 0 && searching ? (
                  <IonCol size="12">
                    <p>Flashcards not found...</p>
                  </IonCol>
                ) : (
                  filteredCategories.map((category, index) => (
                    <IonCol size="6" key={index} className="category-col">
                      <IonCard className="category-card" onClick={() => navigateToFlashcards(category.id)}>
                        <IonImg src={category.icon} />
                        <IonCardHeader>
                          <IonCardTitle>{category.name}</IonCardTitle>
                          <IonCardSubtitle>{category.description}</IonCardSubtitle>
                        </IonCardHeader>
                      </IonCard>
                    </IonCol>
                  ))
                )
              )
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;



// import React, { useEffect, useState } from 'react';
// import {
//   IonContent,
//   IonHeader,
//   IonPage,
//   IonIcon,
//   IonToolbar,
//   IonGrid,
//   IonRow,
//   IonCol,
//   IonCard,
//   IonCardHeader,
//   IonCardTitle,
//   IonCardSubtitle,
//   IonImg,
//   useIonRouter
// } from '@ionic/react';
// import { searchOutline, trophyOutline } from 'ionicons/icons';
// import { useHistory } from 'react-router-dom';
// import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
// import { db, auth } from '../firebaseConfig'; // Import the initialized Firebase instance
// import { onAuthStateChanged } from 'firebase/auth';
// import './Home.css';

// const LoadingDots: React.FC = () => (
//   <div className="loading-dots">
//     <div className="dot"></div>
//     <div className="dot"></div>
//     <div className="dot"></div>
//   </div>
// );

// const Home: React.FC = () => {
//   const router = useIonRouter();
//   const history = useHistory();
//   const [categories, setCategories] = useState<any[]>([]);
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
//   const [searching, setSearching] = useState<boolean>(false);

//   // Fetch current user data
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         const userRef = doc(db, 'users', user.uid);
//         const userSnap = await getDoc(userRef);
//         setUser(userSnap.data());
//         setLoading(false);
//       } else {
//         setUser(null);
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const subjectsCollection = collection(db, 'subjects');
//       const subjectSnapshot = await getDocs(subjectsCollection);
//       const subjectList = subjectSnapshot.docs.map(doc => doc.data());
//       setCategories(subjectList);
//       setFilteredCategories(subjectList);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching categories: ", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleSearchClick = async () => {
//     setSearching(true);
//     if (searchQuery.trim() === '') {
//       setFilteredCategories(categories);
//       setSearching(false);
//       return;
//     }
//     try {
//       const q = query(collection(db, 'subjects'), where('name', '>=', searchQuery), where('name', '<=', searchQuery + '\uf8ff'));
//       const querySnapshot = await getDocs(q);
//       const result = querySnapshot.docs.map(doc => doc.data());
//       setFilteredCategories(result);
//     } catch (error) {
//       console.error("Error searching categories: ", error);
//       setFilteredCategories([]);
//     }
//     setSearching(false);
//   };

//   const navigateToFinanceCards = () => {
//     router.push('/finance-cards');
//   };

//   const viewProfile = () => {
//     history.push('/profile');
//   };

//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar className="custom-toolbar">
//           <div className="header-content">
//             <div className="xp-score">
//               <IonIcon icon={trophyOutline} />
//               <span>{user?.points || 0} XP</span>
//             </div>
//             <div className="user-avatar" onClick={viewProfile}>
//               <img src={user?.profilePicture || 'https://bub.bh/wp-content/uploads/2018/02/image-placeholder.jpg'} alt="User Avatar" />
//             </div>
//           </div>
//         </IonToolbar>
//       </IonHeader>
//       <IonContent fullscreen>
//         <div className="search-bar-container">
//           <h1>Find flashcards you want to learn</h1>
//           <div className="custom-searchbar">
//             <input
//               type="text"
//               placeholder="Search for anything"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <button onClick={handleSearchClick}>
//               <IonIcon icon={searchOutline} />
//             </button>
//           </div>
//         </div>

//         <div className="category-header">
//           <h2>Categories</h2>
//           <a href="/categories">See all</a>
//         </div>

//         <IonGrid className="category-grid">
//           <IonRow>
//             {loading ? (
//               <IonCol size="12">
//                 <LoadingDots />
//               </IonCol>
//             ) : (
//               filteredCategories.length === 0 && !searching ? (
//                 <IonCol size="12">
//                   <p>No categories available.</p>
//                 </IonCol>
//               ) : (
//                 filteredCategories.length === 0 && searching ? (
//                   <IonCol size="12">
//                     <p>Flashcards not found...</p>
//                   </IonCol>
//                 ) : (
//                   filteredCategories.map((category, index) => (
//                     <IonCol size="6" key={index} className="category-col">
//                       <IonCard className="category-card">
//                         <IonImg src={category.icon} />
//                         <IonCardHeader>
//                           <IonCardTitle>{category.name}</IonCardTitle>
//                           <IonCardSubtitle>{category.description}</IonCardSubtitle>
//                         </IonCardHeader>
//                       </IonCard>
//                     </IonCol>
//                   ))
//                 )
//               )
//             )}
//           </IonRow>
//         </IonGrid>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default Home;
