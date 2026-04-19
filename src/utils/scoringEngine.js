export function analyzeResume(text) {
  const lowerText = text.toLowerCase();
  const suggestions = [];
  
  // 1. Length Check
  const wordCount = text.split(/\s+/).length;
  let lengthScore = 100;
  
  if (wordCount < 200) {
    lengthScore = 40;
    suggestions.push('Resume is too short (under 200 words). Add more details to your experiences.');
  } else if (wordCount > 1000) {
    lengthScore = 40;
    suggestions.push('Resume is too long (over 1000 words). Condense your bullet points for better scannability.');
  }
  
  // 2. Presence of Sections
  const requiredSections = [
    { name: 'education', keywords: ['education', 'academic', 'university', 'college'] },
    { name: 'experience', keywords: ['experience', 'work history', 'employment'] },
    { name: 'skills', keywords: ['skills', 'technologies', 'core competencies', 'tools'] }
  ];
  
  let sectionScore = 0;
  const missingSections = [];
  
  requiredSections.forEach(section => {
    const found = section.keywords.some(kw => lowerText.includes(kw));
    if (found) {
      sectionScore += (100 / requiredSections.length);
    } else {
      missingSections.push(section.name);
    }
  });

  if (missingSections.length > 0) {
    suggestions.push(`Missing important sections: ${missingSections.join(', ')}.`);
  }

  // 3. Keyword density (skills)
  const commonSkills = ['react', 'javascript', 'python', 'java', 'node', 'sql', 'aws', 'agile', 'management', 'leadership', 'design', 'data'];
  const matchedSkills = commonSkills.filter(skill => lowerText.includes(skill));
  let keywordScore = Math.min((matchedSkills.length / 5) * 100, 100);
  
  if (matchedSkills.length < 5) {
     suggestions.push('Low keyword density detected. Consider explicitly listing more hard skills or industry technologies.');
  }

  // 4. Action Verbs Usage
  const actionVerbs = ['developed', 'managed', 'led', 'created', 'designed', 'built', 'improved', 'spearheaded', 'orchestrated', 'optimized'];
  const verbsUsed = actionVerbs.filter(verb => lowerText.includes(verb));
  let verbScore = Math.min((verbsUsed.length / 4) * 100, 100);
  
  if (verbsUsed.length < 3) {
    suggestions.push('Increase your use of strong action verbs (e.g., spearheaded, optimized, developed) at the start of your bullet points.');
  }

  const overallScore = Math.round(
    (lengthScore * 0.15) + 
    (sectionScore * 0.40) + 
    (keywordScore * 0.25) + 
    (verbScore * 0.20)
  );

  return {
    overallScore,
    sectionScores: {
      length: lengthScore,
      sections: Math.round(sectionScore),
      keywords: Math.round(keywordScore),
      actionVerbs: Math.round(verbScore)
    },
    metrics: { wordCount },
    suggestions
  };
}
