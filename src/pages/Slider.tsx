// App.tsx
import React, { useState } from 'react';
import { IonApp, IonContent, IonButton } from '@ionic/react';
import { useSwipeable } from 'react-swipeable';
import '@ionic/react/css/core.css';
import './Slider.css';

const Slider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Create Your Flashcards",
      description: "Easily create and organize your study materials",
      icon: "📚"
    },
    {
      title: "Study Smartly",
      description: "Use spaced repetition and active recall techniques",
      icon: "💡"
    },
    {
      title: "Track Your Progress",
      description: "Monitor your learning and celebrate achievements",
      icon: "📈"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true
    // preventDefaultTouchmoveEvent: true,
  });

  const goToLogin = () => {
    // Navigate to login screen
    console.log("Navigating to login screen");
    // Replace this with your actual navigation logic
    // For example: history.push('/login');
  };

  return (
    <IonApp>
      <IonContent fullscreen>
        <div className="skip-button">
          <IonButton fill="clear" routerLink="/login">
            Skip
          </IonButton>
        </div>
        <div className="slider-container" {...handlers}>
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="slide-content">
                <div className="icon">{slide.icon}</div>
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
          <div className="navigation">
            <div className="dots">
              {slides.map((_, index) => (
                <div 
                  key={index} 
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
            {currentSlide < slides.length - 1 ? (
              <IonButton onClick={nextSlide} className="next-button">
                Next
              </IonButton>
            ) : (
              <IonButton routerLink="/login" className="get-started-button">
                Get Started
              </IonButton>
            )}
          </div>
        </div>
      </IonContent>
    </IonApp>
  );
};

export default Slider;