// ============================================
// PROGRESS TRACKER - localStorage-based
// ============================================

const ProgressTracker = {
  
  // ============================================
  // CATEGORIES DEFINITION
  // ============================================
  
  CATEGORIES: {
    'habitual': {
      name: 'Habitual Actions',
      icon: '☕'
    },
    'routine': {
      name: 'Daily Routine',
      icon: '🌅'
    },
    'frequency': {
      name: 'Frequency + Manner',
      icon: '⚡'
    },
    'conjunctions': {
      name: 'Time Conjunctions',
      icon: '⏰'
    }
  },

  // ============================================
  // INITIALIZATION
  // ============================================
  
  init() {
    if (!localStorage.getItem('intuityProgress')) {
      this.resetProgress();
    }
    console.log('📊 Progress Tracker initialized');
  },

  // ============================================
  // RESET PROGRESS
  // ============================================
  
  resetProgress() {
    const initialProgress = {
      sarah: this.createCharacterProgress(),
      tom: this.createCharacterProgress(),
      emma: this.createCharacterProgress(),
      alex: this.createCharacterProgress()
    };
    localStorage.setItem('intuityProgress', JSON.stringify(initialProgress));
    console.log('🔄 Progress reset to default');
  },

  createCharacterProgress() {
    return {
      habitual: { matching: { score: 0 }, quiz: { score: 0 }, trophy: false },
      routine: { matching: { score: 0 }, quiz: { score: 0 }, trophy: false },
      frequency: { matching: { score: 0 }, quiz: { score: 0 }, trophy: false },
      conjunctions: { matching: { score: 0 }, quiz: { score: 0 }, trophy: false }
    };
  },

  // ============================================
  // GET PROGRESS
  // ============================================
  
  getProgress() {
    const data = localStorage.getItem('intuityProgress');
    return data ? JSON.parse(data) : null;
  },

  // ============================================
  // SAVE MATCHING SCORE
  // ============================================
  
  saveMatchingScore(characterKey, category, score) {
    const progress = this.getProgress();
    if (!progress[characterKey] || !progress[characterKey][category]) {
      console.error('Invalid character or category');
      return;
    }

    progress[characterKey][category].matching.score = score;
    
    // Check if trophy should be awarded
    this.checkTrophy(progress, characterKey, category);
    
    localStorage.setItem('intuityProgress', JSON.stringify(progress));
    console.log(`✅ Matching score saved: ${characterKey} - ${category} = ${score}/20`);
  },

  // ============================================
  // SAVE QUIZ SCORE
  // ============================================
  
  saveQuizScore(characterKey, category, score) {
    const progress = this.getProgress();
    if (!progress[characterKey] || !progress[characterKey][category]) {
      console.error('Invalid character or category');
      return;
    }

    progress[characterKey][category].quiz.score = score;
    
    // Check if trophy should be awarded
    this.checkTrophy(progress, characterKey, category);
    
    localStorage.setItem('intuityProgress', JSON.stringify(progress));
    console.log(`✅ Quiz score saved: ${characterKey} - ${category} = ${score}/20`);
  },

  // ============================================
  // CHECK TROPHY ELIGIBILITY
  // ============================================
  
  checkTrophy(progress, characterKey, category) {
    const cat = progress[characterKey][category];
    
    // Trophy awarded if BOTH matching and quiz are 20/20
    if (cat.matching.score === 20 && cat.quiz.score === 20 && !cat.trophy) {
      cat.trophy = true;
      console.log(`🏆 TROPHY AWARDED: ${characterKey} - ${category}`);
    }
  },

  // ============================================
  // GET CHARACTER PROGRESS
  // ============================================
  
  getCharacterProgress(characterKey) {
    const progress = this.getProgress();
    if (!progress[characterKey]) {
      return { completed: false, categories: [] };
    }

    const categories = Object.keys(this.CATEGORIES).map(catKey => {
      const cat = progress[characterKey][catKey];
      return {
        key: catKey,
        name: this.CATEGORIES[catKey].name,
        icon: this.CATEGORIES[catKey].icon,
        matchingScore: cat.matching.score,
        quizScore: cat.quiz.score,
        trophy: cat.trophy
      };
    });

    const allComplete = categories.every(cat => cat.trophy);

    return {
      completed: allComplete,
      categories: categories
    };
  },

  // ============================================
  // GET CATEGORY PROGRESS
  // ============================================
  
  getCategoryProgress(characterKey, categoryKey) {
    const progress = this.getProgress();
    if (!progress[characterKey] || !progress[characterKey][categoryKey]) {
      return {
        matching: { score: 0 },
        quiz: { score: 0 },
        trophy: false
      };
    }

    return progress[characterKey][categoryKey];
  },

  // ============================================
  // GET OVERALL PROGRESS
  // ============================================
  
  getOverallProgress() {
    const progress = this.getProgress();
    let totalTrophies = 0;
    const totalPossible = 16; // 4 characters × 4 categories

    Object.keys(progress).forEach(charKey => {
      Object.keys(progress[charKey]).forEach(catKey => {
        if (progress[charKey][catKey].trophy) {
          totalTrophies++;
        }
      });
    });

    const percentage = Math.round((totalTrophies / totalPossible) * 100);

    return {
      trophies: totalTrophies,
      total: totalPossible,
      percentage: percentage
    };
  },

  // ============================================
  // DEBUG: CLEAR ALL PROGRESS
  // ============================================
  
  clearAll() {
    localStorage.removeItem('intuityProgress');
    this.init();
    console.log('🗑️ All progress cleared');
  },

  // ============================================
  // DEBUG: AWARD TEST TROPHIES
  // ============================================
  
  awardTestTrophies() {
    const progress = this.getProgress();
    
    // Give Sarah's first category perfect scores
    progress.sarah.habitual.matching.score = 20;
    progress.sarah.habitual.quiz.score = 20;
    progress.sarah.habitual.trophy = true;
    
    // Give Tom's first category perfect scores
    progress.tom.habitual.matching.score = 20;
    progress.tom.habitual.quiz.score = 20;
    progress.tom.habitual.trophy = true;
    
    localStorage.setItem('intuityProgress', JSON.stringify(progress));
    console.log('🏆 Test trophies awarded to Sarah & Tom');
  }
};

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  ProgressTracker.init();
}

// Make available globally
if (typeof window !== 'undefined') {
  window.ProgressTracker = ProgressTracker;
}
