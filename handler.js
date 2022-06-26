'use strict';
const Alexa = require('ask-sdk-core')

const ensinamento = () => {
  const ensinamentos = [
    'Muito a aprender você ainda tem, jovem Padawan.',
    'Faça. Ou não faça. Não existe a tentativa',
    'O medo leva a raiva, a raiva leva ao ódio, o ódio leva ao sofrimento',
    'Paciência você deve ter meu jovem Padawan',
    'Um Jedi usa a Força para o conhecimento e defesa, nunca para o ataque.',
    'Raiva, medo, agressão. Ao lado sombrio elas pertencem'
  ]

  return 'Lembre-se do que o mestre Yoda disse: ' +
    ensinamentos[Math.floor(Math.random() * ensinamentos.length)]
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
  },
  handle(handlerInput) {
    const speechText = 'Olá, que a força esteja com você, me peça um ensinamento do mestre Yoda'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Olá, que a força esteja com você, me peça um ensinamento do mestre Yoda', speechText)
      .getResponse()
  }
}


const PedirEnsinamentoIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PedirEnsinamentoIntent'
  },
  async handle(handlerInput) {

    const speechText = ensinamento() //chamada a nossa função

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Mestre Yoda.', speechText)
      .getResponse()
  }
}

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent')
  },
  handle(handlerInput) {
    const speechText = 'Que a força esteja com você!'

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Que a força esteja com você!', speechText)
      .withShouldEndSession(true)
      .getResponse()
  }
}

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest'
  },
  handle(handlerInput) {
    // Any clean-up logic goes here.
    return handlerInput.responseBuilder.getResponse()
  }
}


const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Encontrei um probleminha, vamos tentar de novo ?')
      .reprompt('Encontrei um probleminha, vamos tentar de novo ?')
      .getResponse();
  }
}


let skill

module.exports.yoda = async (event) => {
  console.log(`[INFO] ${Date(Date.now())} Lambda disparada `)

  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler, //responsável por abrir nossa skill
        PedirEnsinamentoIntent,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler //responsável para encerrar nossa skill
      )
      .addErrorHandlers(ErrorHandler)//mensagem para caso de erros
      .create()
  }

  return await skill.invoke(event)
}