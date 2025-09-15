/**
 * LoveOS Compatibility Engine
 * 
 * This engine calculates compatibility between two users based on:
 * 1. Big Five Personality Traits
 * 2. Love Languages
 * 3. Communication Styles
 * 4. Lifestyle Preferences
 * 5. Shared Values and Interests
 * 
 * Each factor is weighted and contributes to an overall compatibility score (0-100)
 */

class CompatibilityEngine {
  constructor() {
    // Weight configuration for different compatibility factors
    this.weights = {
      personality: 0.25,      // 25% - Core personality compatibility
      loveLanguages: 0.20,    // 20% - How they express and receive love
      communicationStyle: 0.20, // 20% - How they communicate
      lifestyle: 0.15,        // 15% - Daily life compatibility
      values: 0.10,           // 10% - Core values alignment
      interests: 0.10         // 10% - Shared interests and hobbies
    };
  }

  /**
   * Calculate overall compatibility between two profiles
   * @param {Object} profile1 - First user's profile
   * @param {Object} profile2 - Second user's profile
   * @returns {Object} Compatibility result with score and breakdown
   */
  calculateCompatibility(profile1, profile2) {
    const breakdown = {
      personality: this.calculatePersonalityCompatibility(profile1.personality, profile2.personality),
      loveLanguages: this.calculateLoveLanguageCompatibility(profile1.loveLanguages, profile2.loveLanguages),
      communicationStyle: this.calculateCommunicationCompatibility(profile1.communicationStyle, profile2.communicationStyle),
      lifestyle: this.calculateLifestyleCompatibility(profile1.lifestyle, profile2.lifestyle),
      values: this.calculateValuesCompatibility(profile1.values, profile2.values),
      interests: this.calculateInterestsCompatibility(profile1.interests, profile2.interests)
    };

    // Calculate weighted overall score
    const overallScore = Object.keys(breakdown).reduce((total, factor) => {
      return total + (breakdown[factor] * this.weights[factor]);
    }, 0);

    // Generate explanation
    const explanation = this.generateExplanation(breakdown, overallScore);

    return {
      compatibilityScore: Math.round(overallScore),
      compatibilityBreakdown: breakdown,
      explanation: explanation,
      isHighQuality: overallScore >= 75
    };
  }

  /**
   * Calculate personality compatibility based on Big Five traits
   * Uses complementary matching for some traits and similarity for others
   */
  calculatePersonalityCompatibility(personality1, personality2) {
    if (!personality1 || !personality2) return 50;

    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    let totalScore = 0;

    traits.forEach(trait => {
      const score1 = personality1[trait] || 50;
      const score2 = personality2[trait] || 50;
      const difference = Math.abs(score1 - score2);

      let compatibility;
      switch (trait) {
        case 'openness':
          // Similar openness levels work well together
          compatibility = 100 - (difference * 0.8);
          break;
        case 'conscientiousness':
          // Similar conscientiousness levels work well
          compatibility = 100 - (difference * 0.8);
          break;
        case 'extraversion':
          // Some difference in extraversion can be complementary
          compatibility = 100 - (difference * 0.6);
          break;
        case 'agreeableness':
          // High agreeableness in both is ideal
          const avgAgreeableness = (score1 + score2) / 2;
          compatibility = avgAgreeableness;
          break;
        case 'neuroticism':
          // Lower neuroticism is generally better for both
          const avgNeuroticism = (score1 + score2) / 2;
          compatibility = 100 - avgNeuroticism;
          break;
        default:
          compatibility = 100 - difference;
      }

      totalScore += Math.max(0, Math.min(100, compatibility));
    });

    return Math.round(totalScore / traits.length);
  }

  /**
   * Calculate love language compatibility
   * Matches how one person gives love with how the other receives it
   */
  calculateLoveLanguageCompatibility(loveLanguages1, loveLanguages2) {
    if (!loveLanguages1 || !loveLanguages2) return 50;

    const languages = ['wordsOfAffirmation', 'actsOfService', 'receivingGifts', 'qualityTime', 'physicalTouch'];
    let totalScore = 0;

    languages.forEach(language => {
      const give1 = loveLanguages1[language] || 20;
      const receive2 = loveLanguages2[language] || 20;
      const give2 = loveLanguages2[language] || 20;
      const receive1 = loveLanguages1[language] || 20;

      // Calculate bidirectional compatibility
      const compatibility1to2 = Math.min(give1, receive2) * 2; // Max 200, normalize to 100
      const compatibility2to1 = Math.min(give2, receive1) * 2;
      
      totalScore += (compatibility1to2 + compatibility2to1) / 2;
    });

    return Math.round(totalScore / languages.length);
  }

  /**
   * Calculate communication style compatibility
   */
  calculateCommunicationCompatibility(comm1, comm2) {
    if (!comm1 || !comm2) return 50;

    const styles = ['directness', 'emotionalExpression', 'conflictResolution', 'humor'];
    let totalScore = 0;

    styles.forEach(style => {
      const score1 = comm1[style] || 50;
      const score2 = comm2[style] || 50;
      const difference = Math.abs(score1 - score2);

      let compatibility;
      switch (style) {
        case 'directness':
          // Similar directness levels work well
          compatibility = 100 - (difference * 0.7);
          break;
        case 'emotionalExpression':
          // Some difference can be complementary
          compatibility = 100 - (difference * 0.5);
          break;
        case 'conflictResolution':
          // Similar conflict resolution styles work well
          compatibility = 100 - (difference * 0.8);
          break;
        case 'humor':
          // Similar humor levels are important
          compatibility = 100 - (difference * 0.9);
          break;
        default:
          compatibility = 100 - difference;
      }

      totalScore += Math.max(0, Math.min(100, compatibility));
    });

    return Math.round(totalScore / styles.length);
  }

