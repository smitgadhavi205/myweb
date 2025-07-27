import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';

// Extract text from various file formats
export async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  try {
    if (ext === '.pdf') {
      return await extractTextFromPDF(filePath);
    } else if (ext === '.docx' || ext === '.doc') {
      return await extractTextFromWord(filePath);
    } else {
      throw new Error(`Unsupported file format: ${ext}`);
    }
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error);
    throw error;
  }
}

// Extract text from PDF
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

// Extract text from Word document
async function extractTextFromWord(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

// Extract aims from text
export function extractAimsFromText(text) {
  const aims = [];
  const lines = text.split('\n');
  let currentAim = '';
  let practicalNumber = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for aim indicators
    if (line.toLowerCase().includes('aim') || 
        line.toLowerCase().includes('objective') || 
        line.toLowerCase().includes('practical')) {
      
      if (currentAim) {
        aims.push({
          id: practicalNumber++,
          text: currentAim.trim(),
          keywords: extractKeywords(currentAim)
        });
        currentAim = '';
      }
      
      currentAim = line;
    } else if (currentAim && line) {
      currentAim += ' ' + line;
    } else if (currentAim && !line) {
      aims.push({
        id: practicalNumber++,
        text: currentAim.trim(),
        keywords: extractKeywords(currentAim)
      });
      currentAim = '';
    }
  }

  if (currentAim) {
    aims.push({
      id: practicalNumber,
      text: currentAim.trim(),
      keywords: extractKeywords(currentAim)
    });
  }

  return aims;
}

// Extract code blocks from text
export function extractCodeFromText(text) {
  const codeBlocks = [];
  const lines = text.split('\n');
  let inCodeBlock = false;
  let currentCode = '';
  let codeIndex = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect code block markers
    if (line.includes('```') || line.includes('```')) {
      if (inCodeBlock && currentCode.trim()) {
        const language = detectLanguage(currentCode);
        codeBlocks.push({
          id: codeIndex++,
          code: currentCode.trim(),
          language: language,
          keywords: extractCodeKeywords(currentCode)
        });
        currentCode = '';
      }
      inCodeBlock = !inCodeBlock;
    } else if (inCodeBlock) {
      currentCode += line + '\n';
    } else if (line.trim() && (
      line.includes('def ') || 
      line.includes('function') || 
      line.includes('public class') ||
      line.includes('#include') ||
      line.includes('import ')
    )) {
      // Detect code without markdown blocks
      currentCode = line + '\n';
      inCodeBlock = true;
    }
  }

  if (currentCode.trim()) {
    const language = detectLanguage(currentCode);
    codeBlocks.push({
      id: codeIndex,
      code: currentCode.trim(),
      language: language,
      keywords: extractCodeKeywords(currentCode)
    });
  }

  return codeBlocks;
}

// Helper functions
function extractKeywords(text) {
  const keywords = [];
  const words = text.toLowerCase().split(/\W+/);
  const importantWords = ['array', 'loop', 'function', 'class', 'sort', 'search', 'calculate', 'print', 'input', 'output', 'file', 'database', 'web', 'api', 'algorithm', 'data', 'structure'];
  
  words.forEach(word => {
    if (importantWords.includes(word) && !keywords.includes(word)) {
      keywords.push(word);
    }
  });
  
  return keywords;
}

function extractCodeKeywords(code) {
  const keywords = [];
  const codeWords = code.toLowerCase().split(/\W+/);
  const codeKeywords = ['print', 'input', 'for', 'while', 'if', 'else', 'function', 'def', 'class', 'import', 'include', 'main', 'return', 'void', 'int', 'string', 'array', 'list'];
  
  codeWords.forEach(word => {
    if (codeKeywords.includes(word) && !keywords.includes(word)) {
      keywords.push(word);
    }
  });
  
  return keywords;
}

function detectLanguage(code) {
  const languagePatterns = {
    'python': [/def\s+\w+\(/, /import\s+\w+/, /print\s*\(/, /if\s+__name__\s*==\s*['"]+__main__['"]+/],
    'java': [/public\s+class\s+\w+/, /public\s+static\s+void\s+main/, /System\.out\.print/],
    'cpp': [/#include\s*<.*>/, /using\s+namespace\s+std/, /cout\s*<</],
    'c': [/#include\s*<.*>/, /printf\s*\(/, /scanf\s*\(/],
    'javascript': [/function\s+\w+\(/, /console\.log\s*\(/, /var\s+\w+\s*=/]
  };

  const scores = {};
  
  for (const [lang, patterns] of Object.entries(languagePatterns)) {
    scores[lang] = 0;
    for (const pattern of patterns) {
      if (pattern.test(code)) {
        scores[lang]++;
      }
    }
  }
  
  const detectedLang = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  return scores[detectedLang] > 0 ? detectedLang : 'text';
}