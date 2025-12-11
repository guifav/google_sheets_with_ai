const OPENAI_API_KEY = "sua_apikey_aqui";
const ANTHROPIC_API_KEY = "sua_apikey_aqui";
const GROK_API_KEY = "sua_apikey_aqui";
const GEMINI_API_KEY = "sua_apikey_aqui";

/**
 * Envia um prompt com referências a células para o modelo GPT-5 da OpenAI.
 *
 * @param {string} prompt O prompt de texto inicial.
 * @param {any[]} args Argumentos adicionais (podem ser strings ou referências a células).
 * @return {string} A resposta gerada pelo modelo.
 * @customfunction
 */
function chatgpt(prompt, ...args) {
  if (!prompt) {
    return 'O prompt inicial está vazio.';
  }

  const url = 'https://api.openai.com/v1/responses';

  // Constrói o conteúdo completo para o prompt
  let fullPrompt = prompt;
  if (args.length > 0) {
    fullPrompt += ' ' + args.join(' ');
  }

  const options = {
    'method' : 'post',
    'contentType': 'application/json',
    'headers': {
      'Authorization': 'Bearer ' + OPENAI_API_KEY
    },
    'payload' : JSON.stringify({
      'model': 'gpt-5.1-chat-latest',
      'input': [
        {
          'role': 'developer',
          'content': [
            {
              'type': 'input_text',
              'text': fullPrompt
            }
          ]
        }
      ],
      'text': {
        'format': {
          'type': 'text'
        },
        'verbosity': 'medium'
      },
      'reasoning': {
        'effort': 'medium'
      },
      'tools': [],
      'store': true,
      'include': [
        'reasoning.encrypted_content',
        'web_search_call.action.sources'
      ]
    })
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());

    // A resposta está em data.output, procuramos o item do tipo "message"
    if (data.output && data.output.length > 0) {
      for (let outputItem of data.output) {
        if (outputItem.type === 'message' && outputItem.content && outputItem.content.length > 0) {
          for (let contentItem of outputItem.content) {
            if (contentItem.type === 'output_text' && contentItem.text) {
              return contentItem.text.trim();
            }
          }
        }
      }
    }

    return 'Resposta não encontrada na estrutura da API.';

  } catch(e) {
    return 'Erro na API: ' + e.message;
  }
}


/**
 * Envia um prompt com referências a células para o modelo Claude da Anthropic.
 *
 * @param {string} prompt O prompt de texto inicial.
 * @param {any[]} args Argumentos adicionais (podem ser strings ou referências a células).
 * @return {string} A resposta gerada pelo modelo.
 * @customfunction
 */
function claude(prompt, ...args) {
  if (!prompt) {
    return 'O prompt inicial está vazio.';
  }

  const url = 'https://api.anthropic.com/v1/messages';

  // Constrói o conteúdo completo para o prompt
  let fullPrompt = prompt;
  if (args.length > 0) {
    fullPrompt += ' ' + args.join(' ');
  }

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    'payload': JSON.stringify({
      'model': 'claude-sonnet-4-5-20250929',
      'max_tokens': 64000,
      'messages': [
        {
          'role': 'user',
          'content': fullPrompt
        }
      ]
    })
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());

    if (data.content && data.content.length > 0) {
      const resultado = data.content[0].text.trim();
      return resultado;
    } else {
      return 'Resposta inválida da API.';
    }
  } catch(e) {
    return 'Erro na API: ' + e.message;
  }
}


/**
 * Envia um prompt com referências a células para o modelo Grok da x.ai.
 *
 * @param {string} prompt O prompt de texto inicial.
 * @param {any[]} args Argumentos adicionais (podem ser strings ou referências a células).
 * @return {string} A resposta gerada pelo modelo.
 * @customfunction
 */
function grok(prompt, ...args) {
  if (!prompt) {
    return 'O prompt inicial está vazio.';
  }

  const url = 'https://api.x.ai/v1/chat/completions';

  // Constrói o conteúdo completo para o prompt
  let fullPrompt = prompt;
  if (args.length > 0) {
    fullPrompt += ' ' + args.join(' ');
  }

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'Authorization': 'Bearer ' + GROK_API_KEY
    },
    'payload': JSON.stringify({
      'model': 'grok-4-1-fast-non-reasoning',
      'messages': [
        {
          'role': 'user',
          'content': fullPrompt
        }
      ],
      'temperature': 0.7,
      'stream': false
    })
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());

    if (data.choices && data.choices.length > 0) {
      const resultado = data.choices[0].message.content.trim();
      return resultado;
    } else {
      return 'Resposta inválida da API.';
    }
  } catch(e) {
    return 'Erro na API: ' + e.message;
  }
}


/**
 * Envia um prompt com referências a células para o modelo Gemini do Google.
 *
 * @param {string} prompt O prompt de texto inicial.
 * @param {any[]} args Argumentos adicionais (podem ser strings ou referências a células).
 * @return {string} A resposta gerada pelo modelo.
 * @customfunction
 */
function geminy(prompt, ...args) {
  if (!prompt) {
    return 'O prompt inicial está vazio.';
  }

  const model = 'gemini-3-pro-preview';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  // Constrói o conteúdo completo para o prompt
  let fullPrompt = prompt;
  if (args.length > 0) {
    fullPrompt += ' ' + args.join(' ');
  }

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify({
      'contents': [
        {
          'role': 'user',
          'parts': [
            {
              'text': fullPrompt
            }
          ]
        }
      ],
      'generationConfig': {
        'temperature': 0.7,
        'maxOutputTokens': 8192
      }
    })
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());

    if (data.candidates && data.candidates.length > 0 &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0) {
      const resultado = data.candidates[0].content.parts[0].text.trim();
      return resultado;
    } else {
      return 'Resposta inválida da API.';
    }
  } catch(e) {
    return 'Erro na API: ' + e.message;
  }
}