  /**
   * Calculate lifestyle compatibility
   */
  calculateLifestyleCompatibility(lifestyle1, lifestyle2) {
    if (!lifestyle1 || !lifestyle2) return 50;

    const factors = ['socialActivity', 'adventure', 'routine', 'workLifeBalance'];
    let totalScore = 0;

    factors.forEach(factor => {
      const score1 = lifestyle1[factor] || 50;
      const score2 = lifestyle2[factor] || 50;
      const difference = Math.abs(score1 - score2);

      let compatibility;
      switch (factor) {
        case 'socialActivity':
          // Some difference in social activity can be complementary
          compatibility = 100 - (difference * 0.6);
          break;
        case 'adventure':
          // Similar adventure levels work well
          compatibility = 100 - (difference * 0.8);
          break;
        case 'routine':
          // Similar routine preferences work well
          compatibility = 100 - (difference * 0.7);
          break;
        case 'workLifeBalance':
          // Similar work-life balance values work well
          compatibility = 100 - (difference * 0.8);
          break;
        default:
          compatibility = 100 - difference;
      }

      totalScore += Math.max(0, Math.min(100, compatibility));
    });

    return Math.round(totalScore / factors.length);
  }

  /**
   * Calculate values compatibility
   */
  calculateValuesCompatibility(values1, values2) {
    if (!values1 || !values2 || values1.length === 0 || values2.length === 0) {
      return 50;
    }

    const set1 = new Set(values1);
    const set2 = new Set(values2);
    
    // Calculate Jaccard similarity
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    const similarity = intersection.size / union.size;
    return Math.round(similarity * 100);
  }

  /**
   * Calculate interests compatibility
   */
  calculateInterestsCompatibility(interests1, interests2) {
    if (!interests1 || !interests2 || interests1.length === 0 || interests2.length === 0) {
      return 50;
    }

    const set1 = new Set(interests1);
    const set2 = new Set(interests2);
    
    // Calculate Jaccard similarity
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    const similarity = intersection.size / union.size;
    return Math.round(similarity * 100);
  }

  /**
   * Generate a human-readable explanation of the compatibility
   */
  generateExplanation(breakdown, overallScore) {
    const explanations = [];
    
    // Find the strongest compatibility factors
    const sortedFactors = Object.entries(breakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    sortedFactors.forEach(([factor, score]) => {
      if (score >= 80) {
        explanations.push(this.getHighCompatibilityExplanation(factor));
      } else if (score >= 60) {
        explanations.push(this.getMediumCompatibilityExplanation(factor));
      }
    });

    // Add overall assessment
    if (overallScore >= 85) {
      explanations.unshift("Exceptional compatibility! You share deep connections across multiple areas.");
    } else if (overallScore >= 70) {
      explanations.unshift("Great compatibility! You have strong potential for a meaningful connection.");
    } else if (overallScore >= 55) {
      explanations.unshift("Good compatibility with room to grow together.");
    } else {
      explanations.unshift("Interesting potential - opposites can attract and complement each other.");
    }

    return explanations.join(' ');
  }

  getHighCompatibilityExplanation(factor) {
    const explanations = {
      personality: "Your personalities complement each other beautifully.",
      loveLanguages: "You speak each other's love language fluently.",
      communicationStyle: "You communicate in ways that resonate with each other.",
      lifestyle: "Your lifestyles are perfectly aligned.",
      values: "You share core values that create a strong foundation.",
      interests: "You have many shared interests to explore together."
    };
    return explanations[factor] || "You have strong compatibility in this area.";
  }

  getMediumCompatibilityExplanation(factor) {
    const explanations = {
      personality: "Your personalities have good potential for growth together.",
      loveLanguages: "You can learn to speak each other's love language.",
      communicationStyle: "Your communication styles can complement each other.",
      lifestyle: "Your lifestyles have good potential for harmony.",
      values: "You share some important values.",
      interests: "You have some shared interests to build upon."
    };
    return explanations[factor] || "You have decent compatibility in this area.";
  }

  /**
   * Generate AI icebreaker based on compatibility
   */
  generateIcebreaker(profile1, profile2, compatibility) {
    const icebreakers = [
      "I noticed we both love [shared interest]. What's your favorite thing about it?",
      "Your profile mentions [interest]. I'm curious about your experience with that!",
      "I see we have similar values around [value]. How did you develop that perspective?",
      "Your communication style seems really thoughtful. What's your approach to [topic]?",
      "I love that you're into [interest]. What got you started with that?"
    ];

    // For now, return a generic icebreaker
    // In a full implementation, this would use AI to generate personalized icebreakers
    return icebreakers[Math.floor(Math.random() * icebreakers.length)];
  }
}

module.exports = new CompatibilityEngine();
