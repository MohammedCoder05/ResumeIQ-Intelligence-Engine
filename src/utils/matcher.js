export function matchJobDescription(resumeText, jdText) {
  if (!resumeText || !jdText) return { score: 0, missingKeywords: [], foundKeywords: [] };

  const resumeLower = resumeText.toLowerCase();
  
  // Basic NLP simulation: Extract common keywords from JD
  // Remove punctuation and common stop words
  const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'for', 'it', 'on', 'with', 'as', 'are', 'be', 'this', 'was', 'or', 'you', 'can', 'we', 'will', 'an', 'have', 'has', 'your', 'from']);
  
  const jdWords = jdText.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  // Count word frequencies in JD to find the most "important" keywords
  const frequency = {};
  jdWords.forEach(w => {
    frequency[w] = (frequency[w] || 0) + 1;
  });

  // Take the top 15 most frequent non-stop words as "Target Keywords"
  const targetKeywords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(entry => entry[0]);

  const foundKeywords = [];
  const missingKeywords = [];

  targetKeywords.forEach(kw => {
    if (resumeLower.includes(kw)) {
      foundKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const rawScore = targetKeywords.length > 0 ? (foundKeywords.length / targetKeywords.length) : 0;
  const score = Math.round(rawScore * 100) || 0;

  return {
    matchScore: score,
    matchedKeywords: foundKeywords,
    missingKeywords
  };
}
